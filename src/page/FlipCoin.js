import { useProfile, useServer } from "../service/socket";
import React from "react";
import { animated, config, useSpring } from "react-spring";
import { Button } from "@geist-ui/react";
import { MatchFooter } from "./MatchFooter";
import { Link } from "react-router-dom";

export function FlipCoin( { onSubmit, player } ) {
  const [slot, setSlot] = React.useState( false )
  const server = useServer( state => state )
  
  const slideInStyles = useSpring( {
    config: { ...config.stiff },
    from: { opacity: 0 },
    to: {
      opacity: slot ? 1 : 0,
    }
  } );
  let coinFlipResult = server.match.coinFlip
  
  return <div>
    <div className="tc pt3 pt4-l">
      <div className="white-60 mw6 ph3 center">
        <div>Heads or Tails?</div>
        <div className={"f4 b white"}>{coinFlipResult && coinFlipResult}</div>
      </div>
    </div>
    
    <div className="flex pt3 flex-column items-center w-100">
      <div className="pb2 "><Button ghost type={slot === "Heads" ? "warning" : "default"} onClick={() => setSlot( "Heads" )}>Heads</Button></div>
      <div className="pb2 "><Button ghost type={slot === "Tails" ? "warning" : "default"} onClick={() => setSlot( "Tails" )}>Tails</Button></div>
    </div>
    
    <div className="pt3 mw6 ph3 center tc white-60">
      <p>The winner gets to pick player1 or player2.</p>
    </div>
    
    <MatchFooter>
      <div className={"bt bt b--white-10"}>
        <div>
          {slot && <animated.div style={slideInStyles}>
            <Button
              onClick={() => {
                onSubmit( slot )
              }}
              className={"w-100"} ghost type="warning">Continue with {slot}</Button>
          </animated.div>}
        </div>
      </div>
    </MatchFooter>
  
  </div>
}