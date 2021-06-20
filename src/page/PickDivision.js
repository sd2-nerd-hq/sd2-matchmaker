import { useServer } from "../service/socket";
import React from "react";
import { divisionsAllies, divisionsAxis, divisionsById } from "../data/divisions";
import { Button } from "@geist-ui/react";
import { MatchFooter } from "./MatchFooter";
import { getPlayerBySlot } from "./GetPlayerBySlot";

const alliesDivs = divisionsAllies
const axisDivs = divisionsAxis

export function PickDivision( { onSubmit } ) {
  const server = useServer( state => state )
  const selectedFaction = server.activePlayer.faction
  
  const [selectedDivisionId, setDivision] = React.useState( false )
  const selectedDivision = divisionsById[ selectedDivisionId ]
  const divisions = selectedFaction === "axis" ? axisDivs : alliesDivs
  
  const DIV_BANS = server.match.DIV_BANS
  // console.log( {divisions, DIV_BANS} )
  let slot1 = getPlayerBySlot( server.match, 1 )
  let slot2 = getPlayerBySlot( server.match, 2 )
  
  let slot1Division = slot1.division
  let slot2Division = slot2.division
  
  let activePlayer = slot1Division ? slot2 : slot1
  let activePhaseForMe = server.activePlayer.name === activePlayer.name
  
  return <div className={""}>
    <div className="tc pt3 pt4-l">
      <div className="f6">PICK</div>
      <div className={"b f3"}>DIVISION</div>
      <div className="white-60 mw6 ph3 center">
        <p> Player {activePlayer.name} picks a division</p>
      </div>
    </div>
    
    <div className="tc pb3">
      {[...Object.values( divisions )].sort().map( division => {
        const isBanned = DIV_BANS.includes(`${division.id}`)
        return <div key={division.id} className={"pb1 mw6 center"}>
          <Button
            ghost
            disabled={isBanned}
            iconRight={<div>{division.alias}</div>}
            className={"w-100"}
            type={selectedDivisionId === division.id ? "warning" : "default"}
            onClick={() => {
              if(isBanned) return
              // console.log( "SELECT DIV", { division } )
              setDivision( division.id )
            }}>
            <div><span className={`${isBanned ? "strike" : ""}`}>{division.name}</span> </div>
          </Button>
        </div>
      } )}
    </div>
    
    {activePhaseForMe && <MatchFooter>
      <div className="tc">
        {!selectedDivision && <div className=""><Button>Select a division</Button></div>}
        {selectedDivision && <div className=""><Button
          onClick={() => {
            onSubmit( selectedDivision )
          }}
        >Continue with {selectedDivision.name}</Button></div>}
      </div>
    </MatchFooter>}
  </div>
}