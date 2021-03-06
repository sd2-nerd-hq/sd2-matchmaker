import React from "react";
import { useMatch, useServer } from "../service/socket";
import { Button } from "@geist-ui/react";
import { MatchFooter } from "./MatchFooter";
import { Link } from "react-router-dom";
import { getPlayerBySlot } from "./GetPlayerBySlot";

export function PickFaction( { onSubmit } ) {
  const [faction, setFaction] = React.useState( false )
  const server = useServer( state => state )
  
  let slot1 = getPlayerBySlot( server.match, 1 )
  let slot2 = getPlayerBySlot( server.match, 2 )
  
  let slot1Faction = slot1.faction
  let slot2Faction = slot2.faction
  
  let activePlayer = slot1Faction ? slot2 : slot1
  let activePhaseForMe = server.activePlayer.name === activePlayer.name
  
  
  return <div className={" ph3"}>
    <div className="tc pt3 pt4-l">
      <div className="f6">PICK</div>
      <div className={"b f3"}>FACTION</div>
      <div className="white-60 mw6 ph3 center">
        <p> {activePlayer.name} picks faction</p>
      </div>
    </div>
    
    <div className="tc mw7 center">
      <div className="tc flex flex-column pt3">
        <div className="pb3 flex flex-column items-stretch"><Button ghost type={faction === "axis" ? "warning" : "default"} onClick={() => {
          setFaction( "axis" )
        }}>Axis</Button></div>
        <div className="pb3 flex flex-column items-stretch"><Button ghost type={faction === "allies" ? "warning" : "default"} onClick={() => {
          setFaction( "allies" )
        }}>Allies</Button></div>
      </div>
    </div>
    
    {activePhaseForMe && <MatchFooter>
      <div className="tc">
        {!faction && <div className=""><Button>Select a faction to continue</Button></div>}
        {faction && <div className=""><Button onClick={() => {
          onSubmit( faction )
        }
        }>Continue as {faction}</Button></div>}
      </div>
    </MatchFooter>}
  </div>
}