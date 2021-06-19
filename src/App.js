import React from "react"
import './App.css';
import './tachyons.min.css';
import create from "zustand";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { CssBaseline, GeistProvider } from "@geist-ui/react";
import { divisionsAllies, divisionsAxis } from "./data/divisions";
import { maps } from "sd2-data"
import { useServer } from "./service/socket"
import LadderPage from "./page/LadderPage/LadderPage";
import { PickPlayer } from "./page/PickPlayer";
import { BanMaps } from "./page/BanMaps";
import { BanDivisions } from "./page/BanDivisions";
import { InitMatch } from "./page/InitMatch";
import { IndexPage } from "./page/IndexPage";
import { Summary } from "./page/Summary";
import { PickIncome } from "./page/PickIncome";
import { PickDivision } from "./page/PickDivision";
import { PickFaction } from "./page/PickFaction";
import { PickMap } from "./page/PickMap";

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

function Routes() {
  const ready = useServer( state => state.ready )
  // if (!ready) return <div>CONNECTION NOT READY</div>
  return (
    <div className="App relative pb5">
      <Router>
        <Switch>
          <Route path={"/ladder"} component={LadderPage}/>
          <Route exact path={"/tournament/:tournamentId/:matchId/:playerToken?"} component={InitMatch}/>
          {/*<Route exact path={"/slot"} component={PickPlayer}/>*/}
          {/*<Route exact path={"/maps/:phaseIndex?"} component={BanMaps}/>*/}
          {/*<Route exact path={"/pick-a-map"} component={PickMap}/>*/}
          {/*<Route exact path={"/divisions/:phaseIndex?"} component={BanDivisions}/>*/}
          {/*<Route exact path={"/pick-faction/:phaseIndex?"} component={PickFaction}/>*/}
          {/*<Route exact path={"/pick-division"} component={PickDivision}/>*/}
          {/*<Route exact path={"/pick-income"} component={PickIncome}/>*/}
          {/*<Route exact path={"/summary"} component={Summary}/>*/}
          {/*<Route path={"/"} component={IndexPage}/>*/}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
