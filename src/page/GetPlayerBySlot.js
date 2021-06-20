export function getPlayerBySlot( match, slot ) {
  if ( match.player1.playerSlot === slot ) return match.player1
  if ( match.player2.playerSlot === slot ) return match.player2
  return false
}