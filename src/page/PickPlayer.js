import { useProfile } from "../service/socket";
import React from "react";
import { animated, config, useSpring } from "react-spring";
import { Button } from "@geist-ui/react";
import { MatchFooter } from "./MatchFooter";
import { Link } from "react-router-dom";

export function PickPlayer() {
  const profile = useProfile( state => state )
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
      <div className={"b f3"}>{profile.username}</div>
      <div className="white-60 mw6 ph3 center">
        <p>Select your player slot for this match.</p>
      </div>
    </div>
    
    <div className="flex pt3 flex-column items-center w-100">
      <div className="pb2 "><Button ghost type={slot === 1 ? "warning" : "default"} onClick={() => setSlot( 1 )}>Player 1</Button></div>
      <div className="pb2 "><Button ghost type={slot === 2 ? "warning" : "default"} onClick={() => setSlot( 2 )}>Player 2</Button></div>
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