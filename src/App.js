import React from "react"
import './App.css';
import './tachyons.min.css';
import create from "zustand";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom"
import { Button, CssBaseline, GeistProvider } from "@geist-ui/react";
import { animated, config, useSpring } from "react-spring";
import maps from "./data/maps"
import { alliesDivs, axisDivs } from "./data/divisions";

const App = () => (
  <GeistProvider themeType={"dark"}>
    <CssBaseline/>
    <Routes/>
  </GeistProvider>
)

const useStore = create( set => ({
    p0: false,
    p1: false,
    flipResult: false,
    selectedMap: false,
  })
)

const usePlayer = create( set => ({
  isPlayerOne: false,
  bannedDivisions: [],
  bannedMaps: [],
}) )

const useMatch = create( set => ({
  players: [],
  p0: false,
  p1: false,
  selectedMap: false,
  selectedFaction: false,
  set
}) )

window.useMatch = useMatch

function MatchFooter( { children } ) {
  return <div className="fixed bt b--white-20 bottom-0 left-0 right-0 mh-3 pa3 bg-black z-3">
    {children}
  </div>
}

function PickPlayer() {
  const [slot, setSlot] = React.useState( false )
  const fadeStyles = useSpring( {
    config: { ...config.stiff },
    from: { opacity: 0 },
    to: {
      opacity: slot ? 1 : 0
    }
  } )
  
  const slideInStyles = useSpring( {
    config: { ...config.stiff },
    from: { opacity: 0 },
    to: {
      opacity: slot ? 1 : 0,
    }
  } );
  
  return <div>
    <div className="tc pt3 pt4-l">
      <div className="f6">Welcome</div>
      <div className={"b f3"}>P.Uri.Tanner</div>
      <div className="white-60 mw6 ph3 center">
        <p>Select your player slot for this match.</p>
      </div>
    </div>
    
    <div className="flex pt3 flex-column items-center w-100">
      <div className="pb2 "><Button ghost type={slot === 1 ? "warning" : "default"} onClick={() => setSlot( 1 )}>Player 1</Button></div>
      <div className="pb2 "><Button ghost type={slot === 2 ? "warning" : "default"} onClick={() => setSlot( 2 )}>Player 2</Button></div>
    </div>
    
    <div className="pt3 mw6 ph3 center tc white-60">
      {slot === 1 && <p>Player 1 picks <b className={"b white"}>faction first</b> and <b className={"b white"}>income last</b>.</p>}
      {slot === 2 && <p>Player 2 picks <b className={"b white"}>faction last</b> and <b className={"b white"}>income first</b>.</p>}
    </div>
    
    <MatchFooter>
      <div className={"bt bt b--white-10"}>
        <div>
          {slot && <animated.div style={slideInStyles}>
            <Link to={"/maps"}><Button className={"w-100"} ghost type="warning">Continue as Player {slot}</Button></Link>
          </animated.div>}
        </div>
      </div>
    </MatchFooter>
  
  </div>
}

function BanMaps() {
  const MAX_BANS = 3
  const [bannedMaps, setBans] = React.useState( {} )
  const addBan = ( map ) => {
    const newBans = {
      map: true,
      ...bannedMaps
    }
    setBans( newBans )
  }
  
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
  
  const banCount = Object.values( bannedMaps ).filter( e => e ).length
  const canContinue = MAX_BANS === banCount
  
  return <div className={""}>
    <div className="tc pt3 pt4-l">
      <div className="f6">BAN</div>
      <div className={"b f3"}>MAPS</div>
      <div className="white-60 mw6 ph3 center">
        <p> Ban {MAX_BANS - banCount} more maps.</p>
      </div>
    </div>
    
    <div className="flex flex-wrap ph3 mw6 center">
      {maps.map( mapName => {
        return <div key={mapName} className={"ma1"}>
          <Button size={"small"} ghost type={bannedMaps[ mapName ] === true ? "warning" : "default"}
                  onClick={() => {
                    toggleBan( mapName )
                  }}>{mapName}</Button>
        </div>
      } )}
    </div>
    
    <MatchFooter>
      {!canContinue && <div className=""><Button className={"w-100"}> BAN {MAX_BANS - banCount} MORE MAPS TO CONTINUE</Button></div>}
      {canContinue && <div className=""><Link to={"/pick-a-map"}><Button className={"w-100"}>Continue</Button></Link></div>}
    </MatchFooter>
  </div>
}

function BanDivisions() {
  const MAX_BANS = 2
  const [bannedMaps, setBans] = React.useState( {} )
  const addBan = ( map ) => {
    const newBans = {
      map: true,
      ...bannedMaps
    }
    setBans( newBans )
  }
  
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
  
  const banCount = Object.values( bannedMaps ).filter( e => e ).length
  const canContinue = MAX_BANS === banCount
  
  return <div className={""}>
    <div className="tc pt3 pt4-l">
      <div className="f6">BAN</div>
      <div className={"b f3"}>DIVISIONS</div>
      <div className="white-60 mw6 ph3 center">
        <p> Ban {MAX_BANS - banCount} more divisions</p>
      </div>
    </div>
    
    <div className=" ph3 mw7 center pb4">
      <div className="f7 pv2 white-40 ttu">AXIS</div>
      <div className="flex flex-row flex-wrap na1">
        {[...Object.values( axisDivs )]
          .sort()
          .map( mapName => {
            return <div key={mapName} className={"w-50"}>
              <div className="ma1">
                <Button
                  className="w-100"
                  size={"small"} ghost type={bannedMaps[ mapName ] === true ? "warning" : "default"}
                  onClick={() => {
                    toggleBan( mapName )
                  }}>{mapName}</Button>
              </div>
            </div>
          } )}
      </div>
    </div>
    
    
    <MatchFooter>
      <div className="tc">
        {!canContinue && <div className={""}><Button> BAN {MAX_BANS - banCount} MORE DIVS TO CONTINUE</Button></div>}
        {canContinue && <div className={""}><Link to={"/pick-faction"}><Button>Continue</Button></Link></div>}
      </div>
    </MatchFooter>
  
  </div>
}


function PickMap() {
  
  const [showMap, map] = React.useState( false )
  const mapName = maps[ Math.floor( Math.random() * maps.length ) ];
  
  return <div className={""}>
    <div className="tc pt3 pt4-l">
      <div className="white-60 mw6 ph3 center">
        <p>Your map is...</p>
      </div>
      <div className={"b f3"}>{mapName}</div>
    </div>
    
    <MatchFooter>
      <div className="tc">
        <div className=""><Link to={"/divisions"}><Button>Continue</Button></Link></div>
      </div>
    </MatchFooter>
  </div>
}

function PickFaction() {
  
  const [faction, setFaction] = React.useState( false )
  const setMatch = useMatch( state => state.set )
  const persist = ( fac ) => {
    setMatch( { selectedFaction: faction } )
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

function PickDivision() {
  
  const selectedFaction = useMatch( state => state.selectedFaction )
  
  const [selectedDivision, setDivision] = React.useState( false )
  
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
        return <div key={division} className={"pb1"}>
          <Button
            ghost
            type={selectedDivision === division ? "warning" : "default"}
            onClick={() => {
              console.log( "SELECT DIV", { division } )
              setDivision( division )
            }}>{division}</Button>
        </div>
      } )}
    </div>
    
    <MatchFooter>
      <div className="tc">
        {!selectedDivision && <div className=""><Link to={"/pick-income"}><Button>Select a division</Button></Link></div>}
        {selectedDivision && <div className=""><Link to={"/pick-income"}><Button>Continue with {selectedDivision}</Button></Link></div>}
      </div>
    </MatchFooter>
  </div>
}


function PickIncome() {
  
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
        {selectedIncome && <div className=""><Link to={"/summary"}><Button className={""}>Continue with {selectedIncome}</Button></Link></div>}
      </div>
    </MatchFooter>
  </div>
}

function Summary() {
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
      <div>TSEL</div>
      
      <div className="pt3">
        <div className={"f7 white-60 ttu"}>PLAYER A</div>
        <div>122 Panzer (Vanguard)</div>
      </div>
      
      <div className="pt3">
        <div className={"f7 white-60 ttu"}>PLAYER B</div>
        <div>44 Guards Tankovy (Vanguard)</div>
      </div>
    </div>
    
    <MatchFooter>
      <div className="tc"><Link to={"/"}><Button>Create New Match</Button></Link></div>
    </MatchFooter>
  
  </div>
}

function IndexPage() {
  return <div className={""}>
    <div className="pa3 tc">
      <Link to={"/slot"}><Button>Select Player Slot</Button></Link>
    </div>
  </div>
}


function Routes() {
  return (
    <div className="App relative pb5">
      <Router>
        <Switch>
          <Route exact path={"/slot"} component={PickPlayer}/>
          <Route exact path={"/maps"} component={BanMaps}/>
          <Route exact path={"/pick-a-map"} component={PickMap}/>
          <Route exact path={"/divisions"} component={BanDivisions}/>
          <Route exact path={"/pick-faction"} component={PickFaction}/>
          <Route exact path={"/pick-division"} component={PickDivision}/>
          <Route exact path={"/pick-income"} component={PickIncome}/>
          <Route exact path={"/summary"} component={Summary}/>
          <Route path={"/"} component={IndexPage}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
