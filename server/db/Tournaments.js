class Tournaments {
  constructor( db ) {
    this.collection = db.collection( 'tournament' );
  }
  
  async addTournament( tournament ) {
    const newTournament = await this.collection.updateOne( {_id: tournament._id}, {$set: tournament}, {upsert:true} );
    return newTournament;
  }
}

module.exports = Tournaments;