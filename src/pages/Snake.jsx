import { useState, useEffect, useRef, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './Snake.css'

const HOW_TO_PLAY = [
  'Use the arrow keys (or W A S D) to steer the snake.',
  'Eat the red food to grow longer and increase your score.',
  'Avoid hitting the walls or running into your own tail.',
  'The snake gets faster as you grow — stay sharp!',
]

const COLS = 25
const ROWS = 25
const MIN_INTERVAL = 60

const DIFF_CONFIG = {
  'very-easy': { initInterval: 280 },
  'easy':      { initInterval: 200 },
  'medium':    { initInterval: 150 },
  'hard':      { initInterval: 110 },
  'very-hard': { initInterval: 80  },
  'ultimate':  { initInterval: 50  },
}

function initSnake() {
  const r = Math.floor(ROWS / 2)
  const c = Math.floor(COLS / 2)
  return [{ r, c }, { r, c: c - 1 }, { r, c: c - 2 }]
}

function randomFood(snake) {
  const occupied = new Set(snake.map(s => `${s.r},${s.c}`))
  const empty = []
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (!occupied.has(`${r},${c}`)) empty.push({ r, c })
  return empty[Math.floor(Math.random() * empty.length)]
}

function moveSnake(snake, dir, food) {
  const head = snake[0]
  const newHead = { r: head.r + dir.dr, c: head.c + dir.dc }
  const died =
    newHead.r < 0 || newHead.r >= ROWS ||
    newHead.c < 0 || newHead.c >= COLS ||
    snake.some(s => s.r === newHead.r && s.c === newHead.c)
  if (died) return { snake, ate: false, died: true }
  const ate = newHead.r === food.r && newHead.c === food.c
  const newSnake = ate ? [newHead, ...snake] : [newHead, ...snake.slice(0, -1)]
  return { snake: newSnake, ate, died: false }
}

function intervalForScore(score, initInterval) {
  return Math.max(MIN_INTERVAL, initInterval - Math.floor(score / 5) * 15)
}

export default function Snake() {
  const [difficulty, setDifficulty] = useState('medium')
  const [snake, setSnake] = useState(initSnake)
  const [food, setFood] = useState(() => randomFood(initSnake()))
  const [dir, setDir] = useState({ dr: 0, dc: 1 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const intervalRef = useRef(null)
  const nextDirRef = useRef({ dr: 0, dc: 1 })
  const stateRef = useRef({ snake, food, dir, score })
  const initIntervalRef = useRef(DIFF_CONFIG['medium'].initInterval)

  useEffect(() => {
    stateRef.current = { snake, food, dir, score }
  })

  const tick = useCallback(() => {
    const { snake: s, food: f, dir: d, score: sc } = stateRef.current
    const nd = nextDirRef.current
    const effectiveDir = (nd.dr !== 0 || nd.dc !== 0) ? nd : d
    const { snake: newSnake, ate, died } = moveSnake(s, effectiveDir, f)
    if (died) {
      clearInterval(intervalRef.current)
      setGameOver(true)
      return
    }
    setDir(effectiveDir)
    setSnake(newSnake)
    if (ate) {
      const newScore = sc + 1
      setScore(newScore)
      setFood(randomFood(newSnake))
      const initInterval = initIntervalRef.current
      const newInterval = intervalForScore(newScore, initInterval)
      const oldInterval = intervalForScore(sc, initInterval)
      if (newInterval !== oldInterval) {
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(tick, newInterval)
      }
    }
  }, [])

  function startGame() {
    const initInterval = DIFF_CONFIG[difficulty].initInterval
    initIntervalRef.current = initInterval
    const s = initSnake()
    const f = randomFood(s)
    setSnake(s)
    setFood(f)
    setDir({ dr: 0, dc: 1 })
    nextDirRef.current = { dr: 0, dc: 1 }
    setScore(0)
    setGameOver(false)
    setStarted(true)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(tick, initInterval)
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    function onKey(e) {
      const cur = nextDirRef.current
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && cur.dr !== 1)
        { e.preventDefault(); nextDirRef.current = { dr: -1, dc: 0 } }
      else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && cur.dr !== -1)
        { e.preventDefault(); nextDirRef.current = { dr: 1, dc: 0 } }
      else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && cur.dc !== 1)
        { e.preventDefault(); nextDirRef.current = { dr: 0, dc: -1 } }
      else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && cur.dc !== -1)
        { e.preventDefault(); nextDirRef.current = { dr: 0, dc: 1 } }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const snakeSet = new Set(snake.map(s => `${s.r},${s.c}`))
  const level = 1 + Math.floor(score / 5)
  const speed = intervalForScore(score, initIntervalRef.current)

  return (
    <div className="snake-page">
      <Breadcrumb />
      <h1 className="snake-title">SNAKE</h1>
      <HowToPlay steps={HOW_TO_PLAY} />

      <div className="snake-scorebar">
        <span>SCORE: <strong>{score}</strong></span>
        <span>LEVEL: <strong>{level}</strong></span>
        <span>SPEED: <strong>{Math.round(1000 / speed)}fps</strong></span>
      </div>

      <div className="snake-grid-wrap">
        <div className="snake-grid">
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const key = `${r},${c}`
              const isHead = snake[0].r === r && snake[0].c === c
              const isBody = !isHead && snakeSet.has(key)
              const isFood = food.r === r && food.c === c
              return (
                <div
                  key={key}
                  className={`snake-cell ${isHead ? 'cell--head' : isBody ? 'cell--body' : isFood ? 'cell--food' : 'cell--empty'}`}
                />
              )
            })
          )}
        </div>

        {!started && (
          <div className="snake-overlay">
            <pre className="snake-art">{`
  ●══╗
     ╚╗
      ╚●`}</pre>
            <p className="snake-over-title">SNAKE</p>
            <p className="snake-over-sub">Eat the red food. Avoid walls and yourself.</p>
            <DifficultySelector value={difficulty} onChange={(d) => { setDifficulty(d) }} />
            <button className="snake-btn" onClick={startGame}>[ START GAME ]</button>
            <p className="snake-tip">Arrow keys or WASD to move</p>
          </div>
        )}

        {gameOver && (
          <div className="snake-overlay">
            <p className="snake-over-title">GAME OVER</p>
            <p className="snake-over-score">Score: {score} &nbsp;|&nbsp; Level: {level}</p>
            <DifficultySelector value={difficulty} onChange={(d) => { setDifficulty(d) }} />
            <button className="snake-btn" onClick={startGame}>[ PLAY AGAIN ]</button>
          </div>
        )}
      </div>

      <p className="snake-controls-tip">Arrow keys or WASD · Avoid walls and yourself</p>
    </div>
  )
}
