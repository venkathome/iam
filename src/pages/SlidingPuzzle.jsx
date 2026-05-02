import { useState, useEffect, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './SlidingPuzzle.css'

const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0]

function isSolvable(tiles) {
  const arr = tiles.filter(t => t !== 0)
  let inversions = 0
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] > arr[j]) inversions++
  return inversions % 2 === 0
}

function isWon(tiles) {
  return tiles.every((t, i) => t === GOAL[i])
}

function generateSolvable() {
  const tiles = [...GOAL]
  do {
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]]
    }
  } while (!isSolvable(tiles) || isWon(tiles))
  return tiles
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

// Tile colors by value
const TILE_COLORS = {
  1: '#6366f1', 2: '#8b5cf6', 3: '#a855f7',
  4: '#ec4899', 5: '#f43f5e', 6: '#f97316',
  7: '#eab308', 8: '#22c55e',
}

export default function SlidingPuzzle() {
  const [tiles, setTiles]   = useState(() => generateSolvable())
  const [moves, setMoves]   = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [won, setWon]       = useState(false)
  const [gameKey, setGameKey] = useState(0)

  useEffect(() => {
    if (won) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [gameKey, won])

  const doMove = useCallback((position) => {
    setTiles(prev => {
      const emptyPos = prev.indexOf(0)
      const emptyRow = Math.floor(emptyPos / 3)
      const emptyCol = emptyPos % 3
      const tileRow  = Math.floor(position / 3)
      const tileCol  = position % 3
      if (Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol) !== 1) return prev
      const next = [...prev];
      [next[emptyPos], next[position]] = [next[position], next[emptyPos]]
      if (isWon(next)) setWon(true)
      return next
    })
    setMoves(m => m + 1)
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (won) return
      setTiles(prev => {
        const emptyPos = prev.indexOf(0)
        const emptyRow = Math.floor(emptyPos / 3)
        const emptyCol = emptyPos % 3
        let target = -1
        if (e.key === 'ArrowUp'    && emptyRow < 2) target = emptyPos + 3
        if (e.key === 'ArrowDown'  && emptyRow > 0) target = emptyPos - 3
        if (e.key === 'ArrowLeft'  && emptyCol < 2) target = emptyPos + 1
        if (e.key === 'ArrowRight' && emptyCol > 0) target = emptyPos - 1
        if (target === -1) return prev
        e.preventDefault()
        const next = [...prev];
        [next[emptyPos], next[target]] = [next[target], next[emptyPos]]
        if (isWon(next)) setWon(true)
        setMoves(m => m + 1)
        return next
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [won])

  function shuffle() {
    setTiles(generateSolvable())
    setMoves(0)
    setSeconds(0)
    setWon(false)
    setGameKey(k => k + 1)
  }

  // CELL_SIZE = tile (96px) + gap (6px) = 102px; container = 3*102 - 6 = 300px
  const CELL = 102

  return (
    <div className="sp-page">
      <Breadcrumb />
      <h1>Sliding Puzzle</h1>
      <p className="sp-subtitle">Arrange tiles 1–8 in order. Use arrow keys or click to slide.</p>

      <div className="sp-stats">
        <span className="sp-stat"><span className="sp-stat-label">Moves</span>{moves}</span>
        <span className="sp-stat"><span className="sp-stat-label">Time</span>{formatTime(seconds)}</span>
      </div>

      <div className="sp-board">
        {tiles.map((tile, position) => {
          if (tile === 0) return null
          const row = Math.floor(position / 3)
          const col = position % 3
          return (
            <div
              key={tile}
              className="sp-tile"
              style={{
                transform: `translate(${col * CELL}px, ${row * CELL}px)`,
                background: TILE_COLORS[tile],
              }}
              onClick={() => !won && doMove(position)}
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
          <button className="sp-play-again" onClick={shuffle}>Play Again</button>
        </div>
      )}

      <button className="sp-shuffle-btn" onClick={shuffle}>Shuffle</button>

      <p className="sp-tip">Tip: use ← → ↑ ↓ arrow keys to slide tiles</p>
    </div>
  )
}
