const { uniqueNamesGenerator, adjectives, colors, animals } = require( 'unique-names-generator' );
const fetch = require( "node-fetch" )
const CHALLONGE_API_TOKEN = process.env.CHALLONGE_API_TOKEN
const mongo = require( "./db/mongo" )

let tournamentById = {}
let matchById = {}
let participantById = {}

const createShortName = () => {
  return uniqueNamesGenerator( {
    dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
    separator: "-",
    length: 3
  } ); // big-red-donkey
}

class Participant {
  constructor( data ) {
    // data contains personal information (email) which shall not leak
    this.id = data.id
    this._id = data.id
    this.name = data.name
    //
    this.hash = data.name || createShortName()
    this.dataByPhase = {}
  }
}

class Match {
  constructor( data, old, playerById ) {
    Object.assign( this, old )
    this.id = data.id
    this._id = data.id
    this.state = data.state
    this.player1_id = data.player1_id
    this.player2_id = data.player2_id
    this.player1 = playerById[ this.player1_id ]
    this.player2 = playerById[ this.player2_id ]
    this.winner_id = data.winner_id
    this.loser_id = data.loser_id
    this.playerByToken =   this.playerByToken || {}
    if ( this.player1 ) this.playerByToken[ this.player1.hash ] = this.player1
    if ( this.player2 ) this.playerByToken[ this.player2.hash ] = this.player2
  }
}

class Tournament {
  matches = []
  participants = []
  playerById = {}
  matchById = {}
  
  constructor( tournamentId ) {
    this.tournamentId = tournamentId
    tournamentById[ tournamentId ] = this
  }
  
  async fetchTournament() {
    const t = await fetch( `https://api.challonge.com/v1/tournaments/${this.tournamentId}.json?api_key=${CHALLONGE_API_TOKEN}&include_matches=1&include_participants=1` )
      .then( res => res.json() )
    this.data = t.tournament
    this.data._id = this.tournamentId
    this.participants = this.data.participants.map( p => new Participant( p.participant ) )
    this.participants.forEach( player => {
      this.playerById[ player.id ] = player
      participantById[ player.id ] = player
      console.log( { player } )
      mongo.Participants.addParticipant( player )
    } )
    
    let matches = []
    this.data.matches.map( data => {
      matches.push( data.match )
      let secondMatch = {
        ...data.match,
        id: data.match.id + "-2"
      }
      matches.push( secondMatch )
    } )
    
    
    let promises = this.matches = matches.map( async match => {
      let oldMatchData = await mongo.Matches.findById( match._id )
      let newMatch = new Match( match, oldMatchData, this.playerById )
      this.matchById[ match.id ] = newMatch
      matchById[ match.id ] = newMatch
      return newMatch
    } )
    
    this.matches = await Promise.all( promises )
    
    // PERSIST TO DB
    this.matches.forEach( match => {
      match.tournamentId = this.data._id
      mongo.Matches.addMatch( match )
    } )
    await mongo.Tournament.addTournament( this.data )
    
  }
  
  async fetchMatches() {
    const matches = await fetch( `https://api.challonge.com/v1/tournaments/${this.tournamentId}/matches.json?api_key=${CHALLONGE_API_TOKEN}` )
      .then( res => res.json() )
    this.matches = matches.map( m => new Match( m.match, this.matchById[ m.match.id ] ) )
    this.matches.forEach( match => {
      this.matchById[ match.id ] = match
    } )
  }
  
  async fetchParticipants() {
    const participants = await fetch( `https://api.challonge.com/v1/tournaments/${this.tournamentId}/participants.json?api_key=${CHALLONGE_API_TOKEN}` )
      .then( res => res.json() )
    this.participants = participants.map( p => new Participant( p.participant ) )
    this.participants.forEach( player => {
      this.playerById[ player.id ] = player
    } )
  }
}

module.exports = { Tournament, tournamentById, matchById }