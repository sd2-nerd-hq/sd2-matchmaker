import { useParams } from "react-router";
import React from "react";
import socket from "../service/socket";
import { Button } from "@geist-ui/react";

export function InitMatch() {
  const params = useParams()
  const { tournamentId, matchId, playerToken } = params
  const [match, setMatch] = React.useState()
  React.useEffect( async () => {
    async function loadMatch() {
      let match = await fetch( `${process.env.REACT_APP_SERVER}/tournament/${tournamentId}/${matchId}?playerToken=${playerToken}` )
        .then( res => res.json() )
      return match
    }
    
    let { match, editable, isPlayer1, isPlayer2 } = await loadMatch()
    match.editable = editable
    match.isPlayer1 = isPlayer1
    match.isPlayer2 = isPlayer2
    setMatch( match )
    console.log( { match } )
    socket.setToken( playerToken )
    socket.setMatchId( matchId )
    socket.send( "JOIN", { matchId, playerToken } )
  }, [matchId, tournamentId] )
  
  // const match = useServer( state => state.match )
  console.log( { match } )
  return <div className={""}>
    <div className="pa3 tc">
      {match && <div>
        <div className="">
          {match.isPlayer1 && <div className={"f6"}>(That's you)</div>}
          <div className="b f3">{match.player1.name}</div>
        </div>
        <div className="f6 pv2">VS</div>
        {match.isPlayer2 && <div className={"f6"}>(That's you)</div>}
        <div className="b f3">{match.player2.name}</div>
        
        <div className="pt3">
          <div className="pb2">Are you p1 or p2?</div>
          <div className={"pb1"}><Button onClick={() => {
            socket.send( "INPUT", { player: 1 } )
          }}>Player 1</Button></div>
          <div className={"pb1"}><Button onClick={() => {
            socket.send( "INPUT", { player: 2 } )
          }}>Player 2</Button></div>
        </div>
      </div>}
      
      {!match && <div className={"mw6 center"}>
        <p>No match found. Start a new match in discord with</p>
        <pre>!match @Opponent</pre>
      </div>}
    
    </div>
  </div>
  
}