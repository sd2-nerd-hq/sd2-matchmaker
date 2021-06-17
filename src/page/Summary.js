import { useMatch } from "../service/socket";
import { MatchFooter } from "./MatchFooter";
import { Link } from "react-router-dom";
import { Button } from "@geist-ui/react";
import React from "react";

export function Summary() {
  const match = useMatch( state => state )
  return <div className={"mw5 center tl pt3"}>
    <div className="tc pt3 pb3 pt4-l">
      <div className="f6">MATCH</div>
      <div className={"b f3 pt3"}>PLAYER A</div>
      <div className={"f6"}>VS</div>
      <div className={"b f3"}>PLAYER B</div>
    </div>
    <hr/>
    
    <div className="mw5 center tl pt3">
      <div className={"f7 white-60 ttu"}>MAP</div>
      <div>{match.map}</div>
      
      <div className="pt3">
        <div className={"f7 white-60 ttu"}>PLAYER A</div>
        <div>{match.teamA.division.name} ({match.teamA.income})</div>
      </div>
      
      <div className="pt3">
        <div className={"f7 white-60 ttu"}>PLAYER B</div>
        <div>{match.teamB.division && match.teamB.division.name} ({match.teamB.income})</div>
      </div>
      <div className="f7">
        <div className="pt3">
          TEAM A: {Object.keys( match.teamA.bannedMaps ).map( e => e ).join( ", " )}
        </div>
        <div className="pt3">
          TEAM B: {Object.keys( match.teamB.bannedMaps ).map( e => e ).join( ", " )}
        </div>
      
      </div>
    </div>
    
    <MatchFooter>
      <div className="tc"><Link to={"/"}><Button>Create New Match</Button></Link></div>
    </MatchFooter>
  
  </div>
}