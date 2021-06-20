const MongoClient = require( 'mongodb' ).MongoClient;
const Matches = require( "./Matches" );
const Tournaments = require( "./Tournaments" );
const Participants = require( "./Participants" );

const url = process.env.MONGO_URL
const dbName = process.env.MONGO_DB_NAME || 'sd2';


class Mongo {
  constructor() {
    this.client = new MongoClient( url, {  useUnifiedTopology: true } );
    this.init()
  }
  
  async init() {
    try {
      await this.client.connect()
      this.db = this.client.db( dbName );
      this.Matches = new Matches( this.db )
      this.Tournament = new Tournaments( this.db )
      this.Participants = new Participants( this.db )
    } catch (err) {
      console.error( "Error connecting to mongodb", err, { url, dbName } )
    }
  }
}

module.exports = new Mongo();

