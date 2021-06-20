import { PickPlayer } from "./PickPlayer";
import { FlipCoin } from "./FlipCoin";
import { PickMap } from "./PickMap";
import { BanDivisions } from "./BanDivisions";
import { PickFaction } from "./PickFaction";
import { PickDivision } from "./PickDivision";
import { PickIncome } from "./PickIncome";
import socket, { useServer } from "../service/socket";
import { BanMaps } from "./BanMaps";
import { BanMapsFishy } from "./BanMapsFishy";


const phase = {
  FLIP: "FLIP",
  PLAYER_SELECTION: "PLAYER_SELECTION",
  MAP_FISH: "MAP_FISH",
  BAN_DIV0: "BAN_DIV0",
  BAN_DIV1: "BAN_DIV1",
  PICK_FACTION: "PICK_FACTION",
  PICK_DIVISION: "PICK_DIVISION",
  PICK_INCOME: "PICK_INCOME",
  SUMMARY: "SUMMARY",
}

function getProtocolPhase( match ) {
  
  if ( match.INCOME_PICKED ) {
    return phase.SUMMARY
  }
  
  if ( match.DIVISIONS_PICKED ) {
    return phase.PICK_INCOME
  }
  
  if ( match.FACTIONS_PICKED ) {
    return phase.PICK_DIVISION
  }
  
  if ( match.DIV_BAN_FINISHED ) {
    return phase.PICK_FACTION
  }
  
  if ( match.MAP_SELECTION ) {
    if ( match.DIV_BANS && match.DIV_BANS.length >= 12 ) {
      return phase.PICK_FACTION
    }
    if ( match.DIV_BANS && match.DIV_BANS.length >= 6 ) {
      return phase.BAN_DIV1
    }
    return phase.BAN_DIV0
  }
  
  if ( match.PLAYER_SELECTION ) {
    return phase.MAP_FISH
  }
  
  if ( match.coinFlip ) {
    return phase.PLAYER_SELECTION
  }
  
  return phase.FLIP
}

function getCoinFlipWinner( match ) {
  let p1 = match.player1
  let p2 = match.player2
  if ( p1.wonCoinFlip ) {
    return p1
  }
  if(p2.wonCoinFlip){
    return p2
  }
  return false
}

export default function Protocol() {
  const server = useServer()
  if ( !server.match ) return <div>LOADING</div>
  let currentPhase = getProtocolPhase( server.match )
  let coinFlipWinner = getCoinFlipWinner( server.match )
  return <div>
    
    {currentPhase === phase.FLIP && <div className="pv4">
      <FlipCoin
        onSubmitPlayerSlot={( playerSlot ) => {
          socket.sendPhaseInput( "PLAYER_SELECTION", playerSlot )
        }}
        onSubmit={( coinSide ) => {
          socket.sendPhaseInput( "COINSIDE", coinSide )
        }}
      />
    </div>}
    
    {currentPhase === phase.PLAYER_SELECTION && <div className="pv4">
      <PickPlayer
        onSubmit={( playerSlot ) => {
          socket.sendPhaseInput( "PLAYER_SELECTION", playerSlot )
        }}
        player={coinFlipWinner}/>
    </div>}
    
    {currentPhase === phase.MAP_FISH && <div className="pv4">
      <BanMapsFishy
        onSubmit={( mapBan ) => {
          socket.sendPhaseInput( "MAP_BAN", mapBan )
        }
        }
      />
    </div>}
    
    
    {currentPhase === phase.BAN_DIV0 && <div className="pv4">
      <BanDivisions
        phase={currentPhase}
        onSubmit={( bannedDivisions ) => {
          socket.sendPhaseInput( phase.BAN_DIV0, bannedDivisions )
        }
        }
      />
    </div>}
    
    {currentPhase === phase.BAN_DIV1 && <div className="pv4">
      <BanDivisions
        phase={currentPhase}
        onSubmit={( bannedDivisions ) => {
          socket.sendPhaseInput( phase.BAN_DIV1, bannedDivisions )
        }
        }
      />
    </div>}
    
    {currentPhase === phase.PICK_FACTION && <div className="pv4">
      <PickFaction onSubmit={faction => {
        socket.sendPhaseInput( phase.PICK_FACTION, faction )
      }
      }/>
    </div>}
    
    
    {currentPhase === phase.PICK_DIVISION && <div className="pv4">
      <PickDivision onSubmit={division => {
        socket.sendPhaseInput( phase.PICK_DIVISION, division )
      }
      }/>
    </div>}
    
    {currentPhase === phase.PICK_INCOME && <div className="pv4">
      <PickIncome onSubmit={income => {
        socket.sendPhaseInput( phase.PICK_INCOME, income )
      }
      }/>
    </div>}
    
    {currentPhase === phase.SUMMARY && <div className="pv4">
      <div className="">Done</div>
      <div className="f1 white-20 b ttu ">Match Ready</div>
    </div>}
    
    {/*<div className="pv4">*/}
    {/*  <PickDivision/>*/}
    {/*</div>*/}
    
    {/*<div className="pv4">*/}
    {/*  <PickIncome/>*/}
    {/*</div>*/}
  
  </div>
}