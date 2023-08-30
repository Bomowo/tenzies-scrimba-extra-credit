import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import Timer from "./Timer"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(true)
    const [numOfMoves, setNumOfMoves] = React.useState(0);
    const [playTime, setPlayTime] = React.useState(0)
    const [confettiToggle, setConfettiToggle] = React.useState(false)
    const [bestScore, setBestScore] = React.useState(JSON.parse(localStorage.getItem('best')) || {bestMoves: 'First Game', bestTime: 'First Game'})
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)

        if (allHeld && allSameValue) {
            if((numOfMoves < bestScore.bestMoves) || bestScore.bestMoves === 'First Game') {
                setBestScore(prevScore => { return {
                    ...prevScore,
                    bestMoves: numOfMoves
                }})
            }
            if((playTime<bestScore.bestTime) || bestScore.bestTime === 'First Game') {
                setBestScore(prevScore => {return {
                    ...prevScore,
                    bestTime: playTime
                }})
            }
            localStorage.setItem("best", JSON.stringify(bestScore));
            setTenzies(true)
            setConfettiToggle(true)

        }
    // eslint-disable-next-line 
    }, [dice, bestScore])



    React.useEffect(() => {
        let intervalId

        if(!tenzies){
            intervalId = setInterval(() => setPlayTime(playTime + 1), 10)
        }

        return () => clearInterval(intervalId)

    }, [tenzies, playTime])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setNumOfMoves(prevNum => prevNum + 1)
        } else {
            setTenzies(false)
            setConfettiToggle(false)
            setDice(allNewDice())
            setNumOfMoves(0)
            setPlayTime(0)
            localStorage.setItem("best", JSON.stringify(bestScore));
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {confettiToggle && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <p>Number of moves: {numOfMoves} <span>Least moves: {bestScore.bestMoves}</span></p>
            <div className="time"><Timer timeInMilliseconds={playTime} />{isNaN(bestScore.bestTime)?'First Game': <Timer timeInMilliseconds={bestScore.bestTime}/>}</div>
        </main>
    )
}