import React, { useState, useEffect } from 'react';
import 'milligram';

import "../css/bulls.css"

import { ch_join, ch_push,
  ch_login, ch_reset, ch_addUser } from './socket';

function GameOver(props) {
  //let reset = props['reset'];
  let {reset} = props;

  // On GameOver screen,
  // set page title to "Game Over!"

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
          ch_push({letter: text});
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
            <p>Guesses: {"\n" + view}</p>
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
    view: "",
    name: "",
    guesses: [],
    players: [],
  });

  useEffect(() => {
    ch_join(setState);
  });

  let body = null;

  if (state.name === "") {
    body = <Login />;
  }
  // FIXME: Correct guesses shouldn't count.
  else if (state.guesses.length < 8) {
    body = <Play state={state} />;
  }
  else {
    body = <GameOver reset={reset} />;
  }

  return (
      <div className="container">
        {body}
      </div>
  );
}

export default Hangman;