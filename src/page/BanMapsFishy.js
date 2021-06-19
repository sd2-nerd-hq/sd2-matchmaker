import { useParams } from "react-router";
import React from "react";
import { useMatch, useServer } from "../service/socket";
import { useHistory } from "react-router-dom";
import { Button } from "@geist-ui/react";
import { MatchFooter } from "./MatchFooter";
import { maps } from "sd2-data";
const sd2LeagueMaps = maps.mapData.sd2League

const banPhases = [
  {
    activeTeam: "A",
    banCount: 1,
  },
  {
    activeTeam: "B",
    banCount: 1,
  }
]


export function BanMapsFishy({onSubmit}) {
  const params = useParams()
  const server = useServer()
  const { phaseIndex = 0 } = params
  const activePhase = banPhases[ phaseIndex ]
  const { activeTeam } = activePhase
  const nextPhase = banPhases[ phaseIndex + 1 ]
  const MAX_BANS = activePhase.banCount
  const nextLink = nextPhase ? `/maps/${phaseIndex + 1}` : "/pick-a-map"
  const [bannedMaps, setBans] = React.useState( {} )
  const match = useMatch( state => state )
  
  React.useEffect( () => {
    match.setBans( activeTeam, {} )
  }, [activeTeam] )
  
  const toggleBan = ( map ) => {
    let newBans
    if ( bannedMaps[ map ] ) {
      newBans = {
        ...bannedMaps,
        [ map ]: false
      }
    } else {
      if ( MAX_BANS <= banCount ) {
        return
      }
      
      newBans = {
        ...bannedMaps,
        [ map ]: true
      }
    }
    setBans( newBans )
  }
  
  const previouslyBanned = { ...server.match.MAP_BAN}
  console.log( {previouslyBanned} )
  
  const banCount = Object.values( bannedMaps ).filter( e => e ).length
  const canContinue = MAX_BANS === banCount
  
  const history = useHistory()
  
  return <div className={""}>
    <div className="tc pt3 pt4-l">
      <div className="f6">BAN</div>
      <div className={"b f3"}>MAPS</div>
      <div className="white-60 mw6 ph3 center">
        <p> Player {activePhase.activeTeam} bans <b className={"white"}>{MAX_BANS - banCount} more</b> maps.</p>
      </div>
    </div>
    
    <div className="flex flex-wrap ph3 mw6 center">
      {server.match.maps.map( mapName => {
        const isBanned = server.match.MAP_BAN && server.match.MAP_BAN.includes(mapName)
        return <div key={mapName} className={"ma1"}>
          <Button
            disabled={isBanned}
            size={"small"} ghost type={bannedMaps[ mapName ] === true ? "warning" : "default"}
            onClick={() => {
              !isBanned && toggleBan( mapName )
            }}><span className={`${isBanned && "strike"}`}>{mapName}</span></Button>
        </div>
      } )}
    </div>
    
    <MatchFooter>
      {!canContinue && <div className=""><Button className={"w-100"}> BAN {MAX_BANS - banCount} MORE MAPS TO CONTINUE</Button></div>}
      {canContinue && <div className=""><Button
        onClick={() => {
          onSubmit(Object.keys(bannedMaps))
        }}
        className={"w-100"}>Continue</Button></div>}
    </MatchFooter>
  </div>
}