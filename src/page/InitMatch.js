import { useHistory, useParams } from "react-router";
import React from "react";
import socket, { useServer } from "../service/socket";
import { Summary } from "./Summary";
import Protocol from "./Protocol";

export function InitMatch() {
  const params = useParams()
  const { tournamentId, matchId, playerToken } = params
  const [match, setMatch] = React.useState()
  const history = useHistory()
  React.useEffect( async () => {
    
    async function loadMatch() {
      let match = await fetch( `${process.env.REACT_APP_SERVER}/tournament/${tournamentId}/${matchId}?playerToken=${playerToken}` )
        .then( res => res.json() )
      return match
    }
    
    let { match, editable, activePlayerName, isPlayer1, isPlayer2 } = await loadMatch()
    setMatch( match )
    let activePlayer = false
    if ( editable ) {
      activePlayer = isPlayer1 ? match.player1 : match.player2
    }
    useServer.setState( () => ({ match, activePlayer, activePlayerName, editable, isPlayer1, isPlayer2 }) )
    // console.log( { match } )
    playerToken && socket.setPlayerToken( playerToken )
    socket.setMatchId( matchId )
    socket.send( "JOIN", { matchId, playerToken } )
  }, [matchId, tournamentId, playerToken] )
  
  // const match = useServer( state => state.match )
  const server = useServer( state => state )
  
  const PLAYER_SELECTION_1 = server.match && server.match.player1.dataByPhase[ "PLAYER_SELECTION" ]
  const PLAYER_SELECTION_2 = server.match && server.match.player2.dataByPhase[ "PLAYER_SELECTION" ]
  const SLOTS_SELECTED = PLAYER_SELECTION_1 || PLAYER_SELECTION_2
  
  // console.log( { server, match } )
  if ( !match ) return <div>LOADING</div>
  return <div className={"center"}>
    <div className="pa3 tc">
      <Summary/>
      {server.editable && <Protocol/>}
      {!match && <div className={"mw6 center"}>
        <p>No match found. </p>
      </div>}
    
    </div>
  </div>
  
}