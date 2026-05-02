import { useState, useEffect, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './KillerKakuro.css'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function formatTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
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

function generateCages(solution, minSize, maxSize) {
  const assigned = Array(9).fill(null).map(() => Array(9).fill(-1))
  const cages = []
  const allCells = shuffle(Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9]))

  for (const [startR, startC] of allCells) {
    if (assigned[startR][startC] >= 0) continue
    const cageId = cages.length
    const targetSize = minSize + Math.floor(Math.random() * (maxSize - minSize + 1))
    const cells = [[startR, startC]]
    assigned[startR][startC] = cageId

    while (cells.length < targetSize) {
      const candidates = []
      for (const [r, c] of cells) {
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9 && assigned[nr][nc] < 0)
            candidates.push([nr, nc])
        }
      }
      if (!candidates.length) break
      const pick = candidates[Math.floor(Math.random() * candidates.length)]
      assigned[pick[0]][pick[1]] = cageId
      cells.push(pick)
    }

    const sum = cells.reduce((s, [r, c]) => s + solution[r][c], 0)
    cages.push({ id: cageId, cells, sum })
  }

  return { cages, assigned }
}

function cageLeader(cells) {
  return cells.reduce((best, cell) =>
    cell[0] < best[0] || (cell[0] === best[0] && cell[1] < best[1]) ? cell : best
  )
}

function getCageBorders(assigned, r, c) {
  const id = assigned[r][c]
  return {
    top:    r === 0 || assigned[r-1][c] !== id,
    bottom: r === 8 || assigned[r+1][c] !== id,
    left:   c === 0 || assigned[r][c-1] !== id,
    right:  c === 8 || assigned[r][c+1] !== id,
  }
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

function isComplete(grid, solution) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (grid[r][c] !== solution[r][c]) return false
  return true
}

const CAGE_SIZES = {
  easy:        { min: 4, max: 6 },
  medium:      { min: 3, max: 5 },
  hard:        { min: 2, max: 4 },
  'very-hard': { min: 2, max: 3 },
  challenging: { min: 2, max: 3 },
  ultimate:    { min: 2, max: 2 },
}

const DIFFICULTY_LIST = [
  { id: 'easy',        label: 'Easy',        hint: 'Large cages (4–6 cells)'   },
  { id: 'medium',      label: 'Medium',      hint: 'Mixed cages (3–5 cells)'   },
  { id: 'hard',        label: 'Hard',        hint: 'Smaller cages (2–4 cells)' },
  { id: 'very-hard',   label: 'Very Hard',   hint: 'Tight cages (2–3 cells)'   },
  { id: 'challenging', label: 'Challenging', hint: 'Pairs & triples'            },
  { id: 'ultimate',    label: 'Ultimate',    hint: 'Pairs only (2-cell cages)'  },
]

function generateGame(difficulty) {
  const { min, max } = CAGE_SIZES[difficulty]
  const solution = generateCompleteGrid()
  const { cages, assigned } = generateCages(solution, min, max)
  const leaderMap = {}
  for (const cage of cages) {
    const [lr, lc] = cageLeader(cage.cells)
    leaderMap[`${lr},${lc}`] = cage.sum
  }
  return { solution, cages, assigned, leaderMap }
}

export default function KillerKakuro() {
  const [difficulty, setDifficulty] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [solution, setSolution]     = useState(null)
  const [assigned, setAssigned]     = useState(null)
  const [leaderMap, setLeaderMap]   = useState(null)
  const [userGrid, setUserGrid]     = useState(null)
  const [selected, setSelected]     = useState(null)
  const [seconds, setSeconds]       = useState(0)
  const [won, setWon]               = useState(false)
  const [hintsLeft, setHintsLeft]   = useState(3)
  const [gameKey, setGameKey]       = useState(0)

  function startGame(diff) {
    setDifficulty(diff)
    setGenerating(true)
    setSolution(null); setAssigned(null); setLeaderMap(null)
    setUserGrid(null); setSelected(null)
    setSeconds(0); setWon(false); setHintsLeft(3)
    setGameKey(k => k + 1)
    setTimeout(() => {
      const { solution: sol, assigned: asgn, leaderMap: lm } = generateGame(diff)
      setSolution(sol)
      setAssigned(asgn)
      setLeaderMap(lm)
      setUserGrid(Array(9).fill(null).map(() => Array(9).fill(0)))
      setGenerating(false)
    }, 30)
  }

  const fillCell = useCallback((r, c, value) => {
    setUserGrid(prev => {
      const next = prev.map(row => [...row])
      next[r][c] = value
      if (isComplete(next, solution)) setWon(true)
      return next
    })
  }, [solution])

  useEffect(() => {
    if (!solution || generating || won) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [gameKey, solution, generating, won])

  useEffect(() => {
    if (!selected || !solution || won || generating) return
    const [r, c] = selected
    function onKey(e) {
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        fillCell(r, c, +e.key)
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        fillCell(r, c, 0)
      } else if (e.key === 'ArrowUp')    { e.preventDefault(); setSelected([Math.max(0, r-1), c]) }
        else if (e.key === 'ArrowDown')  { e.preventDefault(); setSelected([Math.min(8, r+1), c]) }
        else if (e.key === 'ArrowLeft')  { e.preventDefault(); setSelected([r, Math.max(0, c-1)]) }
        else if (e.key === 'ArrowRight') { e.preventDefault(); setSelected([r, Math.min(8, c+1)]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, solution, won, generating, fillCell])

  function giveHint() {
    if (!selected || hintsLeft <= 0 || won || !solution) return
    const [r, c] = selected
    if (userGrid[r][c] === solution[r][c]) return
    fillCell(r, c, solution[r][c])
    setHintsLeft(h => h - 1)
  }

  if (!difficulty && !generating) {
    return (
      <div className="kk2-page">
        <Breadcrumb />
        <h1>Killer Kakuro</h1>
        <p className="kk2-subtitle">
          Fill the 9×9 grid (Sudoku rules) so digits within each cage are distinct and sum to the cage clue.
        </p>
        <div className="kk2-diff-grid">
          {DIFFICULTY_LIST.map(d => (
            <button key={d.id} className={`kk2-diff-btn kk2-diff-btn--${d.id}`} onClick={() => startGame(d.id)}>
              <span className="kk2-diff-label">{d.label}</span>
              <span className="kk2-diff-hint">{d.hint}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (generating) {
    return (
      <div className="kk2-page">
        <Breadcrumb />
        <h1>Killer Kakuro</h1>
        <p className="kk2-generating">Generating puzzle…</p>
      </div>
    )
  }

  const [selRow, selCol] = selected ?? [-1, -1]
  const selVal = selRow >= 0 ? userGrid[selRow][selCol] : 0

  return (
    <div className="kk2-page">
      <Breadcrumb />

      <div className="kk2-topbar">
        <button className="kk2-back-btn" onClick={() => { setDifficulty(null); setSolution(null) }}>← Back</button>
        <span className={`kk2-badge kk2-badge--${difficulty}`}>
          {DIFFICULTY_LIST.find(d => d.id === difficulty)?.label}
        </span>
        <span className="kk2-timer">{formatTime(seconds)}</span>
      </div>

      {won && (
        <div className="kk2-won-banner">
          🎉 Solved in {formatTime(seconds)}!
          <button className="kk2-next-btn" onClick={() => startGame(difficulty)}>New Puzzle →</button>
        </div>
      )}

      <div className="kk2-grid">
        {userGrid.map((row, r) =>
          row.map((val, c) => {
            const isSel     = r === selRow && c === selCol
            const conflict  = val > 0 && hasConflict(userGrid, r, c)
            const sameGroup = selRow >= 0 && !isSel && (
              r === selRow || c === selCol ||
              (Math.floor(r/3) === Math.floor(selRow/3) && Math.floor(c/3) === Math.floor(selCol/3))
            )
            const sameNum  = selVal > 0 && val === selVal && !isSel
            const borders  = getCageBorders(assigned, r, c)
            const leaderSum = leaderMap[`${r},${c}`]

            const borderStyle = {
              borderTop:    borders.top    ? '1.5px solid rgba(255,255,255,0.75)' : '1px solid transparent',
              borderBottom: borders.bottom ? '1.5px solid rgba(255,255,255,0.75)' : '1px solid transparent',
              borderLeft:   borders.left   ? '1.5px solid rgba(255,255,255,0.75)' : '1px solid transparent',
              borderRight:  borders.right  ? '1.5px solid rgba(255,255,255,0.75)' : '1px solid transparent',
            }
            if (r === 2 || r === 5) borderStyle.borderBottom = '2.5px solid rgba(255,255,255,0.5)'
            if (c === 2 || c === 5) borderStyle.borderRight  = '2.5px solid rgba(255,255,255,0.5)'

            const cls = [
              'kk2-cell',
              isSel     ? 'kk2-cell--selected' : '',
              sameGroup ? 'kk2-cell--group'    : '',
              sameNum   ? 'kk2-cell--same-num' : '',
              conflict  ? 'kk2-cell--error'    : '',
              won       ? 'kk2-cell--won'      : '',
            ].filter(Boolean).join(' ')

            return (
              <div
                key={`${r}-${c}`}
                className={cls}
                style={borderStyle}
                onClick={() => !won && setSelected([r, c])}
              >
                {leaderSum !== undefined && (
                  <span className="kk2-cage-sum">{leaderSum}</span>
                )}
                <span className="kk2-digit">{val > 0 ? val : ''}</span>
              </div>
            )
          })
        )}
      </div>

      <div className="kk2-controls">
        <div className="kk2-numpad">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button
              key={n}
              className="kk2-num-btn"
              onClick={() => { if (selected && !won) fillCell(selRow, selCol, n) }}
            >
              {n}
            </button>
          ))}
          <button
            className="kk2-num-btn kk2-erase-btn"
            onClick={() => { if (selected && !won) fillCell(selRow, selCol, 0) }}
          >
            ⌫
          </button>
        </div>

        <div className="kk2-actions">
          <button className="kk2-action-btn" onClick={() => startGame(difficulty)}>New Game</button>
          <button
            className="kk2-action-btn kk2-hint-btn"
            disabled={hintsLeft === 0 || !selected || won}
            onClick={giveHint}
          >
            Hint ({hintsLeft})
          </button>
        </div>
      </div>

      <p className="kk2-tip">Click a cell · Type 1–9 · Arrow keys to navigate · Backspace to erase</p>
    </div>
  )
}
