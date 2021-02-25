import React, { useState, useEffect } from 'react';
import 'milligram';

import "../css/bulls.css"

import { ch_join, ch_push,
  ch_login, ch_reset, ch_addUser } from './socket';

function GameOver(props) {
  let {reset} = props;

  return (
      <div className="row">
        <div className="column">
          <h1>Game Over!</h1>
          <p>
            <button onClick={reset}>
              Reset
            </button>
          </p>
        </div>
      </div>
  );
}

function Controls({guess, reset}) {
  // WARNING: State in a nested component requires
  // careful thought.
  // If this component is ever unmounted (not shown
  // in a render), the state will be lost.
  // The default choice should be to put all state
  // in your root component.
  const [text, setText] = useState("");

  function keyDown(ev) {
    if (ev.key === "Enter") {
      guess(text);
    }
    else if (ev.key === "Backspace") {
      setText(text.slice(0,-1));
    }
    else {
      setText(text.concat(ev.key));
    }
  }

  return (
      <div className="row">
        <div className="column">
          <p>
            <input type="text"
                   value={text}
                   onKeyDown={keyDown} />
          </p>
        </div>
        <div className="column">
          <p>
            <button onClick={() => guess(text)}>Guess</button>
          </p>
        </div>
        <div className="column">
          <p>
            <button onClick={reset}>
              Reset
            </button>
          </p>
        </div>
      </div>
  );
}

function reset() {
  console.log("Time to reset");
  ch_reset();
}

function Play({state}) {
  let {view, guesses, name, players} = state;

    function validGuess(guess) {
        let nums = /^[0-9]+$/;
        let guessSet = new Set();
        if (guess.length !== 4) {
            return false;
        }
        if (!guess.match(nums)) {
            return false;
        }
        for (let i = 0; i < guess.length; i++) {
            if (guessSet.has(guess[i])) {
                return false;
            }
            else {
                guessSet.add(guess[i]);
            }
        }
        return true;
    }

  function guess(text) {
    // Inner function isn't a render function
      if (validGuess(text)) {
          ch_push({letter: text, username: name});
      }
        else {
            alert("bad guess");
      }
  }

  

  // FIXME: Correct guesses shouldn't count.
  let lives = 8 - guesses.length;

  return (
      <div>
        <Controls reset={reset} guess={guess} />
        <div>
          <p>Players: {players.join(", ")}</p>
        </div>
        <div className="row">
          
          <div className="column">
            <p>Name: {name}</p>
          </div>
        </div>
        <div className="row">
          <div className="output">
            <p>Guesses: {"\n" + view.join("\n")}</p>
          </div>
          
        </div>
       
      </div>
  );
}

function Go(name) {
  ch_login(name);
  ch_addUser({name: name});
}

function Login() {
  const [name, setName] = useState("");

  return (
      <div className="row">
        <div className="column">
          <input type="text"
                 value={name}
                 onChange={(ev) => setName(ev.target.value)} />
        </div>
        <div className="column">
          <button onClick={() => Go(name)}>
            Login
          </button>
        </div>
      </div>
  );
}

function Hangman() {
  // render function,
  // should be pure except setState
  const [state, setState] = useState({
    view: [],
    name: "",
    guesses: [],
    players: [],
  });

  useEffect(() => {
    ch_join(setState, "1");
  });

  function GameWon(props) {
    let winner = "";
    let guesses = 0;
    for (let i = 0; i < state["view"].length; i++) {
          if (state["view"][i].includes("4B")) {
              winner = state["view"][i].split(/\r?\n/)[0];
          }
    }
      for (const [key, value] of Object.entries(state["guesses"])) {
          if (key === winner) {
              guesses = value.length;
          }
      }
    let {reset} = props;
      return (
        <div className="row">
          <div className="column">
            <h1>{winner} won in {guesses} guesses!</h1>
            <p>
            <button onClick={reset}>
                            Reset
            </button>
            </p>
          </div>
        </div>
      );
  }

  function gameIsWon() {
      for (let i = 0; i < state["view"].length; i++) {
          if (state["view"][i].includes("4B")) {
              return true;
          }
      }
      return false;
  }

  function gameIsLost() {
      for (const [_, value] of Object.entries(state["guesses"])) {
          if (value.length > 7) {
              return true;
          }
      }
      return false;
  }

  let body = null;

  if (state.name === "") {
    body = <Login />;
  }
  //game is won if anyone has the right answer
  else if (gameIsWon()) {
      body = <GameWon reset={reset} />;
  }
  // game is lost if anyone has used 8 guesses and no one has won
  else if (gameIsLost()) {
      body = <GameOver reset={reset} />;
  }
  else {
    console.log(state["view"]);
    body = <Play state={state} />;
  }

  return (
      <div className="container">
        {body}
      </div>
  );
}

export default Hangman;