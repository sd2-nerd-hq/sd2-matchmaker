class Participants {
  constructor( db ) {
    this.collection = db.collection( 'participant' );
  }
  
  async addParticipant( participant ) {
    const newParticipant = await this.collection.updateOne( {_id: participant._id}, {$set: participant}, {upsert:true} );
    return newParticipant;
  }
}

module.exports = Participants;