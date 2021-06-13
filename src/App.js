import React from "react"
import './App.css';
import './tachyons.min.css';
import create from "zustand";
import {BrowserRouter as Router, Link, Route, Switch, useHistory} from "react-router-dom"
import {Button, CssBaseline, GeistProvider, Input} from "@geist-ui/react";
import {animated, config, useSpring} from "react-spring";
import {divisionsAllies, divisionsAxis, divisionsById} from "./data/divisions";
import {maps} from "sd2-data"
import socket, {useMatch, useProfile, useServer} from "./service/socket"
import {useParams} from "react-router";
import LadderPage from "./page/LadderPage/LadderPage";

const sd2LeagueMaps = maps.mapData.sd2League

const alliesDivs = divisionsAllies
const axisDivs = divisionsAxis

const App = () => (
    <GeistProvider themeType={"dark"}>
        <CssBaseline/>
        <Routes/>
    </GeistProvider>
)

const useStore = create(set => ({
        p0: false,
        p1: false,
        flipResult: false,
        selectedMap: false,
    })
)

const usePlayer = create(set => ({
    isPlayerOne: false,
    bannedDivisions: [],
    bannedMaps: [],
}))


function MatchFooter({children}) {
    return <div className="fixed bt b--white-20 bottom-0 left-0 right-0 mh-3 pa3 bg-black z-3">
        {children}
    </div>
}

function PickPlayer() {
    const profile = useProfile(state => state)
    const [slot, setSlot] = React.useState(false)
    const fadeStyles = useSpring({
        config: {...config.stiff},
        from: {opacity: 0},
        to: {
            opacity: slot ? 1 : 0
        }
    })

    const slideInStyles = useSpring({
        config: {...config.stiff},
        from: {opacity: 0},
        to: {
            opacity: slot ? 1 : 0,
        }
    });

    return <div>
        <div className="tc pt3 pt4-l">
            <div className="f6">Welcome</div>
            <div className={"b f3"}>{profile.username}</div>
            <div className="white-60 mw6 ph3 center">
                <p>Select your player slot for this match.</p>
            </div>
        </div>

        <div className="flex pt3 flex-column items-center w-100">
            <div className="pb2 "><Button ghost type={slot === 1 ? "warning" : "default"} onClick={() => setSlot(1)}>Player 1</Button></div>
            <div className="pb2 "><Button ghost type={slot === 2 ? "warning" : "default"} onClick={() => setSlot(2)}>Player 2</Button></div>
        </div>

        <div className="pt3 mw6 ph3 center tc white-60">
            {slot === 1 &&
            <p>Player 1 picks <b className={"b white"}>faction last</b>, <b className={"b white"}>division first</b> and <b className={"b white"}>income last</b>.</p>}
            {slot === 2 &&
            <p>Player 2 picks <b className={"b white"}>faction first</b>, <b className={"b white"}>division last</b> and <b className={"b white"}>income first</b>.</p>}
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

function BanMaps() {
    const params = useParams()
    const {phaseIndex = 0} = params
    const activePhase = banPhases[phaseIndex]
    const {activeTeam} = activePhase
    const nextPhase = banPhases[phaseIndex + 1]
    const MAX_BANS = activePhase.banCount
    const nextLink = nextPhase ? `/maps/${phaseIndex + 1}` : "/pick-a-map"
    const [bannedMaps, setBans] = React.useState({})
    const match = useMatch(state => state)

    React.useEffect( () => {
        match.setBans(activeTeam, {})
    }, [activeTeam])

    const toggleBan = (map) => {
        let newBans
        if (bannedMaps[map]) {
            newBans = {
                ...bannedMaps,
                [map]: false
            }
        } else {
            if (MAX_BANS <= banCount) {
                return
            }

            newBans = {
                ...bannedMaps,
                [map]: true
            }
        }
        setBans(newBans)
    }

    const previouslyBanned = {...match.teamA.bannedMaps, ...match.teamB.bannedMaps}


    const banCount = Object.values(bannedMaps).filter(e => e).length
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
            {sd2LeagueMaps.map(mapName => {
                const isBanned = previouslyBanned[mapName]
                return <div key={mapName} className={"ma1"}>
                    <Button
                        disabled={isBanned}
                        size={"small"} ghost type={bannedMaps[mapName] === true ? "warning" : "default"}
                        onClick={() => {
                            !isBanned && toggleBan(mapName)
                        }}><span className={`${isBanned && "strike"}`}>{mapName}</span></Button>
                </div>
            })}
        </div>

        <MatchFooter>
            {!canContinue && <div className=""><Button className={"w-100"}> BAN {MAX_BANS - banCount} MORE MAPS TO CONTINUE</Button></div>}
            {canContinue && <div className=""><Button
                onClick={() => {
                    match.setBans(activePhase.activeTeam, bannedMaps)
                    setBans({})
                    history.push(nextLink)
                }}
                className={"w-100"}>Continue</Button></div>}
        </MatchFooter>
    </div>
}


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

function BanDivisions() {
    const match = useMatch(state => state)
    const history = useHistory()
    const params = useParams()
    const phaseIndex = params.phaseIndex || 0
    const activePhase = banDivisionPhases[phaseIndex || 0]
    const {activeTeam} = activePhase
    const nextPhase = banDivisionPhases[phaseIndex + 1] || false
    const nextLink = nextPhase ? `/divisions/${phaseIndex + 1}` : "/pick-faction"
    const MAX_BANS = activePhase.banCount
    const [bannedDivisions, setBans] = React.useState({})
    const previouslyBanned = {...(match.teamA.bannedDivisions), ...(match.teamB.bannedDivisions)}

    React.useEffect( () => {
        match.setBans(activeTeam, {})
    }, [activeTeam])

    const toggleBan = (divId) => {
        let newBans
        if (bannedDivisions[divId]) {
            newBans = {
                ...bannedDivisions,
                [divId]: false
            }
        } else {
            if (MAX_BANS <= banCount) {
                return
            }

            newBans = {
                ...bannedDivisions,
                [divId]: true
            }
        }
        setBans(newBans)
    }

    const banCount = Object.values(bannedDivisions).filter(e => e).length
    const canContinue = MAX_BANS === banCount

    return <div className={""}>
        <div className="tc pt3 pt4-l">
            <div className="f6">BAN</div>
            <div className={"b f3"}>DIVISIONS</div>
            <div className="white-60 mw6 ph3 center">
                <p> Player {activePhase.activeTeam} bans {MAX_BANS - banCount} more divisions</p>
            </div>
        </div>

        <div className=" ph3 mw7 center pb4">
            <div>
                <div className={"pb3"}>
                    <div className="ttu white-60 pb1">AXIS</div>
                    <div className="flex flex-row flex-wrap na1">
                        {[...Object.values(axisDivs)]
                            .sort((a, b) => {
                                return a > b ? -1 : 1
                            })
                            .map(division => {
                                const divId = division.id
                                const isBanned = previouslyBanned[divId]
                                return <div key={divId} className={"w-50"}>
                                    <div className="ma1">
                                        <Button
                                            disabled={isBanned}
                                            iconRight={<div>{division.alias}</div>}
                                            className="w-100"
                                            size={"small"} ghost type={bannedDivisions[divId] === true ? "warning" : "default"}
                                            onClick={() => {
                                                toggleBan(divId)
                                            }}><span className={`${isBanned ? "strike" : ""}`}>{division.name}</span></Button>
                                    </div>
                                </div>
                            })}
                    </div>
                </div>
                <div>
                    <div className="ttu white-60 pb1">ALLIES</div>
                    <div className="flex flex-row flex-wrap na1">
                        {[...Object.values(alliesDivs)]
                            .sort((a, b) => {
                                return a > b ? -1 : 1
                            })
                            .map(division => {
                                const divId = division.id
                                return <div key={divId} className={"w-50"}>
                                    <div className="ma1">
                                        <Button
                                            className="w-100"
                                            size={"small"} ghost type={bannedDivisions[divId] === true ? "warning" : "default"}
                                            onClick={() => {
                                                toggleBan(divId)
                                            }}>{division.name}</Button>
                                    </div>
                                </div>
                            })}
                    </div>
                </div>
            </div>
        </div>

        <MatchFooter>
            <div className="tc">
                {!canContinue && <div className={""}><Button> BAN {MAX_BANS - banCount} MORE DIVS TO CONTINUE</Button></div>}
                {canContinue && <div className={""}>
                    <Button
                        onClick={() => {
                            match.setDivisionBans(activePhase.activeTeam, bannedDivisions)
                            history.push(nextLink)
                            setBans({})
                        }}
                        className={"w-100"}>Continue</Button>
                </div>}

            </div>
        </MatchFooter>

    </div>
}

function PickMap() {
    const match = useMatch(state => state)
    const bannedMaps = [...Object.keys(match.teamA.bannedMaps), ...Object.keys(match.teamB.bannedMaps)]
    const [showMap, map] = React.useState(false)
    const availableMaps = sd2LeagueMaps.filter( mapName => {
        return !bannedMaps.includes(mapName)
    })
    const mapName = availableMaps[Math.floor(Math.random() * availableMaps.length)]

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
                    match.setMap(mapName)
                }}
                >Continue</Button></Link></div>
            </div>
        </MatchFooter>
    </div>
}

function PickFaction() {
    const [faction, setFaction] = React.useState(false)
    const match = useMatch(state => state)
    const persist = (fac) => {
        match.setFaction("A", faction)
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
                    setFaction("axis")
                }}>Axis</Button></div>
                <div className="pb3 flex flex-column items-stretch"><Button ghost type={faction === "allies" ? "warning" : "default"} onClick={() => {
                    setFaction("allies")
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

    const match = useMatch(state => state)
    const history = useHistory()
    const selectedFaction = useMatch(state => state.teamA.faction)

    const [selectedDivisionId, setDivision] = React.useState(false)
    const selectedDivision = divisionsById[selectedDivisionId]
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
            {[...Object.values(divisions)].sort().map(division => {
                return <div key={division.id} className={"pb1 mw6 center"}>
                    <Button
                        ghost
                        iconRight={<div>{division.alias}</div>}
                        className={"w-100"}
                        type={selectedDivisionId === division.id ? "warning" : "default"}
                        onClick={() => {
                            console.log("SELECT DIV", {division})
                            setDivision(division.id)
                        }}>
                        <div>{division.name}</div>
                    </Button>
                </div>
            })}
        </div>

        <MatchFooter>
            <div className="tc">
                {!selectedDivision && <div className=""><Button>Select a division</Button></div>}
                {selectedDivision && <div className=""><Button
                    onClick={() => {
                        match.setDivision("A", selectedDivision)
                        history.push("/pick-income")
                    }}
                >Continue with {selectedDivision.name}</Button></div>}
            </div>
        </MatchFooter>
    </div>
}


function PickIncome() {
    const history = useHistory()
    const match = useMatch(state => state)
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
    const [selectedIncome, setIncome] = React.useState(false)

    return <div className={""}>
        <div className="tc pt3 pt4-l">
            <div className="f6">PICK</div>
            <div className={"b f3"}>INCOME</div>
            <div className="white-60 mw6 ph3 center">
                <p>Pick your income</p>
            </div>
        </div>

        <div className="mw5 center">
            {incomes.sort().map(income => {
                return <div key={income} className={"pb2"}>
                    <Button
                        ghost
                        type={selectedIncome === income ? "warning" : "default"}
                        className={"w-100"} onClick={() => {
                        setIncome(income)
                    }}>
                        <div className="flex flex-row justify-between items-start">
                            <div className={"b"}>{income} </div>
                            <div className={"f7 white-40 dib pl3"}> {incomeData[income].text}</div>
                        </div>
                    </Button>
                </div>
            })}
        </div>

        <MatchFooter>
            <div className="tc">
                {!selectedIncome && <div className=""><Link to={"/summary"}><Button className={""}>Select income</Button></Link></div>}
                {selectedIncome && <div className="">
                    <Button
                        onClick={() => {
                            // TODO: generalize
                            match.setIncome("A", selectedIncome)
                            history.push("/summary")
                        }}
                        className={""}>Continue with {selectedIncome}</Button></div>}
            </div>
        </MatchFooter>
    </div>
}

function Summary() {
    const match = useMatch(state => state)
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
                <div>{match.teamA.division.name}  ({match.teamA.income})</div>
            </div>

            <div className="pt3">
                <div className={"f7 white-60 ttu"}>PLAYER B</div>
                <div>{match.teamB.division && match.teamB.division.name} ({match.teamB.income})</div>
            </div>
            <div className="f7">
                <div className="pt3">
                    TEAM A: {Object.keys(match.teamA.bannedMaps).map(e => e).join(", ")}
                </div>
                <div className="pt3">
                    TEAM B: {Object.keys(match.teamB.bannedMaps).map(e => e).join(", ")}
                </div>

            </div>
        </div>

        <MatchFooter>
            <div className="tc"><Link to={"/"}><Button>Create New Match</Button></Link></div>
        </MatchFooter>

    </div>
}

function IndexPage() {
    const profile = useProfile(state => state)
    const history = useHistory()
    const [username, setUsername] = React.useState("")

    return <div className={""}>
        <div className="pa3 tc">
            {profile.username && <div>
                <div className={"f3"}>Welcome back <b>{profile.username}</b></div>
                <div className="f7 "><a onClick={profile.logout} href="#">Not me. Sign out!</a></div>
                <div className={"pt3"}>
                    <Link to={"/slot"}><Button>new Match</Button></Link>
                </div>
            </div>}
            {!profile.username && <div>
                <div className="pb3">
                    <h1>SD2 Matchmaker</h1>
                    <div>Ban Divisions & Pick Maps. Enjoy.</div>
                </div>
                <form onSubmit={() => {
                    profile.assignUsername(username)
                }
                }>
                    <Input
                        value={username}
                        onChange={e => {
                            setUsername(e.currentTarget.value)
                        }}
                        label={"Username"}/>
                    <div className="pt2">
                        <Button
                            type={"submit"}
                            onClick={() => {
                                profile.assignUsername(username)
                            }}
                        >That's me!</Button>
                    </div>

                </form>

            </div>}
        </div>
    </div>
}


function InitMatch() {
    const params = useParams()
    const {matchId, token} = params

    React.useEffect(() => {
        socket.setToken(token)
        socket.setMatchId(matchId)
        socket.send("JOIN", {matchId, token})
    }, [matchId, token])

    const match = useServer(state => state.match)
    console.log({match})
    return <div className={""}>
        <div className="pa3 tc">
            {match && <div>
                <div className="b f3"> {match.participants[0].username} </div>
                <div className="f6 pv2">VS</div>
                <div className="b f3">{match.participants[1].username}</div>

                <div className="pt3">
                    <div className={"pb1"}><Button onClick={() => {
                        socket.send("INPUT", {rps: "ROCK"})
                    }}>ROCK</Button></div>
                    <div className={"pb1"}><Button onClick={() => {
                        socket.send("INPUT", {rps: "PAPER"})
                    }}>PAPER</Button></div>
                    <div className={"pb1"}><Button onClick={() => {
                        socket.send("INPUT", {rps: "SCISSORS"})
                    }}>SCISSORS</Button></div>
                </div>
            </div>}

            {!match && <div className={"mw6 center"}>
                <p>No match found. Start a new match in discord with</p>
                <pre>!match @Opponent</pre>
            </div>}

        </div>
    </div>

}


function Routes() {
    const ready = useServer(state => state.ready)
    // if (!ready) return <div>CONNECTION NOT READY</div>
    return (
        <div className="App relative pb5">
            <Router>
                <Switch>
                    <Route path={"/ladder"} component={LadderPage}/>
                    <Route exact path={"/match/:matchId/:token?"} component={InitMatch}/>
                    <Route exact path={"/slot"} component={PickPlayer}/>
                    <Route exact path={"/maps/:phaseIndex?"} component={BanMaps}/>
                    <Route exact path={"/pick-a-map"} component={PickMap}/>
                    <Route exact path={"/divisions/:phaseIndex?"} component={BanDivisions}/>
                    <Route exact path={"/pick-faction/:phaseIndex?"} component={PickFaction}/>
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
