import { useState, useEffect, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './Sudoku.css'

const HOW_TO_PLAY = [
  'Fill every empty cell with a digit from 1 to 9.',
  'Each row (left to right) must contain each digit exactly once.',
  'Each column (top to bottom) must contain each digit exactly once.',
  'Each of the nine 3×3 boxes must also contain each digit exactly once.',
  'Cells with a light background are pre-filled — you cannot change those.',
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function isValidPlacement(grid, r, c, n) {
  for (let i = 0; i < 9; i++) {
    if (grid[r][i] === n) return false
    if (grid[i][c] === n) return false
  }
  const br = Math.floor(r / 3) * 3
  const bc = Math.floor(c / 3) * 3
  for (let i = br; i < br + 3; i++)
    for (let j = bc; j < bc + 3; j++)
      if (grid[i][j] === n) return false
  return true
}

function fillGridRandomly(grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        for (const n of shuffle([1,2,3,4,5,6,7,8,9])) {
          if (isValidPlacement(grid, r, c, n)) {
            grid[r][c] = n
            if (fillGridRandomly(grid)) return true
            grid[r][c] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

function generateCompleteGrid() {
  const grid = Array(9).fill(null).map(() => Array(9).fill(0))
  fillGridRandomly(grid)
  return grid
}

function findNextEmpty(grid) {
  let best = null, bestCount = 10
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        let count = 0
        for (let n = 1; n <= 9; n++) if (isValidPlacement(grid, r, c, n)) count++
        if (count === 0) return [r, c]
        if (count < bestCount) { bestCount = count; best = [r, c] }
      }
    }
  }
  return best
}

function countSolutions(grid, limit = 2) {
  const g = grid.map(r => [...r])
  let count = 0
  function solve() {
    if (count >= limit) return
    const cell = findNextEmpty(g)
    if (!cell) { count++; return }
    const [r, c] = cell
    for (let n = 1; n <= 9; n++) {
      if (isValidPlacement(g, r, c, n)) {
        g[r][c] = n
        solve()
        g[r][c] = 0
      }
    }
  }
  solve()
  return count
}

const DIFF_CONFIG = {
  'very-easy': { clues: 46 },
  'easy':      { clues: 40 },
  'medium':    { clues: 33 },
  'hard':      { clues: 27 },
  'very-hard': { clues: 22 },
  'ultimate':  { clues: 17 },
}

function generatePuzzle(difficulty) {
  const solution = generateCompleteGrid()
  const puzzle = solution.map(r => [...r])
  const toRemove = 81 - DIFF_CONFIG[difficulty].clues
  const positions = shuffle(Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9]))
  let removed = 0
  for (const [r, c] of positions) {
    if (removed >= toRemove) break
    const backup = puzzle[r][c]
    puzzle[r][c] = 0
    if (countSolutions(puzzle) === 1) { removed++ }
    else { puzzle[r][c] = backup }
  }
  return { puzzle, solution }
}

function hasConflict(grid, row, col) {
  const val = grid[row][col]
  if (!val) return false
  for (let c = 0; c < 9; c++) if (c !== col && grid[row][c] === val) return true
  for (let r = 0; r < 9; r++) if (r !== row && grid[r][col] === val) return true
  const br = Math.floor(row / 3) * 3
  const bc = Math.floor(col / 3) * 3
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      if ((r !== row || c !== col) && grid[r][c] === val) return true
  return false
}

function isComplete(grid) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (!grid[r][c] || hasConflict(grid, r, c)) return false
  return true
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

export default function Sudoku() {
  const [difficulty, setDifficulty] = useState('medium')
  const [generating, setGenerating] = useState(false)
  const [grid, setGrid]             = useState(null)
  const [solution, setSolution]     = useState(null)
  const [given, setGiven]           = useState(null)
  const [selected, setSelected]     = useState(null)
  const [seconds, setSeconds]       = useState(0)
  const [won, setWon]               = useState(false)
  const [hintsLeft, setHintsLeft]   = useState(3)
  const [gameKey, setGameKey]       = useState(0)

  function startGame(diff) {
    setGenerating(true)
    setGrid(null)
    setSolution(null)
    setGiven(null)
    setSelected(null)
    setSeconds(0)
    setWon(false)
    setHintsLeft(3)
    setGameKey(k => k + 1)
    setTimeout(() => {
      const { puzzle, solution: sol } = generatePuzzle(diff)
      setGrid(puzzle.map(r => [...r]))
      setSolution(sol)
      setGiven(puzzle.map(r => r.map(v => v !== 0)))
      setGenerating(false)
    }, 30)
  }

  useEffect(() => {
    startGame(difficulty)
  }, [])

  const fillCell = useCallback((r, c, value) => {
    setGrid(prev => {
      if (!prev) return prev
      const next = prev.map(row => [...row])
      next[r][c] = value
      if (isComplete(next)) setWon(true)
      return next
    })
  }, [])

  useEffect(() => {
    if (!grid || generating || won) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [gameKey, won, generating])

  useEffect(() => {
    if (!selected || !given || won || generating) return
    const [r, c] = selected
    function onKey(e) {
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        if (!given[r][c]) fillCell(r, c, +e.key)
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        if (!given[r][c]) fillCell(r, c, 0)
      } else if (e.key === 'ArrowUp')    { e.preventDefault(); setSelected([Math.max(0, r - 1), c]) }
        else if (e.key === 'ArrowDown')  { e.preventDefault(); setSelected([Math.min(8, r + 1), c]) }
        else if (e.key === 'ArrowLeft')  { e.preventDefault(); setSelected([r, Math.max(0, c - 1)]) }
        else if (e.key === 'ArrowRight') { e.preventDefault(); setSelected([r, Math.min(8, c + 1)]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, given, won, generating, fillCell])

  function giveHint() {
    if (!selected || hintsLeft <= 0 || won || !solution) return
    const [r, c] = selected
    if (!given || given[r][c] || grid[r][c] !== 0) return
    fillCell(r, c, solution[r][c])
    setHintsLeft(h => h - 1)
  }

  if (generating) {
    return (
      <div className="sudoku-page">
        <Breadcrumb />
        <h1>Sudoku</h1>
        <p className="sudoku-generating">Generating puzzle…</p>
      </div>
    )
  }

  const [selRow, selCol] = selected ?? [-1, -1]
  const selVal = selRow >= 0 ? grid[selRow][selCol] : 0

  return (
    <div className="sudoku-page">
      <Breadcrumb />
      <h1>Sudoku</h1>

      <DifficultySelector
        value={difficulty}
        onChange={(d) => { setDifficulty(d); startGame(d) }}
      />
      <HowToPlay steps={HOW_TO_PLAY} />

      {won && (
        <div className="sudoku-won-banner">
          🎉 Solved in {formatTime(seconds)}!
          <button className="sudoku-next-btn" onClick={() => startGame(difficulty)}>New Puzzle →</button>
        </div>
      )}

      <div className="sudoku-topbar">
        <span className={`sudoku-badge sudoku-badge--${difficulty}`}>{difficulty.replace('-', ' ')}</span>
        <span className="sudoku-timer">{formatTime(seconds)}</span>
      </div>

      {grid && (
        <div className="sudoku-grid" tabIndex={0} onFocus={() => {}}>
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isGiven  = given[r][c]
              const isSel    = r === selRow && c === selCol
              const conflict = !isGiven && hasConflict(grid, r, c)
              const sameGroup = selRow >= 0 && !isSel && (
                r === selRow || c === selCol ||
                (Math.floor(r / 3) === Math.floor(selRow / 3) && Math.floor(c / 3) === Math.floor(selCol / 3))
              )
              const sameNum = selVal > 0 && val === selVal && !isSel

              const cls = ['sudoku-cell',
                isGiven    ? 'sudoku-cell--given'    : 'sudoku-cell--editable',
                isSel      ? 'sudoku-cell--selected' : '',
                conflict   ? 'sudoku-cell--error'    : '',
                sameGroup  ? 'sudoku-cell--group'    : '',
                sameNum    ? 'sudoku-cell--same-num' : '',
                (c === 2 || c === 5) ? 'sudoku-cell--thick-right'  : '',
                (r === 2 || r === 5) ? 'sudoku-cell--thick-bottom' : '',
              ].filter(Boolean).join(' ')

              return (
                <div key={`${r}-${c}`} className={cls}
                  onClick={() => !won && setSelected([r, c])}>
                  {val !== 0 ? val : ''}
                </div>
              )
            })
          )}
        </div>
      )}

      <div className="sudoku-controls">
        <div className="sudoku-numpad">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} className="sudoku-num-btn"
              onClick={() => {
                if (selected && given && !given[selRow][selCol]) fillCell(selRow, selCol, n)
              }}>
              {n}
            </button>
          ))}
          <button className="sudoku-num-btn sudoku-erase-btn"
            onClick={() => {
              if (selected && given && !given[selRow][selCol]) fillCell(selRow, selCol, 0)
            }}>
            ⌫
          </button>
        </div>

        <div className="sudoku-actions">
          <button className="sudoku-action-btn" onClick={() => startGame(difficulty)}>New Game</button>
          <button className="sudoku-action-btn sudoku-hint-btn"
            disabled={hintsLeft === 0 || !selected || (selected && given?.[selRow]?.[selCol])}
            onClick={giveHint}>
            Hint ({hintsLeft})
          </button>
        </div>
      </div>
    </div>
  )
}
