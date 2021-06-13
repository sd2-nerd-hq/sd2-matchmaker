const { Server } = require("socket.io");

let subscribers = []

class WebSocketServer {
  constructor( server ) {

    this.matches = []
    const io = new Server(server);
    io.on( 'connection', ( socket ) => {
      
      socket.on( "close", () => {
        subscribers = subscribers.filter( sub => sub !== socket )
      } )
      
      socket.on( 'message', ( message ) => {
        try {
          const json = JSON.parse( message )
          const { event, data, token, matchId } = json
          console.log( event, data )
          if ( event && data ) {
            this.handleMessage( socket, event, data, { token, matchId } )
          }
        } catch (err) {
          // meh
        }
        console.log( 'received: %s', message );
      } );
      
      this.send( socket, "READY", true )
    } );
  }
  
  send( socket, event, data ) {
    socket.send( JSON.stringify( { event, data } ) )
  }
  
  broadCastToMatch( match ) {
  
  }
  
  handleMessage( ws, event, data, { token, matchId } ) {
    let match = matchId && this.matches[ matchId ]
    let isAuthorized = false
    if ( !match ) {
      this.send( "ERROR", { error: "NO MATCH FOUND" } )
      return
    }
    
    if ( data.token === match.token0 || data.token === match.token1 ) {
      isAuthorized = true
    }
    
    switch (event) {
      case "INPUT":
        match.setPlayerData( token, data )
        match.broadcast( "MATCH:UPDATE", match.export( token ) )
        break;
      case "JOIN":
        if ( match ) {
          match.setPlayerData( token, { isJoined: true } )
          match.subscribers.push( ws )
          match.broadcast( "MATCH:UPDATE", match.export( token ) )
          this.send( ws, "MATCH:INIT", match.export( token ) )
        } else {
          match.subscribers.push( ws )
          this.send( ws, "MATCH:UPDATE", match.export( token ) )
        }
        break;
    }
  }
}


module.exports = WebSocketServer