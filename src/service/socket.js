import create from "zustand";
import cogoToast from 'cogo-toast';

class Socket {
    token = false
    matchId = false

    constructor() {
        const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER)
        this.ws = ws

        this.ws.onopen = () => {
            useServer.setState(() => ({ready: true}))
            // Web Socket is connected, send data using send()
            ws.send("Message to send");
            console.log("Message is sent...");
        };

        this.ws.onmessage = (evt) => {
            const received_msg = evt.data;
            try {
                const json = JSON.parse(evt.data)
                const {event, data} = json
                this.handleMessage(event, data)
            } catch (err) {
                // meh
            }
        };

        this.ws.onclose = function () {
            // websocket is closed.
            console.log("Connection is closed...");
        };
    }

    setToken(token) {
        this.token = token
    }

    setMatchId(matchId) {
        this.matchId = matchId
    }

    handleMessage(event, data) {
        switch (event) {
            case "MSG":
                console.log("MSG", data)
                cogoToast.info(data, {
                    position: "bottom-center"
                });

                break;
            case "MATCH:INIT":
            case "MATCH:UPDATE":
                console.log("MATCH:UPDATE", data)
                useServer.setState(() => ({match: data}))
                break;
        }
    }

    send(event, data) {
        this.ws.send(JSON.stringify({event, data, matchId: this.matchId, token: this.token}))
    }

}

const useServer = create(set => ({
        ready: false
    })
)

const [useProfile, profileAPI] = create(set => ({
    username: false,
    logout: () => {
        localStorage.clear()
        set({username: false})
    },
    assignUsername: (username) => {
        localStorage.setItem("sd2:username", username)
        set({username})
    }
}))

profileAPI.setState({username: localStorage.getItem("sd2:username")})

const [useMatch, matchAPI] = create(set => ({
    coinWinner: undefined,
    map: false,
    setBans: (team, bannedMaps) => {
        console.log({team, bannedMaps})
        if (team === "A") {
            set({teamA: {bannedMaps}})
        } else {
            set({teamB: {bannedMaps}})
        }
    },
    teamA: {
        division: false,
        bannedDivisions: [],
        bannedMaps: {},
        players: []
    },
    teamB: {
        division: false,
        bannedDivisions: [],
        bannedMaps: {},
        players: []
    },
}))

window.matchAPI = matchAPI
const socket = new Socket()
window.socket = socket
export default socket
export {useServer, useProfile, useMatch}
