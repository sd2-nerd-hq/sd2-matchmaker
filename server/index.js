require( 'dotenv' ).config()
const WebsocketServer = require( "./WebsocketServer" )
const PORT = process.env.PORT || 8080
const express = require( 'express' );
const app = express();
const cors = require( "cors" )
const http = require( 'http' );
const { Tournament } = require( "./Tournament" );
const getTournament = require( "./getTournament" );
const server = http.createServer( app );

app.use( cors() )

app.get( '/', ( req, res ) => {
  res.sendFile( __dirname + '/index.html' );
} )

app.post( "/tournament/:tournamentId/:matchId", async ( req, res ) => {
  const { playerToken } = req.query
  console.log( { playerToken } )
  let t = await getTournament( req.params.tournamentId )
  let match = t.matchById[ req.params.matchId ]
  res.json( match )
} )

app.get( "/tournament/:tournamentId/:matchId", async ( req, res ) => {
  const { playerToken } = req.query
  console.log( { playerToken } )
  let t = await getTournament( req.params.tournamentId )
  let match = t.matchById[ req.params.matchId ]
  
  let isPlayer1, editable, isPlayer2, activePlayerName = false
  
  if ( match ) {
    if ( match.player1 && match.player1.hash === playerToken ) {
      isPlayer1 = true
      activePlayerName = match.player1.name
      editable = true
    }
    if ( match.player2 && match.player2.hash === playerToken ) {
      isPlayer2 = true
      activePlayerName = match.player2.name
      editable = true
    }
  }
  res.json( { match, editable, isPlayer2, isPlayer1, activePlayerName } )
} )

//ADMIN RELOAD TOURNAMENT
app.get( "/tournament/:tournamentId", async ( req, res ) => {
  const tournamentId = Number( req.params.tournamentId )
  let tournament = await getTournament( req.params.tournamentId )
  // const tournament = new Tournament( tournamentId )
  // await tournament.fetchTournament()
  // await tournament.fetchParticipants()
  console.log( { tournament } )

  
  const matchLinks = tournament.matches.map( match => {
    const player1 = tournament.playerById[ match.player1_id ]
    const player2 = tournament.playerById[ match.player2_id ]
    
    let linkMatch = `${process.env.APP_URL}/tournament/${tournamentId}/${match.id}`
    let linkPlayer1 = player1 && `${process.env.APP_URL}/tournament/${tournamentId}/${match.id}/${player1.hash}`
    let linkPlayer2 = player2 && `${process.env.APP_URL}/tournament/${tournamentId}/${match.id}/${player2.hash}`
    
    return {
      match,
      linkMatch,
      linkPlayer1,
      linkPlayer2,
      player1,
      player2,
      state: match.state
    }
  } )
  res.json( matchLinks )
} )

server.listen( PORT, () => {
  console.log( 'listening on *:PORT' );
} );

app.get( '/matches', ( req
  , res ) => {
  res.send( '<h1>Hello world</h1>' );
} );


const matches = {}
global.matches = matches

const wss = new WebsocketServer( server )
global[ "wss" ] = wss
