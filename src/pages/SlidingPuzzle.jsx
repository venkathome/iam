import { useState, useEffect, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './SlidingPuzzle.css'

const HOW_TO_PLAY = [
  'Click a tile next to the empty space to slide it in.',
  'You can also use the arrow keys to slide tiles.',
  'Arrange all the tiles in order from 1 to the last number, left to right, top to bottom.',
  'Try to finish in the fewest moves and the shortest time!',
]

const DIFF_CONFIG = {
  'very-easy': { size: 2 },
  'easy':      { size: 3 },
  'medium':    { size: 3 },
  'hard':      { size: 4 },
  'very-hard': { size: 4 },
  'ultimate':  { size: 5 },
}

function makeGoal(size) {
  const total = size * size
  return Array.from({ length: total }, (_, i) => (i + 1) % total)
}

function isSolvable(tiles, size) {
  const arr = tiles.filter(t => t !== 0)
  let inversions = 0
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] > arr[j]) inversions++
  if (size % 2 === 1) return inversions % 2 === 0
  const blankRow = Math.floor(tiles.indexOf(0) / size)
  const blankFromBottom = size - blankRow
  return (blankFromBottom % 2 === 0) ? inversions % 2 === 1 : inversions % 2 === 0
}

function isWon(tiles, size) {
  const goal = makeGoal(size)
  return tiles.every((t, i) => t === goal[i])
}

function generateSolvable(size) {
  const goal = makeGoal(size)
  const tiles = [...goal]
  do {
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]]
    }
  } while (!isSolvable(tiles, size) || isWon(tiles, size))
  return tiles
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

const TILE_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6',
  '#d946ef', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#14b8a6', '#6366f1', '#f97316', '#a855f7', '#84cc16',
  '#ec4899', '#0ea5e9', '#f43f5e', '#22c55e',
]

export default function SlidingPuzzle() {
  const [difficulty, setDifficulty] = useState('medium')
  const size = DIFF_CONFIG[difficulty].size

  const [tiles, setTiles]   = useState(() => generateSolvable(DIFF_CONFIG['medium'].size))
  const [moves, setMoves]   = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [won, setWon]       = useState(false)
  const [gameKey, setGameKey] = useState(0)

  useEffect(() => {
    if (won) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [gameKey, won])

  const doMove = useCallback((position, sz, currentTiles) => {
    setTiles(prev => {
      const t = currentTiles ?? prev
      const emptyPos = t.indexOf(0)
      const emptyRow = Math.floor(emptyPos / sz)
      const emptyCol = emptyPos % sz
      const tileRow  = Math.floor(position / sz)
      const tileCol  = position % sz
      if (Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol) !== 1) return prev
      const next = [...prev];
      [next[emptyPos], next[position]] = [next[position], next[emptyPos]]
      if (isWon(next, sz)) setWon(true)
      return next
    })
    setMoves(m => m + 1)
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (won) return
      setTiles(prev => {
        const emptyPos = prev.indexOf(0)
        const emptyRow = Math.floor(emptyPos / size)
        const emptyCol = emptyPos % size
        let target = -1
        if (e.key === 'ArrowUp'    && emptyRow < size - 1) target = emptyPos + size
        if (e.key === 'ArrowDown'  && emptyRow > 0)        target = emptyPos - size
        if (e.key === 'ArrowLeft'  && emptyCol < size - 1) target = emptyPos + 1
        if (e.key === 'ArrowRight' && emptyCol > 0)        target = emptyPos - 1
        if (target === -1) return prev
        e.preventDefault()
        const next = [...prev];
        [next[emptyPos], next[target]] = [next[target], next[emptyPos]]
        if (isWon(next, size)) setWon(true)
        setMoves(m => m + 1)
        return next
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [won, size])

  function shuffle(sz) {
    setTiles(generateSolvable(sz))
    setMoves(0)
    setSeconds(0)
    setWon(false)
    setGameKey(k => k + 1)
  }

  const TILE = size <= 3 ? 96 : size === 4 ? 72 : 56
  const GAP  = 6
  const CELL = TILE + GAP
  const BOARD = size * TILE + (size - 1) * GAP

  return (
    <div className="sp-page">
      <Breadcrumb />
      <h1>Sliding Puzzle</h1>
      <p className="sp-subtitle">Arrange tiles in order. Use arrow keys or click to slide.</p>

      <DifficultySelector
        value={difficulty}
        onChange={(d) => { setDifficulty(d); shuffle(DIFF_CONFIG[d].size) }}
      />
      <HowToPlay steps={HOW_TO_PLAY} />

      <div className="sp-stats">
        <span className="sp-stat"><span className="sp-stat-label">Moves</span>{moves}</span>
        <span className="sp-stat"><span className="sp-stat-label">Time</span>{formatTime(seconds)}</span>
      </div>

      <div className="sp-board" style={{ width: BOARD, height: BOARD }}>
        {tiles.map((tile, position) => {
          if (tile === 0) return null
          const row = Math.floor(position / size)
          const col = position % size
          return (
            <div
              key={tile}
              className="sp-tile"
              style={{
                transform: `translate(${col * CELL}px, ${row * CELL}px)`,
                background: TILE_COLORS[(tile - 1) % TILE_COLORS.length],
                width: TILE,
                height: TILE,
                fontSize: TILE < 72 ? '1.4rem' : '2rem',
              }}
              onClick={() => !won && doMove(position, size)}
            >
              {tile}
            </div>
          )
        })}
      </div>

      {won && (
        <div className="sp-won">
          <p className="sp-won-title">🎉 Solved!</p>
          <p className="sp-won-stats">{moves} moves · {formatTime(seconds)}</p>
          <button className="sp-play-again" onClick={() => shuffle(size)}>Play Again</button>
        </div>
      )}

      <button className="sp-shuffle-btn" onClick={() => shuffle(size)}>Shuffle</button>

      <p className="sp-tip">Tip: use ← → ↑ ↓ arrow keys to slide tiles</p>
    </div>
  )
}
