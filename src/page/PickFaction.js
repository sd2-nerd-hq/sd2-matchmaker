import React from "react";
import { useMatch } from "../service/socket";
import { Button } from "@geist-ui/react";
import { MatchFooter } from "./MatchFooter";
import { Link } from "react-router-dom";

export function PickFaction() {
  const [faction, setFaction] = React.useState( false )
  const match = useMatch( state => state )
  const persist = ( fac ) => {
    match.setFaction( "A", faction )
  }
  
  return <div className={" ph3"}>
    <div className="tc pt3 pt4-l">
      <div className="f6">PICK</div>
      <div className={"b f3"}>FACTION</div>
      <div className="white-60 mw6 ph3 center">
        <p>Pick your faction</p>
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
    
    <MatchFooter>
      <div className="tc">
        {!faction && <div className=""><Button>Select a faction to continue</Button></div>}
        {faction && <div className=""><Link to={"/pick-division"}><Button onClick={persist}>Continue as {faction}</Button></Link></div>}
      </div>
    </MatchFooter>
  </div>
}