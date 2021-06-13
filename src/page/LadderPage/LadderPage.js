import React from "react";


function PageLayout( { children } ) {
  return <div className="PageLayout mw6 center w-100">
    {children}
  </div>
}


export default function LadderPage() {
  
  const [players, setPlayers] = React.useState( [] )
  React.useEffect( () => {
    async function fetchLadder() {
      // const playersData = fetch( "https://sodbot-prod.azurewebsites.net/leaderboard" ) // NO CORS
      const playersData = await fetch( "https://www.blandland.de/sd2-nerd-hq/ladder-proxy.php" )
        .then( res => res.json() )
      console.log( { playersData } )
      setPlayers( playersData )
    }
    
    fetchLadder()
  }, [] )
  
  return <PageLayout>
   <div className="tc pb3">
     <div className="pt3 b f2">Steel Division 2</div>
     <div className="pt0 f5">Ladder</div>
   </div>
    
    {players.map( player => {
      return <div className=" pv3 pr3 mb2 ba b--white-10">
        <div className="flex flex-row items-center">
          <div className="b f3 pl3 pr3 white-40 mw3 w-100 tc ">{player.rank}</div>
          <div className="b f4">{player.name}</div>
          <div className="b f4 ml-auto white-40">{Math.round(player.elo)}</div>
        </div>
      </div>
    } )}
  </PageLayout>
}