import {Socket} from "phoenix";

let socket = new Socket(
  "/socket",
  {params: {token: ""}}
);
socket.connect();

let channel = socket.channel("game:1", {});

let state = {
  observers: [],
  players: [],
  game_started: false,
  view: [],
  winLoss: [],
  // view: [],
  // guesses: [],
  // players: [],
  
  // lastWinners: [],
};

let callback = null;

// The server sent us a new state.
function state_update(st) {
  console.log("New state", st);
  state = st;
  if (callback) {
    callback(st);
  }
}

export function ch_join(cb, name) {
  callback = cb;
  callback(state);
  //channel = socket.channel("game:" + name, {});
}

export function ch_login(name) {
  channel.push("login", {name: name})
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to login", resp)
         });
  
}

export function ch_addUser(user) {
  channel.push("addUser", user)
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

export function ch_observer(user) {
  channel.push("observer", user)
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

export function ch_player(user) {
  channel.push("player", user)
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

export function ch_ready(user) {
  channel.push("ready", user)
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

export function ch_notReady(user) {
  channel.push("notReady", user)
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}


export function ch_push(guess, name) {
  channel.push("guess", guess, name)
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

export function ch_reset() {
  channel.push("reset", {})
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

channel.join()
       .receive("ok", state_update)
       .receive("error", resp => {
         console.log("Unable to join", resp)
       });

channel.on("view", state_update);
