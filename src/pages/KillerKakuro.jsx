import { useState, useEffect, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './KillerKakuro.css'

const HOW_TO_PLAY = [
  'Fill every cell in the 9×9 grid with a digit from 1 to 9.',
  'Each row and each column must contain each digit exactly once (Sudoku rules).',
  'Each colored cage must contain digits that add up to the number shown in its corner.',
  'No digit can repeat within the same cage.',
  'Use both the cage sums and the row/column rules together to solve it!',
]

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

function isValidPlacement(grid, r, c, n, size) {
  for (let i = 0; i < size; i++) {
    if (grid[r][i] === n) return false
    if (grid[i][c] === n) return false
  }
  const boxSize = Math.floor(Math.sqrt(size))
  const br = Math.floor(r / boxSize) * boxSize
  const bc = Math.floor(c / boxSize) * boxSize
  for (let i = br; i < br + boxSize; i++)
    for (let j = bc; j < bc + boxSize; j++)
      if (grid[i][j] === n) return false
  return true
}

function fillGridRandomly(grid, size) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) {
        const nums = shuffle(Array.from({ length: size }, (_, i) => i + 1))
        for (const n of nums) {
          if (isValidPlacement(grid, r, c, n, size)) {
            grid[r][c] = n
            if (fillGridRandomly(grid, size)) return true
            grid[r][c] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

function generateCompleteGrid(size) {
  const grid = Array(size).fill(null).map(() => Array(size).fill(0))
  fillGridRandomly(grid, size)
  return grid
}

function generateCages(solution, size, maxCageSize) {
  const assigned = Array(size).fill(null).map(() => Array(size).fill(-1))
  const cages = []
  const allCells = shuffle(Array.from({ length: size * size }, (_, i) => [Math.floor(i / size), i % size]))

  for (const [startR, startC] of allCells) {
    if (assigned[startR][startC] >= 0) continue
    const cageId = cages.length
    const minSize = 1
    const targetSize = minSize + Math.floor(Math.random() * (maxCageSize - minSize + 1))
    const cells = [[startR, startC]]
    assigned[startR][startC] = cageId

    while (cells.length < targetSize) {
      const candidates = []
      for (const [r, c] of cells) {
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < size && nc >= 0 && nc < size && assigned[nr][nc] < 0)
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

function getCageBorders(assigned, r, c, size) {
  const id = assigned[r][c]
  return {
    top:    r === 0 || assigned[r-1][c] !== id,
    bottom: r === size - 1 || assigned[r+1][c] !== id,
    left:   c === 0 || assigned[r][c-1] !== id,
    right:  c === size - 1 || assigned[r][c+1] !== id,
  }
}

function hasConflict(grid, row, col, size) {
  const val = grid[row][col]
  if (!val) return false
  for (let c = 0; c < size; c++) if (c !== col && grid[row][c] === val) return true
  for (let r = 0; r < size; r++) if (r !== row && grid[r][col] === val) return true
  const boxSize = Math.floor(Math.sqrt(size))
  const br = Math.floor(row / boxSize) * boxSize
  const bc = Math.floor(col / boxSize) * boxSize
  for (let r = br; r < br + boxSize; r++)
    for (let c = bc; c < bc + boxSize; c++)
      if ((r !== row || c !== col) && grid[r][c] === val) return true
  return false
}

function isComplete(grid, solution, size) {
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (grid[r][c] !== solution[r][c]) return false
  return true
}

const DIFF_CONFIG = {
  'very-easy': { size: 4, maxCageSize: 3 },
  'easy':      { size: 5, maxCageSize: 4 },
  'medium':    { size: 6, maxCageSize: 5 },
  'hard':      { size: 7, maxCageSize: 6 },
  'very-hard': { size: 8, maxCageSize: 7 },
  'ultimate':  { size: 9, maxCageSize: 8 },
}

function generateGame(difficulty) {
  const { size, maxCageSize } = DIFF_CONFIG[difficulty]
  const solution = generateCompleteGrid(size)
  const { cages, assigned } = generateCages(solution, size, maxCageSize)
  const leaderMap = {}
  for (const cage of cages) {
    const [lr, lc] = cageLeader(cage.cells)
    leaderMap[`${lr},${lc}`] = cage.sum
  }
  return { solution, cages, assigned, leaderMap, size }
}

export default function KillerKakuro() {
  const [difficulty, setDifficulty] = useState('medium')
  const [generating, setGenerating] = useState(false)
  const [solution, setSolution]     = useState(null)
  const [assigned, setAssigned]     = useState(null)
  const [leaderMap, setLeaderMap]   = useState(null)
  const [gridSize, setGridSize]     = useState(DIFF_CONFIG['medium'].size)
  const [userGrid, setUserGrid]     = useState(null)
  const [selected, setSelected]     = useState(null)
  const [seconds, setSeconds]       = useState(0)
  const [won, setWon]               = useState(false)
  const [hintsLeft, setHintsLeft]   = useState(3)
  const [gameKey, setGameKey]       = useState(0)

  function startGame(diff) {
    setGenerating(true)
    setSolution(null); setAssigned(null); setLeaderMap(null)
    setUserGrid(null); setSelected(null)
    setSeconds(0); setWon(false); setHintsLeft(3)
    setGameKey(k => k + 1)
    setTimeout(() => {
      const { solution: sol, assigned: asgn, leaderMap: lm, size } = generateGame(diff)
      setSolution(sol)
      setAssigned(asgn)
      setLeaderMap(lm)
      setGridSize(size)
      setUserGrid(Array(size).fill(null).map(() => Array(size).fill(0)))
      setGenerating(false)
    }, 30)
  }

  useEffect(() => {
    startGame(difficulty)
  }, [])

  const fillCell = useCallback((r, c, value) => {
    setUserGrid(prev => {
      const next = prev.map(row => [...row])
      next[r][c] = value
      if (solution && isComplete(next, solution, gridSize)) setWon(true)
      return next
    })
  }, [solution, gridSize])

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
        else if (e.key === 'ArrowDown')  { e.preventDefault(); setSelected([Math.min(gridSize-1, r+1), c]) }
        else if (e.key === 'ArrowLeft')  { e.preventDefault(); setSelected([r, Math.max(0, c-1)]) }
        else if (e.key === 'ArrowRight') { e.preventDefault(); setSelected([r, Math.min(gridSize-1, c+1)]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, solution, won, generating, fillCell, gridSize])

  function giveHint() {
    if (!selected || hintsLeft <= 0 || won || !solution) return
    const [r, c] = selected
    if (userGrid[r][c] === solution[r][c]) return
    fillCell(r, c, solution[r][c])
    setHintsLeft(h => h - 1)
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

  const boxSize = Math.floor(Math.sqrt(gridSize))
  const cellPx = gridSize <= 4 ? 68 : gridSize <= 6 ? 58 : gridSize <= 7 ? 52 : gridSize <= 8 ? 46 : 42

  return (
    <div className="kk2-page">
      <Breadcrumb />
      <h1>Killer Kakuro</h1>
      <p className="kk2-subtitle">
        Fill the grid (Sudoku rules) so digits within each cage are distinct and sum to the cage clue.
      </p>

      <DifficultySelector
        value={difficulty}
        onChange={(d) => { setDifficulty(d); startGame(d) }}
      />
      <HowToPlay steps={HOW_TO_PLAY} />

      <div className="kk2-topbar">
        <span className={`kk2-badge kk2-badge--${difficulty}`}>{difficulty.replace('-', ' ')}</span>
        <span className="kk2-timer">{formatTime(seconds)}</span>
      </div>

      {won && (
        <div className="kk2-won-banner">
          🎉 Solved in {formatTime(seconds)}!
          <button className="kk2-next-btn" onClick={() => startGame(difficulty)}>New Puzzle →</button>
        </div>
      )}

      {userGrid && assigned && (
        <div
          className="kk2-grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${cellPx}px)`,
            gridTemplateRows: `repeat(${gridSize}, ${cellPx}px)`,
          }}
        >
          {userGrid.map((row, r) =>
            row.map((val, c) => {
              const isSel     = r === selRow && c === selCol
              const conflict  = val > 0 && hasConflict(userGrid, r, c, gridSize)
              const sameGroup = selRow >= 0 && !isSel && (
                r === selRow || c === selCol ||
                (Math.floor(r/boxSize) === Math.floor(selRow/boxSize) && Math.floor(c/boxSize) === Math.floor(selCol/boxSize))
              )
              const sameNum  = selVal > 0 && val === selVal && !isSel
              const borders  = getCageBorders(assigned, r, c, gridSize)
              const leaderSum = leaderMap[`${r},${c}`]

              const borderStyle = {
                borderTop:    borders.top    ? '1.5px solid rgba(255,255,255,0.75)' : '1px solid transparent',
                borderBottom: borders.bottom ? '1.5px solid rgba(255,255,255,0.75)' : '1px solid transparent',
                borderLeft:   borders.left   ? '1.5px solid rgba(255,255,255,0.75)' : '1px solid transparent',
                borderRight:  borders.right  ? '1.5px solid rgba(255,255,255,0.75)' : '1px solid transparent',
              }
              const thickLines = Array.from({ length: boxSize - 1 }, (_, i) => (i + 1) * boxSize - 1)
              if (thickLines.includes(r)) borderStyle.borderBottom = '2.5px solid rgba(255,255,255,0.5)'
              if (thickLines.includes(c)) borderStyle.borderRight  = '2.5px solid rgba(255,255,255,0.5)'

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
                  style={{ ...borderStyle, width: cellPx, height: cellPx }}
                  onClick={() => !won && setSelected([r, c])}
                >
                  {leaderSum !== undefined && (
                    <span className="kk2-cage-sum" style={{ fontSize: cellPx < 50 ? '0.55rem' : '0.65rem' }}>{leaderSum}</span>
                  )}
                  <span className="kk2-digit" style={{ fontSize: cellPx < 50 ? '0.9rem' : '1.1rem' }}>{val > 0 ? val : ''}</span>
                </div>
              )
            })
          )}
        </div>
      )}

      <div className="kk2-controls">
        <div className="kk2-numpad">
          {Array.from({ length: gridSize }, (_, i) => i + 1).map(n => (
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

      <p className="kk2-tip">Click a cell · Type 1–{gridSize} · Arrow keys to navigate · Backspace to erase</p>
    </div>
  )
}
