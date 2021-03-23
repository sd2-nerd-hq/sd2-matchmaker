const Match = require( "./Match" )
const Discord = require( "discord.js" );
const config = require( "./config.json" );
const Datastore = require( 'nedb-promises' )
const client = new Discord.Client();
const WebsocketServer = require( "./WebsocketServer" )
const { nanoid } = require( "nanoid" )
const PREFIX = "!"
let datastore = Datastore.create( 'data/db.db' )
const { uniqueNamesGenerator, adjectives, colors, animals } = require( 'unique-names-generator' );

const randomName = uniqueNamesGenerator( { dictionaries: [adjectives, colors, animals] } ); // big_red_donkey

const createShortName = () => {
  return uniqueNamesGenerator( {
    dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
    separator: "-",
    length: 3
  } ); // big-donkey
}

const matches = {}
global.matches = matches

const wss = new WebsocketServer( matches )

client.on( "message", async function ( message ) {
  console.log( "MESSAGE", message )
  if ( message.author.bot ) return;
  if ( !message.content.startsWith( PREFIX ) ) return;
  
  const commandBody = message.content.slice( PREFIX.length );
  const args = commandBody.split( ' ' );
  const command = args.shift().toLowerCase();
  
  console.log( { args, command } )
  const author = message.author
  const authorId = author.id
  
  let player = await datastore.findOne( { authorId } )
  if ( !player ) {
    player = {
      authorId: authorId,
      funds: 40000,
      stocks: [],
      trades: []
    }
  }
  
  console.log( { player } )
  
  if ( command === "ping" ) {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply( `Pong! This message had a latency of ${timeTaken}ms.` );
    return
  }
  
  if ( command === "match" ) {
    const matchId = createShortName()
    const token0 = nanoid()
    const token1 = nanoid()
    
    // TODO: CHECK PARTICIPANTS
    if ( message.mentions.users.length === 0 || message.mentions.users.length > 1 ) {
      message.reply( "To start a match you need to mention one other player" )
      return
    }
    
    const playerTwo = message.mentions.users.first()
    const participants = [message.author, playerTwo]
    
    console.log( { participants } )
    
    //TODO: CREATE MATCH
    matches[ matchId ] = new Match( {
      token0,
      token1,
      matchId,
      authorId,
      playerOne: {
        username: message.author.username
      },
      playerTwo: {
        username: playerTwo.username
      },
      participants,
    } )
    
    message.reply( `New Match:
    Player 1 ${config.APP_URL}/match/${matchId}/${token0}
    Player 2 ${config.APP_URL}/match/${matchId}/${token1}
    Spectator ${config.APP_URL}/match/${matchId}
    ` )
    
    
    // GLOBAL MATCH NOTIFICATION
    // const channel = client.channels.cache.find( channel => channel.name === "test-the-bot" )
    // channel && channel.send( `${message.member.user.tag} is starting a match: ${config.APP_URL}/match/${matchId}/` )
    // channel && channel.send( `${message.member.user.tag} is starting a match: ${config.APP_URL}/match/${matchId}/` )
    
  }
  
  if ( command === "buy" ) {
    
  }
  
  if ( command === "sell" ) {
    
  }
  
  if ( command === "depot" ) {
    
  }
  
  
} );


client.login( config.BOT_TOKEN );