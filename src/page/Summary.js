import { useMatch, useServer } from "../service/socket";
import React from "react";
import { divisionsById } from "../data/divisions";

function getPhaseData( player, name ) {
  return player.dataByPhase[ name ]
}

function PlayerCard( { player } ) {
  let BAN0 = getPhaseData( player, "BAN_DIV0" )
  let BAN1 = getPhaseData( player, "BAN_DIV1" )
  let COINSIDE = getPhaseData( player, "COINSIDE" )
  return <div>
    <div className="b f3">{player.name}</div>
    <div className="f7">
      <div className="f6">Player {player.playerSlot || "..."}</div>
      <div className="pv2">
        {BAN0 && BAN0.map( divId => {
          return <div key={divId}><span className="strike">{divisionsById[ divId ]?.name}</span></div>
        } )}
      </div>
      <div className="pb2">
        {BAN1 && BAN1.map( divId => {
          return <div key={divId}><span className="strike">{divisionsById[ divId ]?.name}</span></div>
        } )}
      </div>
      {player.faction && <div className="ttu">{player.faction}</div>}
      {player.division && <div className="ttu">{player.division.name}</div>}
      {player.income && <div className="ttu f7">{player.income}</div>}
      {/*<pre className={"f7"}>{JSON.stringify( player, null, 2 )}</pre>*/}
    </div>
  </div>
}

export function Summary() {
  const server = useServer( state => state )
  // console.log( { server } )
  if ( !server.match ) return <div>LOADING</div>
  return <div className={"mw9 tl center"}>
    
    {server.activePlayer && <div className="f7 white-70">
      <span>Welcome</span>
      <span className="b white"> {server.activePlayer.name}</span>
      <div className="w-25">
        <hr/>
      </div>
    </div>}
    
    <div className="flex flex-row justify-between">
      <div className="f7 white-70">Summary</div>
    </div>
    <div className="flex flex-row justify-between">
      <div>
        <PlayerCard player={server.match.player1}/>
      </div>
      <div className="tc">
        <div className="f6 white-70">MAP</div>
        <div className="f3 b">{server.match.MAP_SELECTION || "..."}</div>
      
      </div>
      <div>
        <PlayerCard player={server.match.player2}/>
      </div>
    </div>
    <hr/>
    {/*<pre className={"f7"}>{JSON.stringify( server, null, 2 )}</pre>*/}
  </div>
}