import React, { useState, useEffect } from 'react';
import { ch_join, ch_push, ch_reset } from './socket';

function Bulls() {
    // render function,
    // should be pure except setState
    const [state, setState] = useState({
        view: "",
        gameWon: false,
        guesses: [],
        lives: 0,
    });

    const [g, setG] = useState({
        guess: "",
    })

    let {view, gameWon, guesses, lives} = state;
    let {guess} = g;

    useEffect(() => {
        ch_join(setState);
    });

    function keypress(ev) {
        if (ev.key === "Enter") {
            makeGuess();
        }
    }

    function hasDuplicates(arr) {
        return new Set(arr).size !== arr.length;
    }

    function makeGuess() {

        if (guess.length != 4) {
            //doNothing
        }
        else if (hasDuplicates(guess)) {
            //doNothing
        }
        else {

            // Inner function isn't a render function
            ch_push({letter: guess});

            setG(prevState => ({
                ...prevState,
                guess: ""
            }));
        }

    }

    function reset() {

        setG(prevState => ({
            ...prevState,
            guess: ""
        }));
        console.log("Time to reset");
        ch_reset();
    }

    function updateGuess(ev) {
        const re = /^[0-9\b]+$/;
        let text = ev.target.value;
        if (text.length > 3) {
            text = text[0] + text[1] + text[2] + text[3];
        }
        if (!re.test(text)) {
            text = text.substring(0, text.length - 1);
        }
        setG(prevState => ({
            ...prevState,
            guess: text
        }));

    }

    //If the game has been won!
    if (gameWon) {
        return (
            <div className = "App">
                <div class = "test">
                    CS4550 Spring 2021 HW05
                </div>
                <h1 class = "title">
                    Bulls and Cows
                </h1>
                <h3 class = "win">
                    You Win!
                </h3>
                <p>
                    The Secret Was IDK
                </p>
                <button onClick={() => reset()}>
                    Reset
                </button>
            </div>
        )
    }

    //If the game wasnt won, and lives are equal to zero, the player loses!
    if (lives === 0) {
        return (
            <div className = "App">
                <div class = "test">
                    CS4550 Spring 2021 HW05
                </div>
                <h1 class = "title">
                    Bulls and Cows
                </h1>
                <h3 class = "lose">
                    You Lose!
                </h3>
                <p>
                    The Secret Was IDK
                </p>
                <button onClick={() => reset()}>
                    Reset
                </button>
            </div>
        )
    }

    return (
        <div className="App">
            <div class = "test">
                CS4550 Spring 2021 HW05
            </div>
            <h1 class = "title">
                Bulls and Cows!
            </h1>
            <input type ="text" class = "guess" value={guess} onChange={updateGuess} onKeyPress={keypress}/>

            <div>
                <p>
                    Guess The 4-Digit Sequence. No Duplicates Are Allowed. Must Guess 4 Digits.
                </p>
                <button onClick={makeGuess}>
                    Guess
                </button>
                <button onClick={() => reset()}>
                    Reset
                </button>
            </div>
            <h1>Guesses Left: {lives}</h1>
            <p class = "output">{view}</p>
        </div>

    );

}

export default Bulls;