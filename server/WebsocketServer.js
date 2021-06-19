const { matchById } = require( "./Tournament" );
const { Server } = require( "socket.io" );
const { maps } = require( "sd2-data" );
const sd2LeagueMaps = maps.mapData.sd2League
const fetch = require("node-fetch")

function getRandom( arr, n ) {
  var result = new Array( n ),
    len = arr.length,
    taken = new Array( len );
  if ( n > len )
    throw new RangeError( "getRandom: more elements taken than available" );
  while (n--) {
    var x = Math.floor( Math.random() * len );
    result[ n ] = arr[ x in taken ? taken[ x ] : x ];
    taken[ x ] = --len in taken ? taken[ len ] : len;
  }
  return result;
}

let subscribers = []

class WebSocketServer {
  constructor( server ) {
    
    this.matches = []
    const io = new Server( server, {
      cors: {
        origin: process.env.APP_URL,
        methods: ["GET", "POST", "PUT"]
      }
    } );
    this.io = io
    global.io = io
    io.on( 'connection', ( socket ) => {
      
      socket.on( "close", () => {
      
      } )
      
      socket.on( 'message', ( message ) => {
        try {
          console.log( { message } )
          const json = JSON.parse( message )
          const { event } = json
          console.log( event, { json } )
          if ( event ) {
            this.handleMessage( socket, event, json )
          }
        } catch (err) {
          console.error( err )
          // meh
        }
      } )
      this.send( socket, "READY", true )
    } )
  }
  
  send( socket, event, data ) {
    socket.emit( JSON.stringify( { event, data } ) )
  }
  
  broadCastToMatch( match ) {
    this.io.broadcast( match )
  }
  
  handleMessage( socket, event, { data, phase, playerToken, matchId } ) {
    let match = matchId && matchById[ matchId ]
    let isAuthorized = false
    console.log( "HANDLE MESSAGE", { event, data, phase, playerToken, matchId, match } )
    if ( !match ) {
      this.send( socket, "ERROR", { error: "NO MATCH FOUND" } )
      return
    }
    
    let player = match.playerByToken[ playerToken ]
    let otherPlayer = player === match.player1 ? match.player2 : match.player1
    
    if ( data.token === match.token0 || data.token === match.token1 ) {
      isAuthorized = true
    }
    
    switch (event) {
      case "INPUT":
        if ( phase && player ) {
          player.dataByPhase[ phase ] = data
        }
        if ( phase === "COINSIDE" && !match.coinFlip ) {
          match.coinFlip = Math.random() > 0.5 ? "Heads" : "Tails"
          this.io.emit( "MSG", { id: match.id, content: `Coin lands on ${match.coinFlip}` } )
  
        }
        
        if ( phase === "PLAYER_SELECTION" && !match.PLAYER_SELECTION ) {
          player.playerSlot = data === 1 ? 1 : 2
          otherPlayer.playerSlot = data === 1 ? 2 : 1
          match.PLAYER_SELECTION = true
          // PREPARE MAP POOL
          match.maps = getRandom( sd2LeagueMaps, 3 )
        }
        
        if ( phase === "MAP_BAN" ) {
          player.mapBan = data
          match.MAP_BAN = [...player.mapBan || [], ...otherPlayer.mapBan || []]
          if ( player.mapBan && otherPlayer.mapBan ) {
            match.MAP_SELECTION = match.maps.filter( mapName => !match.MAP_BAN.includes( mapName ) )[ 0 ]
          }
        }
        
        if ( phase === "BAN_DIV0" ) {
          player.divBan0 = data
          match.DIV_BANS = [...player.divBan0 || [], ...otherPlayer.divBan0 || [], ...player.divBan1 || [], ...otherPlayer.divBan1 || []]
        }
        
        if ( phase === "BAN_DIV1" ) {
          player.divBan1 = data
          match.DIV_BANS = [...player.divBan0 || [], ...otherPlayer.divBan0 || [], ...player.divBan1 || [], ...otherPlayer.divBan1 || []]
        }
        
        if ( phase === "PICK_FACTION" ) {
          player.faction = data
          if ( player.faction && otherPlayer.faction ) {
            match.FACTIONS_PICKED = true
          }
        }
        
        if ( phase === "PICK_DIVISION" ) {
          player.division = data
          if ( player.division && otherPlayer.division ) {
            match.DIVISIONS_PICKED = true
          }
        }
        
        if ( phase === "PICK_INCOME" ) {
          player.income = data
          if ( player.income && otherPlayer.income ) {
            match.INCOME_PICKED = true
          
          }
        }
        
        // socket.send( "event", match )
        // ROOMS NOT WORKING. Strangely.
        // this.io.to( `match-${match.id}`, ).emit( "message", { match } )
        this.io.emit( "MATCH:UPDATE", match )
        // match.setPlayerData( playerToken, data )
        // match.broadcast( "MATCH:UPDATE", match.export( playerToken ) )
        break;
      case "JOIN":
        console.log( "JOIN", `match-${match.id}`, { match } )
        
        break;
    }
  }
}

saveDataToSheety()

function saveDataToSheety(match){
  console.log( "SAVE DATA " )
  // FINISH DATA
  let url = 'https://api.sheety.co/c244d864e64e67ddbf0def8c44c07969/sd2BotData/sheet1';
  let body = {
    sheet1: {
      "id": 12,
      "name": 32
    }
  }
  fetch( url, {
    method: 'POST',
    body: JSON.stringify( body ),
    headers: {
      "content-type": "application/json"
    }
  } )
    .then(res => {
      console.log("response", res)
      return res
    })
    .then( ( response ) => response.json() )
    .then( json => {
      // Do something with object
      console.log( "SAVED", json.sheet1 );
    } );
}


module.exports = WebSocketServer