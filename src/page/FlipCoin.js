import { useProfile, useServer } from "../service/socket";
import React from "react";
import { animated, config, useSpring } from "react-spring";
import { Button } from "@geist-ui/react";
import { MatchFooter } from "./MatchFooter";
import { Link } from "react-router-dom";
import { PickPlayer } from "./PickPlayer";

export function FlipCoin( { onSubmit, onSubmitPlayerSlot } ) {
  const [slot, setSlot] = React.useState( false )
  const server = useServer( state => state )
  
  const [hasPlayerSelection, setPlayerSelection] = React.useState( false )
  
  const slideInStyles = useSpring( {
    config: { ...config.stiff },
    from: { opacity: 0 },
    to: {
      opacity: slot ? 1 : 0,
    }
  } );
  let coinFlipResult = server.match.coinFlip
  
  if ( hasPlayerSelection ) return <React.Fragment>
    
    <PickPlayer
      player={server.activePlayer}
      onSubmit={( slot ) => {
        onSubmitPlayerSlot( slot )
      }
      }/>
    <div className="pt3">
      <a href={"#"}
         className={"f6 underline underline-hover white-60 hover-white-80"}
         onClick={() => {
        setPlayerSelection( false )
      }}>Let's go back to the coinflip</a>
    </div>
  </React.Fragment>
  
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
      <p>The winner gets to choose between player1 or player2.</p>
      <div><a href={"#"}
              className={"f6 underline underline-hover white-60 hover-white-80"}
              onClick={() => {
        setPlayerSelection( true )
      }
      }>Instead pick P1/P2 manually</a></div>
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