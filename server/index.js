require('dotenv').config()

const WebsocketServer = require("./WebsocketServer")
const {uniqueNamesGenerator, adjectives, colors, animals} = require('unique-names-generator');
const PORT = process.env.PORT || 8080
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => {
    console.log('listening on *:PORT');
});

app.get('/matches', (req, res) => {

    res.send('<h1>Hello world</h1>');
});


const randomName = uniqueNamesGenerator({dictionaries: [adjectives, colors, animals]}); // big_red_donkey
const createShortName = () => {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
        separator: "-",
        length: 3
    }); // big-red-donkey
}

const matches = {}
global.matches = matches

const wss = new WebsocketServer(server)
global["wss"] = wss
