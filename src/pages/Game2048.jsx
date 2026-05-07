import { useState, useEffect, useRef } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './Game2048.css'

const HOW_TO_PLAY = [
  'Use the arrow keys to slide all tiles in one direction.',
  'When two tiles with the same number touch, they merge into one.',
  'Keep merging tiles to reach the target number — 2048!',
  'The game ends when no more moves are possible.',
  'Tip: try to keep your highest tile in a corner.',
]

const DIFF_CONFIG = {
  'very-easy': { size: 3, target: 512  },
  'easy':      { size: 4, target: 1024 },
  'medium':    { size: 4, target: 2048 },
  'hard':      { size: 5, target: 2048 },
  'very-hard': { size: 5, target: 4096 },
  'ultimate':  { size: 6, target: 4096 },
}

function emptyGrid(size) {
  return Array(size).fill(null).map(() => Array(size).fill(0))
}

function addTile(grid, size) {
  const empty = []
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (grid[r][c] === 0) empty.push([r, c])
  if (!empty.length) return grid
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  const next = grid.map(row => [...row])
  next[r][c] = Math.random() < 0.9 ? 2 : 4
  return next
}

function startGrid(size) {
  return addTile(addTile(emptyGrid(size), size), size)
}

function slideRow(row, size) {
  const vals = row.filter(v => v !== 0)
  const out = []
  let score = 0
  let i = 0
  while (i < vals.length) {
    if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
      out.push(vals[i] * 2)
      score += vals[i] * 2
      i += 2
    } else {
      out.push(vals[i])
      i++
    }
  }
  while (out.length < size) out.push(0)
  return { row: out, score }
}

function applyLeft(grid, size) {
  let score = 0
  const next = grid.map(row => {
    const { row: r, score: s } = slideRow(row, size)
    score += s
    return r
  })
  return { grid: next, score }
}

function applyRight(grid, size) {
  let score = 0
  const next = grid.map(row => {
    const { row: r, score: s } = slideRow([...row].reverse(), size)
    score += s
    return r.reverse()
  })
  return { grid: next, score }
}

function transpose(g) {
  return g[0].map((_, c) => g.map(row => row[c]))
}

function applyUp(grid, size) {
  const { grid: g, score } = applyLeft(transpose(grid), size)
  return { grid: transpose(g), score }
}

function applyDown(grid, size) {
  const { grid: g, score } = applyRight(transpose(grid), size)
  return { grid: transpose(g), score }
}

function gridsEqual(a, b) {
  return a.every((row, r) => row.every((v, c) => v === b[r][c]))
}

function isGameOver(grid, size) {
  if (grid.some(row => row.some(v => v === 0))) return false
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      if (c + 1 < size && grid[r][c] === grid[r][c + 1]) return false
      if (r + 1 < size && grid[r][c] === grid[r + 1][c]) return false
    }
  return true
}

const COLORS = {
  0:    { bg: 'transparent', color: 'transparent' },
  2:    { bg: '#eee4da', color: '#776e65' },
  4:    { bg: '#ede0c8', color: '#776e65' },
  8:    { bg: '#f2b179', color: '#f9f6f2' },
  16:   { bg: '#f59563', color: '#f9f6f2' },
  32:   { bg: '#f67c5f', color: '#f9f6f2' },
  64:   { bg: '#f65e3b', color: '#f9f6f2' },
  128:  { bg: '#edcf72', color: '#f9f6f2' },
  256:  { bg: '#edcc61', color: '#f9f6f2' },
  512:  { bg: '#edc850', color: '#f9f6f2' },
  1024: { bg: '#edc53f', color: '#f9f6f2' },
  2048: { bg: '#edc22e', color: '#f9f6f2' },
}

function tileStyle(v) {
  return COLORS[v] || { bg: '#3c3a32', color: '#f9f6f2' }
}

function fontSize(v) {
  if (v >= 1024) return '1.3rem'
  if (v >= 128)  return '1.6rem'
  return '2rem'
}

export default function Game2048() {
  const [difficulty, setDifficulty] = useState('medium')
  const size = DIFF_CONFIG[difficulty].size
  const target = DIFF_CONFIG[difficulty].target

  const [grid, setGrid]   = useState(() => startGrid(DIFF_CONFIG['medium'].size))
  const [score, setScore] = useState(0)
  const [best, setBest]   = useState(() => +localStorage.getItem('2048-best') || 0)
  const [won, setWon]     = useState(false)
  const [keepGoing, setKeepGoing] = useState(false)
  const [over, setOver]   = useState(false)

  const cellPx = size <= 3 ? 96 : size === 4 ? 76 : size === 5 ? 60 : 50

  const stateRef = useRef({ grid, score, won, keepGoing, over, size, target })
  useEffect(() => { stateRef.current = { grid, score, won, keepGoing, over, size, target } })

  function restart(sz, tgt) {
    setGrid(startGrid(sz))
    setScore(0)
    setWon(false)
    setKeepGoing(false)
    setOver(false)
  }

  function doMove(direction) {
    const { grid: g, score: sc, won: w, keepGoing: kg, over: ov, size: sz, target: tgt } = stateRef.current
    if (ov || (w && !kg)) return

    const fns = {
      left:  (gr) => applyLeft(gr, sz),
      right: (gr) => applyRight(gr, sz),
      up:    (gr) => applyUp(gr, sz),
      down:  (gr) => applyDown(gr, sz),
    }
    const { grid: moved, score: gained } = fns[direction](g)
    if (gridsEqual(moved, g)) return

    const next = addTile(moved, sz)
    const newScore = sc + gained

    setGrid(next)
    setScore(newScore)
    setBest(b => {
      const nb = Math.max(b, newScore)
      localStorage.setItem('2048-best', String(nb))
      return nb
    })
    if (!w && next.some(row => row.some(v => v >= tgt))) setWon(true)
    if (isGameOver(next, sz)) setOver(true)
  }

  useEffect(() => {
    function onKey(e) {
      const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }
      if (map[e.key]) { e.preventDefault(); doMove(map[e.key]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="g2048-page">
      <Breadcrumb />
      <div className="g2048-header">
        <div>
          <h1 className="g2048-title">2048</h1>
          <p className="g2048-hint">Use arrow keys or buttons to slide tiles</p>
        </div>
        <div className="g2048-scores">
          <div className="g2048-score"><span>SCORE</span><strong>{score}</strong></div>
          <div className="g2048-score"><span>BEST</span><strong>{best}</strong></div>
        </div>
      </div>

      <DifficultySelector
        value={difficulty}
        onChange={(d) => { setDifficulty(d); restart(DIFF_CONFIG[d].size, DIFF_CONFIG[d].target) }}
      />
      <HowToPlay steps={HOW_TO_PLAY} />

      <button className="g2048-new-btn" onClick={() => restart(size, target)}>New Game</button>

      <div className="g2048-board-wrap">
        <div
          className="g2048-board"
          style={{ gridTemplateColumns: `repeat(${size}, ${cellPx}px)`, gridTemplateRows: `repeat(${size}, ${cellPx}px)` }}
        >
          {grid.map((row, r) => row.map((v, c) => {
            const { bg, color } = tileStyle(v)
            return (
              <div key={`${r}-${c}`} className={`g2048-cell ${v ? 'g2048-cell--filled' : ''}`}
                style={{ background: bg, color, width: cellPx, height: cellPx }}>
                {v !== 0 && <span style={{ fontSize: fontSize(v) }}>{v}</span>}
              </div>
            )
          }))}
        </div>

        {won && !keepGoing && (
          <div className="g2048-overlay g2048-overlay--won">
            <p>🎉 You reached {target}!</p>
            <div className="g2048-overlay-btns">
              <button onClick={() => setKeepGoing(true)}>Keep going</button>
              <button onClick={() => restart(size, target)}>New game</button>
            </div>
          </div>
        )}
        {over && (
          <div className="g2048-overlay g2048-overlay--over">
            <p>Game Over</p>
            <p className="g2048-final-score">Score: {score}</p>
            <button onClick={() => restart(size, target)}>Try again</button>
          </div>
        )}
      </div>

      <div className="g2048-controls">
        <button className="g2048-ctrl" onClick={() => doMove('up')}>▲</button>
        <div className="g2048-ctrl-row">
          <button className="g2048-ctrl" onClick={() => doMove('left')}>◀</button>
          <button className="g2048-ctrl" onClick={() => doMove('down')}>▼</button>
          <button className="g2048-ctrl" onClick={() => doMove('right')}>▶</button>
        </div>
      </div>
    </div>
  )
}
