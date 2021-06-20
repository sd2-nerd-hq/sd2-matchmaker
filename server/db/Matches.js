

class Matches {
  constructor( db ) {
    this.collection = db.collection( 'match' );
  }
  
  async addMatch( match ) {
    const newMatch = await this.collection.updateOne( {_id: match._id}, {$set: match}, {upsert:true} );
    return newMatch;
  }
  
  async findById( id ) {
    const match = await this.collection.findOne( {_id: id} );
    return match;
  }
  
  async updateMatch(match){
  await this.collection.updateOne( {_id: match._id}, {$set: match}, {upsert:true} );
  }
}

module.exports = Matches;