const { Tournament, matchById, tournamentById } = require( "./Tournament" );

require( 'dotenv' ).config()
const { uniqueNamesGenerator, adjectives, colors, animals } = require( 'unique-names-generator' );
const fetch = require( "node-fetch" )
const CHALLONGE_API_TOKEN = process.env.CHALLONGE_API_TOKEN


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
    this.name = data.name
    this.hash = createShortName()
  }
}

class Match {
  constructor( data, old, playerById ) {
    Object.assign( this, old )
    this.id = data.id
    this.state = data.state
    this.player1_id = data.player1_id
    this.player2_id = data.player2_id
    this.player1 = playerById[ this.player1_id ]
    this.player2 = playerById[ this.player2_id ]
    this.winner_id = data.winner_id
    this.loser_id = data.loser_id
  }
}


const getTournament = async ( tournamentId ) => {
  let t = tournamentById[ tournamentId ]
  if ( !t ) {
    t = new Tournament( tournamentId )
    await t.fetchTournament()
    // await t.fetchMatches()
    // await t.fetchParticipants()
  }
  tournamentById[ tournamentId ] = t
  return t
}


module.exports = getTournament