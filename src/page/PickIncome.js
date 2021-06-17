import { Link, useHistory } from "react-router-dom";
import { useMatch } from "../service/socket";
import React from "react";
import { Button } from "@geist-ui/react";
import { MatchFooter } from "./MatchFooter";

export function PickIncome() {
  const history = useHistory()
  const match = useMatch( state => state )
  const incomes = ["Vanguard", "Maverick", "Balanced", "V for Victory", "Juggernaut"]
  const incomeData = {
    "Vanguard": {
      text: "140/135/100"
    },
    "Maverick": {
      text: "120/170/80"
    },
    "Balanced": {
      text: "110/135/155"
    },
    "V for Victory": {
      text: "135/90/165"
    },
    "Juggernaut": {
      text: "90/110/175"
    },
  }
  const [selectedIncome, setIncome] = React.useState( false )
  
  return <div className={""}>
    <div className="tc pt3 pt4-l">
      <div className="f6">PICK</div>
      <div className={"b f3"}>INCOME</div>
      <div className="white-60 mw6 ph3 center">
        <p>Pick your income</p>
      </div>
    </div>
    
    <div className="mw5 center">
      {incomes.sort().map( income => {
        return <div key={income} className={"pb2"}>
          <Button
            ghost
            type={selectedIncome === income ? "warning" : "default"}
            className={"w-100"} onClick={() => {
            setIncome( income )
          }}>
            <div className="flex flex-row justify-between items-start">
              <div className={"b"}>{income} </div>
              <div className={"f7 white-40 dib pl3"}> {incomeData[ income ].text}</div>
            </div>
          </Button>
        </div>
      } )}
    </div>
    
    <MatchFooter>
      <div className="tc">
        {!selectedIncome && <div className=""><Link to={"/summary"}><Button className={""}>Select income</Button></Link></div>}
        {selectedIncome && <div className="">
          <Button
            onClick={() => {
              // TODO: generalize
              match.setIncome( "A", selectedIncome )
              history.push( "/summary" )
            }}
            className={""}>Continue with {selectedIncome}</Button></div>}
      </div>
    </MatchFooter>
  </div>
}