import { useState, useEffect, useRef, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './Tetris.css'

const HOW_TO_PLAY = [
  'Colorful pieces fall from the top of the board.',
  'Use ← → to move a piece left or right.',
  'Press ↑ to rotate the piece.',
  'Press ↓ to drop it faster.',
  'Fill a complete horizontal row to clear it and earn points.',
  "Don't let the pieces stack up to the top — that's game over!",
]

const DIFF_CONFIG = {
  'very-easy': { initInterval: 900 },
  'easy':      { initInterval: 600 },
  'medium':    { initInterval: 400 },
  'hard':      { initInterval: 250 },
  'very-hard': { initInterval: 160 },
  'ultimate':  { initInterval: 80  },
}

const COLS = 10
const ROWS = 20

const PIECES = [
  { color: 1, rotations: [
    [0,0,0,0, 1,1,1,1, 0,0,0,0, 0,0,0,0],
    [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
    [0,0,0,0, 0,0,0,0, 1,1,1,1, 0,0,0,0],
    [0,1,0,0, 0,1,0,0, 0,1,0,0, 0,1,0,0],
  ]},
  { color: 2, rotations: [
    [0,1,1,0, 0,1,1,0, 0,0,0,0, 0,0,0,0],
    [0,1,1,0, 0,1,1,0, 0,0,0,0, 0,0,0,0],
    [0,1,1,0, 0,1,1,0, 0,0,0,0, 0,0,0,0],
    [0,1,1,0, 0,1,1,0, 0,0,0,0, 0,0,0,0],
  ]},
  { color: 3, rotations: [
    [0,1,0,0, 1,1,1,0, 0,0,0,0, 0,0,0,0],
    [0,1,0,0, 0,1,1,0, 0,1,0,0, 0,0,0,0],
    [0,0,0,0, 1,1,1,0, 0,1,0,0, 0,0,0,0],
    [0,1,0,0, 1,1,0,0, 0,1,0,0, 0,0,0,0],
  ]},
  { color: 4, rotations: [
    [0,1,1,0, 1,1,0,0, 0,0,0,0, 0,0,0,0],
    [0,1,0,0, 0,1,1,0, 0,0,1,0, 0,0,0,0],
    [0,0,0,0, 0,1,1,0, 1,1,0,0, 0,0,0,0],
    [1,0,0,0, 1,1,0,0, 0,1,0,0, 0,0,0,0],
  ]},
  { color: 5, rotations: [
    [1,1,0,0, 0,1,1,0, 0,0,0,0, 0,0,0,0],
    [0,0,1,0, 0,1,1,0, 0,1,0,0, 0,0,0,0],
    [0,0,0,0, 1,1,0,0, 0,1,1,0, 0,0,0,0],
    [0,1,0,0, 1,1,0,0, 1,0,0,0, 0,0,0,0],
  ]},
  { color: 6, rotations: [
    [1,0,0,0, 1,1,1,0, 0,0,0,0, 0,0,0,0],
    [0,1,1,0, 0,1,0,0, 0,1,0,0, 0,0,0,0],
    [0,0,0,0, 1,1,1,0, 0,0,1,0, 0,0,0,0],
    [0,1,0,0, 0,1,0,0, 1,1,0,0, 0,0,0,0],
  ]},
  { color: 7, rotations: [
    [0,0,1,0, 1,1,1,0, 0,0,0,0, 0,0,0,0],
    [0,1,0,0, 0,1,0,0, 0,1,1,0, 0,0,0,0],
    [0,0,0,0, 1,1,1,0, 1,0,0,0, 0,0,0,0],
    [1,1,0,0, 0,1,0,0, 0,1,0,0, 0,0,0,0],
  ]},
]

const COLORS = ['transparent','#00bcd4','#ffeb3b','#9c27b0','#4caf50','#f44336','#2196f3','#ff9800']

function emptyBoard() {
  return new Array(COLS * ROWS).fill(0)
}

function randomType() {
  return Math.floor(Math.random() * PIECES.length)
}

function isValid(board, type, rot, px, py) {
  const mask = PIECES[type].rotations[rot]
  for (let i = 0; i < 16; i++) {
    if (!mask[i]) continue
    const r = py + Math.floor(i / 4)
    const c = px + (i % 4)
    if (c < 0 || c >= COLS || r >= ROWS) return false
    if (r >= 0 && board[r * COLS + c]) return false
  }
  return true
}

function lockPiece(board, type, rot, px, py) {
  const next = [...board]
  const mask = PIECES[type].rotations[rot]
  const colorIdx = PIECES[type].color
  for (let i = 0; i < 16; i++) {
    if (!mask[i]) continue
    const r = py + Math.floor(i / 4)
    const c = px + (i % 4)
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      next[r * COLS + c] = colorIdx
    }
  }
  return next
}

function clearLines(board) {
  const rows = []
  for (let r = 0; r < ROWS; r++) {
    const row = board.slice(r * COLS, r * COLS + COLS)
    if (row.every(v => v !== 0)) continue
    rows.push(row)
  }
  const cleared = ROWS - rows.length
  while (rows.length < ROWS) rows.unshift(new Array(COLS).fill(0))
  return { newBoard: rows.flat(), cleared }
}

function getGhostY(board, type, rot, px, py) {
  let gy = py
  while (isValid(board, type, rot, px, gy + 1)) gy++
  return gy
}

function scoreForLines(cleared, level) {
  const pts = [0, 100, 300, 500, 800]
  return pts[Math.min(cleared, 4)] * (level + 1)
}

function getPieceCells(type, rot, px, py) {
  const mask = PIECES[type].rotations[rot]
  const cells = []
  for (let i = 0; i < 16; i++) {
    if (!mask[i]) continue
    const r = py + Math.floor(i / 4)
    const c = px + (i % 4)
    cells.push([r, c])
  }
  return cells
}

export default function Tetris() {
  const [difficulty, setDifficulty] = useState('medium')
  const [board, setBoard]       = useState(emptyBoard)
  const [piece, setPiece]       = useState(null)
  const [nextType, setNextType] = useState(() => randomType())
  const [score, setScore]       = useState(0)
  const [lines, setLines]       = useState(0)
  const [level, setLevel]       = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused]     = useState(false)
  const [started, setStarted]   = useState(false)

  const stateRef = useRef({})
  stateRef.current = { board, piece, nextType, score, lines, level, gameOver, paused, started }

  const intervalRef = useRef(null)

  const spawnNext = useCallback((brd, nxt) => {
    const type = nxt
    const newNext = randomType()
    const p = { type, rot: 0, x: 3, y: 0 }
    if (!isValid(brd, p.type, p.rot, p.x, p.y)) {
      setGameOver(true)
      setPiece(null)
      return
    }
    setPiece(p)
    setNextType(newNext)
  }, [])

  const tick = useCallback(() => {
    const { board: brd, piece: pc, nextType: nxt, score: sc, lines: ln, level: lv, gameOver: go, paused: ps } = stateRef.current
    if (go || ps || !pc) return

    if (isValid(brd, pc.type, pc.rot, pc.x, pc.y + 1)) {
      setPiece(p => ({ ...p, y: p.y + 1 }))
    } else {
      const locked = lockPiece(brd, pc.type, pc.rot, pc.x, pc.y)
      const { newBoard, cleared } = clearLines(locked)
      const newScore = sc + scoreForLines(cleared, lv)
      const newLines = ln + cleared
      const newLevel = Math.floor(newLines / 10)
      setBoard(newBoard)
      setScore(newScore)
      setLines(newLines)
      setLevel(newLevel)
      spawnNext(newBoard, nxt)
    }
  }, [spawnNext])

  useEffect(() => {
    if (!started || gameOver || paused) {
      clearInterval(intervalRef.current)
      return
    }
    const speed = Math.max(100, DIFF_CONFIG[difficulty].initInterval - level * 70)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(tick, speed)
    return () => clearInterval(intervalRef.current)
  }, [started, gameOver, paused, level, tick, difficulty])

  useEffect(() => {
    function onKey(e) {
      const { board: brd, piece: pc, nextType: nxt, score: sc, level: lv, gameOver: go, paused: ps, started: st } = stateRef.current
      if (!st || go) return

      if (e.key === 'p' || e.key === 'P') {
        setPaused(p => !p)
        return
      }
      if (ps || !pc) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (isValid(brd, pc.type, pc.rot, pc.x - 1, pc.y)) setPiece(p => ({ ...p, x: p.x - 1 }))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (isValid(brd, pc.type, pc.rot, pc.x + 1, pc.y)) setPiece(p => ({ ...p, x: p.x + 1 }))
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (isValid(brd, pc.type, pc.rot, pc.x, pc.y + 1)) {
          setPiece(p => ({ ...p, y: p.y + 1 }))
          setScore(s => s + 1)
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const newRot = (pc.rot + 1) % 4
        if (isValid(brd, pc.type, newRot, pc.x, pc.y)) {
          setPiece(p => ({ ...p, rot: newRot }))
        } else if (isValid(brd, pc.type, newRot, pc.x - 1, pc.y)) {
          setPiece(p => ({ ...p, rot: newRot, x: p.x - 1 }))
        } else if (isValid(brd, pc.type, newRot, pc.x + 1, pc.y)) {
          setPiece(p => ({ ...p, rot: newRot, x: p.x + 1 }))
        }
      } else if (e.key === ' ') {
        e.preventDefault()
        const ghostY = getGhostY(brd, pc.type, pc.rot, pc.x, pc.y)
        const dropped = ghostY - pc.y
        const locked = lockPiece(brd, pc.type, pc.rot, pc.x, ghostY)
        const { newBoard, cleared } = clearLines(locked)
        const newScore = sc + dropped * 2 + scoreForLines(cleared, lv)
        const newLines = stateRef.current.lines + cleared
        const newLevel = Math.floor(newLines / 10)
        setBoard(newBoard)
        setScore(newScore)
        setLines(newLines)
        setLevel(newLevel)
        spawnNext(newBoard, nxt)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [spawnNext])

  function startGame() {
    const brd = emptyBoard()
    const nt = randomType()
    setBoard(brd)
    setScore(0)
    setLines(0)
    setLevel(0)
    setGameOver(false)
    setPaused(false)
    setNextType(randomType())
    setStarted(true)
    const p = { type: nt, rot: 0, x: 3, y: 0 }
    setPiece(p)
    setNextType(randomType())
  }

  const activeCells = piece ? new Map(getPieceCells(piece.type, piece.rot, piece.x, piece.y).map(([r, c]) => [`${r},${c}`, PIECES[piece.type].color])) : new Map()
  const ghostY = piece ? getGhostY(board, piece.type, piece.rot, piece.x, piece.y) : 0
  const ghostCells = piece ? new Set(getPieceCells(piece.type, piece.rot, piece.x, ghostY).filter(([r, c]) => !activeCells.has(`${r},${c}`)).map(([r, c]) => `${r},${c}`)) : new Set()

  const nextMask = PIECES[nextType].rotations[0]

  return (
    <div className="tetris-page">
      <Breadcrumb />
      <h1 className="tetris-title">TETRIS</h1>
      <HowToPlay steps={HOW_TO_PLAY} />

      <div className="tetris-layout">
        <div className="tetris-board-wrap">
          <div className="tetris-board">
            {board.map((val, idx) => {
              const r = Math.floor(idx / COLS)
              const c = idx % COLS
              const key = `${r},${c}`
              const activeColor = activeCells.get(key)
              const isGhost = ghostCells.has(key)
              const colorIdx = activeColor ?? val
              return (
                <div
                  key={idx}
                  className={`tetris-cell ${isGhost ? 'tetris-cell--ghost' : ''}`}
                  style={colorIdx ? { background: COLORS[colorIdx], boxShadow: `inset 0 0 6px rgba(255,255,255,0.2)` } : {}}
                />
              )
            })}
          </div>

          {(!started || gameOver || paused) && (
            <div className="tetris-overlay">
              {!started && (
                <>
                  <p className="overlay-title">TETRIS</p>
                  <DifficultySelector value={difficulty} onChange={(d) => { setDifficulty(d) }} />
                  <button className="overlay-btn" onClick={startGame}>PRESS START</button>
                </>
              )}
              {started && gameOver && (
                <>
                  <p className="overlay-title">GAME OVER</p>
                  <p className="overlay-sub">Score: {score}</p>
                  <DifficultySelector value={difficulty} onChange={(d) => { setDifficulty(d) }} />
                  <button className="overlay-btn" onClick={startGame}>PLAY AGAIN</button>
                </>
              )}
              {started && paused && !gameOver && (
                <>
                  <p className="overlay-title">PAUSED</p>
                  <button className="overlay-btn" onClick={() => setPaused(false)}>RESUME</button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="tetris-sidebar">
          <div className="tetris-panel">
            <p className="panel-label">SCORE</p>
            <p className="panel-value">{score}</p>
          </div>
          <div className="tetris-panel">
            <p className="panel-label">LINES</p>
            <p className="panel-value">{lines}</p>
          </div>
          <div className="tetris-panel">
            <p className="panel-label">LEVEL</p>
            <p className="panel-value">{level}</p>
          </div>

          <div className="tetris-panel tetris-next">
            <p className="panel-label">NEXT</p>
            <div className="next-grid">
              {nextMask.map((v, i) => (
                <div
                  key={i}
                  className="next-cell"
                  style={v ? { background: COLORS[PIECES[nextType].color] } : {}}
                />
              ))}
            </div>
          </div>

          <div className="tetris-panel tetris-controls">
            <p className="panel-label">CONTROLS</p>
            <p className="ctrl-line">← → &nbsp;Move</p>
            <p className="ctrl-line">↑ &nbsp;&nbsp;&nbsp;Rotate</p>
            <p className="ctrl-line">↓ &nbsp;&nbsp;&nbsp;Soft drop</p>
            <p className="ctrl-line">SPC &nbsp;Hard drop</p>
            <p className="ctrl-line">P &nbsp;&nbsp;&nbsp;Pause</p>
          </div>
        </div>
      </div>
    </div>
  )
}
