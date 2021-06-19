import { useMatch } from "../service/socket";
import React from "react";
import { MatchFooter } from "./MatchFooter";
import { Link } from "react-router-dom";
import { Button } from "@geist-ui/react";
import { maps } from "sd2-data";

const sd2LeagueMaps = maps.mapData.sd2League

export function PickMap() {
  const match = useMatch( state => state )
  const bannedMaps = [...Object.keys( match.teamA.bannedMaps ), ...Object.keys( match.teamB.bannedMaps )]
  const [showMap, map] = React.useState( false )
  const availableMaps = sd2LeagueMaps.filter( mapName => {
    return !bannedMaps.includes( mapName )
  } )
  const mapName = availableMaps[ Math.floor( Math.random() * availableMaps.length ) ]
  
  return <div className={""}>
    <div className="tc pt3 pt4-l">
      <div className="white-60 mw6 ph3 center">
        <p>Your map is...</p>
      </div>
      <div className={"b f3"}>{mapName}</div>
    </div>
    
    <MatchFooter>
      <div className="tc">
        <div className=""><Link to={"/divisions"}><Button
          onClick={() => {
            match.setMap( mapName )
          }}
        >Continue</Button></Link></div>
      </div>
    </MatchFooter>
  </div>
}