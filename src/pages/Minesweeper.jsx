import { useState, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './Minesweeper.css'

const HOW_TO_PLAY = [
  'Click any cell to reveal it.',
  'Numbers tell you how many mines are touching that cell (including diagonals).',
  'Right-click (or long-press on mobile) to plant a flag on a cell you think is a mine.',
  "Reveal all safe cells without clicking a mine to win!",
  'Tip: start by clicking somewhere in the middle — the first click is always safe.',
]

const DIFF_CONFIG = {
  'very-easy': { rows: 8,  cols: 8,  mines: 5   },
  'easy':      { rows: 9,  cols: 9,  mines: 10  },
  'medium':    { rows: 16, cols: 16, mines: 40  },
  'hard':      { rows: 16, cols: 30, mines: 99  },
  'very-hard': { rows: 20, cols: 30, mines: 145 },
  'ultimate':  { rows: 24, cols: 30, mines: 200 },
}

function buildBoard(rows, cols, mines, firstR, firstC) {
  const safe = new Set()
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      const r = firstR + dr, c = firstC + dc
      if (r >= 0 && r < rows && c >= 0 && c < cols) safe.add(r * cols + c)
    }

  const allIdx = Array.from({ length: rows * cols }, (_, i) => i).filter(i => !safe.has(i))
  const mineSet = new Set()
  while (mineSet.size < Math.min(mines, allIdx.length)) {
    mineSet.add(allIdx[Math.floor(Math.random() * allIdx.length)])
  }

  return Array.from({ length: rows * cols }, (_, idx) => ({
    mine: mineSet.has(idx),
    revealed: false,
    flagged: false,
    adj: 0,
  })).map((cell, idx, arr) => {
    if (!cell.mine) {
      const r = Math.floor(idx / cols), c = idx % cols
      let count = 0
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && arr[nr * cols + nc].mine) count++
        }
      return { ...cell, adj: count }
    }
    return cell
  })
}

function flood(board, rows, cols, startIdx) {
  const next = [...board]
  const queue = [startIdx]
  const visited = new Set([startIdx])
  while (queue.length) {
    const idx = queue.shift()
    next[idx] = { ...next[idx], revealed: true }
    if (next[idx].adj === 0) {
      const r = Math.floor(idx / cols), c = idx % cols
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const ni = nr * cols + nc
            if (!visited.has(ni) && !next[ni].mine && !next[ni].flagged) {
              visited.add(ni)
              queue.push(ni)
            }
          }
        }
    }
  }
  return next
}

const ADJ_COLORS = ['', '#2196f3', '#4caf50', '#f44336', '#9c27b0', '#ff5722', '#00bcd4', '#e91e63', '#607d8b']

export default function Minesweeper() {
  const [diff, setDiff]       = useState('medium')
  const [board, setBoard]     = useState(null)
  const [phase, setPhase]     = useState('idle') // idle | playing | won | lost
  const [minesLeft, setMinesLeft] = useState(DIFF_CONFIG['medium'].mines)
  const [time, setTime]       = useState(0)
  const [timerRef, setTimerRef] = useState(null)

  const { rows, cols, mines } = DIFF_CONFIG[diff]

  function stopTimer(ref) {
    if (ref) clearInterval(ref)
  }

  const startTimer = useCallback(() => {
    setTime(0)
    const ref = setInterval(() => setTime(t => t + 1), 1000)
    setTimerRef(ref)
    return ref
  }, [])

  function reset() {
    stopTimer(timerRef)
    setBoard(null)
    setPhase('idle')
    setMinesLeft(DIFF_CONFIG[diff].mines)
    setTime(0)
  }

  function changeDiff(d) {
    stopTimer(timerRef)
    setDiff(d)
    setBoard(null)
    setPhase('idle')
    setMinesLeft(DIFF_CONFIG[d].mines)
    setTime(0)
  }

  function handleReveal(idx) {
    if (phase === 'won' || phase === 'lost') return
    const r = Math.floor(idx / cols), c = idx % cols

    let currentBoard = board
    let ref = timerRef
    if (!currentBoard) {
      currentBoard = buildBoard(rows, cols, mines, r, c)
      const newRef = startTimer()
      ref = newRef
      setTimerRef(newRef)
      setPhase('playing')
    }

    const cell = currentBoard[idx]
    if (cell.revealed || cell.flagged) return

    if (cell.mine) {
      stopTimer(ref)
      const next = currentBoard.map((c, i) =>
        i === idx ? { ...c, revealed: true, exploded: true } : { ...c, revealed: c.mine ? true : c.revealed }
      )
      setBoard(next)
      setPhase('lost')
      return
    }

    const next = flood(currentBoard, rows, cols, idx)
    const won = next.every(c => c.mine || c.revealed)
    if (won) {
      stopTimer(ref)
      setPhase('won')
    }
    setBoard(next)
  }

  function handleFlag(e, idx) {
    e.preventDefault()
    if (phase === 'won' || phase === 'lost' || !board) return
    const cell = board[idx]
    if (cell.revealed) return
    const next = [...board]
    next[idx] = { ...cell, flagged: !cell.flagged }
    setBoard(next)
    setMinesLeft(m => cell.flagged ? m + 1 : m - 1)
  }

  function cellContent(cell) {
    if (!cell.revealed) return cell.flagged ? '🚩' : ''
    if (cell.mine) return cell.exploded ? '💥' : '💣'
    return cell.adj > 0 ? cell.adj : ''
  }

  return (
    <div className="ms-page">
      <Breadcrumb />
      <h1 className="ms-title">MINESWEEPER</h1>
      <HowToPlay steps={HOW_TO_PLAY} />

      {phase === 'idle' && (
        <DifficultySelector value={diff} onChange={(d) => { changeDiff(d) }} />
      )}

      <div className="ms-statusbar">
        <span className="ms-stat">💣 {minesLeft}</span>
        <button className="ms-reset-btn" onClick={reset}>
          {phase === 'won' ? '😎' : phase === 'lost' ? '😵' : '🙂'}
        </button>
        <span className="ms-stat">⏱ {String(time).padStart(3, '0')}</span>
      </div>

      <div
        className="ms-board"
        style={{ gridTemplateColumns: `repeat(${cols}, 28px)` }}
      >
        {(board ? board : Array.from({ length: rows * cols }, () => ({ revealed: false, flagged: false, mine: false, adj: 0 }))).map((cell, idx) => (
          <button
            key={idx}
            className={`ms-cell ${cell.revealed ? 'ms-cell--revealed' : 'ms-cell--hidden'} ${cell.exploded ? 'ms-cell--exploded' : ''} ${phase === 'won' && cell.mine ? 'ms-cell--flagged-win' : ''}`}
            style={cell.revealed && !cell.mine && cell.adj > 0 ? { color: ADJ_COLORS[cell.adj] } : {}}
            onClick={() => handleReveal(idx)}
            onContextMenu={e => handleFlag(e, idx)}
          >
            {cellContent(cell)}
          </button>
        ))}
      </div>

      {(phase === 'won' || phase === 'lost') && (
        <div className="ms-result">
          {phase === 'won'
            ? <span className="ms-result--win">YOU WIN! Time: {time}s</span>
            : <span className="ms-result--lose">BOOM! Better luck next time.</span>
          }
          <button className="ms-new-btn" onClick={reset}>[ NEW GAME ]</button>
        </div>
      )}

      <p className="ms-tip">Left-click: reveal · Right-click: flag</p>
    </div>
  )
}
