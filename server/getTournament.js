const { Tournament, tournamentById } = require( "./Tournament" );
require( 'dotenv' ).config()

const getTournament = async ( tournamentId ) => {
  let t = tournamentById[ tournamentId ]
  if ( !t ) {
    t = new Tournament( tournamentId )
    await t.fetchTournament()
    // await t.fetchMatches()
    // await t.fetchParticipants()
  }
  tournamentById[ tournamentId ] = t
  return t
}


module.exports = getTournament