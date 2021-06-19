import create from "zustand";
import cogoToast from 'cogo-toast';
import { io } from "socket.io-client";

class Socket {
  playerToken = false
  matchId = false
  
  constructor() {
    let socket = new io( process.env.REACT_APP_WEBSOCKET_SERVER )
    this.socket = socket
    
    this.socket.on( "connect", () => {
      useServer.setState( () => ({ ready: true }) )
      // Web Socket is connected, send data using send()
      console.log( "Message is sent..." );
    } )
    
    this.socket.onAny( ( event, ...args ) => {
      console.log( `got ${event}`, args );
      this.handleMessage( event, ...args )
    } );
    
  }
  
  setPlayerToken( playerToken ) {
    this.playerToken = playerToken
  }
  
  setMatchId( matchId ) {
    this.matchId = matchId
  }
  
  handleMessage( event, data ) {
    console.log( { event, data } )
    switch (event) {
      case "MSG":
        if ( this.matchId == data.id && data.content ) {
          console.log( "MSG", data )
          cogoToast.info( data.content, {
            position: "bottom-center"
          } );
        }
        
      
        break;
      case "MATCH:INIT":
      case "MATCH:UPDATE":
        if ( this.matchId == data.id ) {
          console.log( "MATCH:UPDATE", data )
          useServer.setState( () => ({ match: data }) )
        } else {
          console.info( "received info for another matchId", this.matchId, data.id, data )
        }
        break;
    }
  }
  
  sendPhaseInput( phase, data ) {
    console.log( "SEND PHASE INPUT", phase, data )
    this.socket.send( JSON.stringify( { event: "INPUT", phase, data, matchId: this.matchId, playerToken: this.playerToken } ) )
  }
  
  send( event, data ) {
    console.log( "SEND", { event, data } )
    this.socket.send( JSON.stringify( { event, data, matchId: this.matchId, playerToken: this.playerToken } ) )
  }
  
}

const useServer = create( set => ({
    ready: false
  })
)

const [useProfile, profileAPI] = create( set => ({
  username: false,
  logout: () => {
    localStorage.clear()
    set( { username: false } )
  },
  assignUsername: ( username ) => {
    localStorage.setItem( "sd2:username", username )
    set( { username } )
  }
}) )

profileAPI.setState( { username: localStorage.getItem( "sd2:username" ) } )

const [useMatch, matchAPI] = create( set => ({
  coinWinner: undefined,
  map: false,
  setMap: ( map ) => {
    set( { map } )
  },
  setBans: ( team, bannedMaps ) => {
    console.log( { team, bannedMaps } )
    if ( team === "A" ) {
      set( state => ({ teamA: { ...state.teamA, bannedMaps } }) )
    }
    if ( team === "B" ) {
      set( state => ({ teamB: { ...state.teamB, bannedMaps } }) )
    }
  },
  setDivisionBans: ( team, bannedDivisions ) => {
    if ( team === "A" ) {
      set( state => ({ teamA: { ...state.teamA, bannedDivisions } }) )
    }
    if ( team === "B" ) {
      set( state => ({ teamB: { ...state.teamB, bannedDivisions } }) )
    }
  },
  setFaction( team, faction ) {
    if ( team === "A" ) {
      set( state => ({ teamA: { ...state.teamA, faction } }) )
    }
    if ( team === "B" ) {
      set( state => ({ teamB: { ...state.teamB, faction } }) )
    }
  },
  setDivision( team, division ) {
    if ( team === "A" ) {
      set( state => ({ teamA: { ...state.teamA, division } }) )
    }
    if ( team === "B" ) {
      set( state => ({ teamB: { ...state.teamB, division } }) )
    }
  },
  setIncome( team, income ) {
    if ( team === "A" ) {
      set( state => ({ teamA: { ...state.teamA, income } }) )
    }
    if ( team === "B" ) {
      set( state => ({ teamB: { ...state.teamB, income } }) )
    }
  },
  teamA: {
    income: false,
    faction: false,
    division: false,
    bannedDivisions: [],
    bannedMaps: {},
    players: []
  },
  teamB: {
    income: false,
    faction: false,
    division: false,
    bannedDivisions: [],
    bannedMaps: {},
    players: []
  },
}) )

window.matchAPI = matchAPI
const socket = new Socket()
window.socket = socket
export default socket
export { useServer, useProfile, useMatch }
