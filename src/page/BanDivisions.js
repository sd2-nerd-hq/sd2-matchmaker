import { useMatch, useServer } from "../service/socket";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import React from "react";
import { Button } from "@geist-ui/react";
import { MatchFooter } from "./MatchFooter";
import { divisionsAllies, divisionsAxis } from "../data/divisions";
import { getPlayerBySlot } from "./GetPlayerBySlot";
import { getPhaseData } from "./GetPhaseData";

const alliesDivs = divisionsAllies
const axisDivs = divisionsAxis

const banDivisionPhases = [
  {
    activeTeam: "A",
    banCount: 3,
  },
  {
    activeTeam: "B",
    banCount: 3,
  }
]

export function BanDivisions( { onSubmit, phase } ) {
  const match = useMatch( state => state )
  const server = useServer( state => state )
  const history = useHistory()
  const params = useParams()
  const phaseIndex = params.phaseIndex || 0
  const activePhase = banDivisionPhases[ phaseIndex || 0 ]
  const { activeTeam } = activePhase
  const nextPhase = banDivisionPhases[ phaseIndex + 1 ] || false
  const nextLink = nextPhase ? `/divisions/${phaseIndex + 1}` : "/pick-faction"
  const MAX_BANS = activePhase.banCount
  const [bannedDivisions, setBans] = React.useState( {} )
  const previouslyBannedKeys = server.match.DIV_BANS
  let slot1 = getPlayerBySlot(server.match, 1)
  let slot2 = getPlayerBySlot(server.match, 2)
  
  let P1_BAN0 = getPhaseData( slot1, "BAN_DIV0" )
  let P1_BAN1 = getPhaseData( slot1, "BAN_DIV1" )
  
  let P2_BAN0 = getPhaseData( slot2, "BAN_DIV0" )
  let P2_BAN1 = getPhaseData( slot2, "BAN_DIV1" )
  
  const isPlayerSlot1 = server.activePlayer.playerSlot === 1
  const isPlayerSlot2 = server.activePlayer.playerSlot === 2
  // console.log( { phase, P1_BAN0, P1_BAN1, P2_BAN0, P2_BAN1 } )
  let activePhaseForMe = false
  let activePlayer = slot2
  
 
  
  if ( phase === "BAN_DIV0" ) {
    activePhaseForMe = (isPlayerSlot2 && !P2_BAN0) || (isPlayerSlot1 && P2_BAN0)
    activePlayer = (!P2_BAN0) ? slot2 : slot1
  }
  if ( phase === "BAN_DIV1" ) {
    activePhaseForMe = (isPlayerSlot2 && !P2_BAN1) || (isPlayerSlot1 && P2_BAN1)
    activePlayer = (!P2_BAN1) ? slot2 : slot1
  }
  
  // activePhaseForMe = (isPlayerSlot1 && !P2_BAN0) || (server.isPlayer2 && player1Ban)
  
  React.useEffect( () => {
    match.setBans( activeTeam, {} )
  }, [activeTeam] )
  
  const toggleBan = ( divId ) => {
    let newBans
    if ( bannedDivisions[ divId ] ) {
      newBans = {
        ...bannedDivisions,
        [ divId ]: false
      }
    } else {
      if ( MAX_BANS <= banCount ) {
        return
      }
      
      newBans = {
        ...bannedDivisions,
        [ divId ]: true
      }
    }
    setBans( newBans )
  }
  
  const banCount = Object.values( bannedDivisions ).filter( e => e ).length
  const canContinue = MAX_BANS === banCount
  // console.log( { previouslyBannedKeys } )
  return <div className={""}>
    <div className="tc pt3 pt4-l">
      <div className="f6">BAN</div>
      <div className={"b f3"}>DIVISIONS</div>
      <div className="white-60 mw6 ph3 center">
        <p> Player {activePlayer.name} bans divisions</p>
      </div>
    </div>
    
    <div className=" ph3 mw7 center pb4">
      <div className={"flex flex-row justify-between"}>
        <div className={"pb3"}>
          <div className="ttu white-60 pb1">AXIS</div>
          <div className="flex flex-column flex-wrap na1">
            {[...Object.values( axisDivs )]
              .sort( ( a, b ) => {
                return a > b ? -1 : 1
              } )
              .map( division => {
                const divId = division.id
                const isBanned = previouslyBannedKeys && previouslyBannedKeys.includes( `${divId}` )
                return <div key={divId} className={"w-100"}>
                  <div className="ma1">
                    <Button
                      title={division.name}
                      disabled={isBanned}
                      className="w-100"
                      size={"small"} ghost type={bannedDivisions[ divId ] === true ? "warning" : "default"}
                      onClick={() => {
                        if ( !activePhaseForMe ) return null
                        toggleBan( divId )
                      }}><span className={`${isBanned ? "strike" : ""}`}>{division.name}</span></Button>
                  </div>
                </div>
              } )}
          </div>
        </div>
        <div>
          <div className="ttu white-60 pb1">ALLIES</div>
          <div className="flex flex-column flex-wrap na1">
            {[...Object.values( alliesDivs )]
              .sort( ( a, b ) => {
                return a > b ? -1 : 1
              } )
              .map( division => {
                const divId = division.id
                const isBanned = previouslyBannedKeys && previouslyBannedKeys.includes( `${divId}` )
                return <div key={divId} className={"w-100"}>
                  <div className="ma1">
                    <Button
                      title={division.name}
                      disabled={isBanned}
                      className="w-100"
                      size={"small"} ghost type={bannedDivisions[ divId ] === true ? "warning" : "default"}
                      onClick={() => {
                        toggleBan( divId )
                      }}><span className={`${isBanned ? "strike" : ""}`}>{division.name}</span></Button>
                  </div>
                </div>
              } )}
          </div>
        </div>
      </div>
    </div>
    
    {activePhaseForMe && <MatchFooter>
      <div className="tc">
        {!canContinue && <div className={""}><Button> BAN {MAX_BANS - banCount} MORE DIVS TO CONTINUE</Button></div>}
        {canContinue && <div className={""}>
          <Button
            onClick={() => {
              onSubmit( Object.keys( bannedDivisions ) )
            }}
            className={"w-100"}>Continue</Button>
        </div>}
      
      </div>
    </MatchFooter>}
  
  </div>
}