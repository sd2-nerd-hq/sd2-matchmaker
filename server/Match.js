const state = {
  RPS: "RPS",
  COINFLIP: "COINFLIP",
  BAN_MAPS: "BAN_MAPS",
  BAN_DIVS: "BAN_DIVS",
  PICK_FACTION: "PICK_FACTION",
  PICK_INCOME: "PICK_INCOME",
}

class Match {
  
  phase = state.RPS
  
  constructor( {
                 token0,
                 token1,
                 matchId,
                 authorId,
                 playerOne = {},
                 playerTwo = {},
                 subscribers = [],
                 participants
               } ) {
    this.token0 = token0
    this.token1 = token1
    this.matchId = matchId
    this.authorId = authorId
    this.playerOne = playerOne
    this.playerTwo = playerTwo
    this.subscribers = subscribers
    this.participants = participants
  }
  
  broadcast( event, data ) {
    this.subscribers.forEach( socket => {
      socket.send( JSON.stringify( { event, data } ) )
    } )
  }
  
  
  update() {
    switch (this.phase) {
      case state.RPS:
        if ( this.playerOne.rps && this.playerTwo.rps ) {
          const s1 = this.playerOne.rps
          const s2 = this.playerTwo.rps
          if ( s1 === "SCISSORS" && s2 === "ROCK" ||  s1 === "ROCK" && s2 === "PAPER" || s1 === "PAPER" && s2 === "SCISSORS" ) {
            this.broadcast( "MSG", `${s1} vs ${s2} : ${this.playerTwo.username} wins.` )
          } else {
            if(s1 === s2){
              this.broadcast( "MSG", `${s1} vs ${s2} : TIE!` )
            } else {
              this.broadcast( "MSG", `${s1} vs ${s2} : ${this.playerOne.username} wins.` )
            }
          }
          
          // RESET
          this.playerOne.rps = false
          this.playerTwo.rps = false
        }
        break;
      case state.COINFLIP:
        break;
      case state.BAN_MAPS:
        break;
      case state.BAN_DIVS:
        break;
    }
  }
  
  setPlayerData( token, data ) {
    if ( token === this.token0 ) {
      this.playerOne = Object.assign( this.playerOne, data )
      this.update()
    }
    
    if ( token === this.token1 ) {
      this.playerTwo = Object.assign( this.playerTwo, data )
      this.update()
    }
  }
  
  getPlayerData( token ) {
    if ( token === this.token0 ) {
      return this.playerOne
    }
    
    if ( token === this.token1 ) {
      return this.playerTwo
    }
    return false
  }
  
  export( token ) {
    
    const out = {
      playerOne: this.playerOne,
      playerTwo: this.playerTwo,
      matchId: this.matchId,
      authorId: this.authorId,
      participants: this.participants
    }
    if ( token ) {
      out.me = this.getPlayerData( token )
    }
    return out
  }
}

module.exports = Match