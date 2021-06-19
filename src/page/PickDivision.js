import { useServer } from "../service/socket";
import React from "react";
import { divisionsAllies, divisionsAxis, divisionsById } from "../data/divisions";
import { Button } from "@geist-ui/react";
import { MatchFooter } from "./MatchFooter";

const alliesDivs = divisionsAllies
const axisDivs = divisionsAxis

export function PickDivision({onSubmit}) {
  const server = useServer(state => state )
  const selectedFaction = server.activePlayer.faction
  
  const [selectedDivisionId, setDivision] = React.useState( false )
  const selectedDivision = divisionsById[ selectedDivisionId ]
  const divisions = selectedFaction === "axis" ? axisDivs : alliesDivs
  
  return <div className={""}>
    <div className="tc pt3 pt4-l">
      <div className="f6">PICK</div>
      <div className={"b f3"}>DIVISION</div>
      <div className="white-60 mw6 ph3 center">
        <p>Pick your {selectedFaction} division</p>
      </div>
    </div>
    
    <div className="tc pb3">
      {[...Object.values( divisions )].sort().map( division => {
        return <div key={division.id} className={"pb1 mw6 center"}>
          <Button
            ghost
            iconRight={<div>{division.alias}</div>}
            className={"w-100"}
            type={selectedDivisionId === division.id ? "warning" : "default"}
            onClick={() => {
              console.log( "SELECT DIV", { division } )
              setDivision( division.id )
            }}>
            <div>{division.name}</div>
          </Button>
        </div>
      } )}
    </div>
    
    <MatchFooter>
      <div className="tc">
        {!selectedDivision && <div className=""><Button>Select a division</Button></div>}
        {selectedDivision && <div className=""><Button
          onClick={() => {
            onSubmit(selectedDivision)
          }}
        >Continue with {selectedDivision.name}</Button></div>}
      </div>
    </MatchFooter>
  </div>
}