import { useParams } from "react-router";
import React from "react";
import { useMatch } from "../service/socket";
import { useHistory } from "react-router-dom";
import { Button } from "@geist-ui/react";
import { MatchFooter } from "./MatchFooter";
import { maps } from "sd2-data";
const sd2LeagueMaps = maps.mapData.sd2League

const banPhases = [
  {
    activeTeam: "A",
    banCount: 3,
  },
  {
    activeTeam: "B",
    banCount: 3,
  }
]


export function BanMaps() {
  const params = useParams()
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
  
  const previouslyBanned = { ...match.teamA.bannedMaps, ...match.teamB.bannedMaps }
  
  
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
      {sd2LeagueMaps.map( mapName => {
        const isBanned = previouslyBanned[ mapName ]
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
          match.setBans( activePhase.activeTeam, bannedMaps )
          setBans( {} )
          history.push( nextLink )
        }}
        className={"w-100"}>Continue</Button></div>}
    </MatchFooter>
  </div>
}