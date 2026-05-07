import { useState, useEffect } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './Kakuro.css'

const HOW_TO_PLAY = [
  'Fill each blank white cell with a digit from 1 to 9.',
  'Each group of cells (a run) must add up to the clue number shown in the black triangle.',
  'No digit can repeat within the same run.',
  'Use logic to figure out which digits fit — there is always one solution!',
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function isValidTemplate(grid) {
  const R = grid.length, C = grid[0].length
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] !== 1) continue
      const hasAcross = (c > 0 && grid[r][c-1] === 1) || (c < C-1 && grid[r][c+1] === 1)
      if (!hasAcross) return false
      const hasDown = (r > 0 && grid[r-1][c] === 1) || (r < R-1 && grid[r+1][c] === 1)
      if (!hasDown) return false
    }
  }
  for (let r = 0; r < R; r++) {
    let run = 0
    for (let c = 0; c < C; c++) { if (grid[r][c] === 1) { run++; if (run > 9) return false } else run = 0 }
  }
  for (let c = 0; c < C; c++) {
    let run = 0
    for (let r = 0; r < R; r++) { if (grid[r][c] === 1) { run++; if (run > 9) return false } else run = 0 }
  }
  return true
}

function generateTemplate(size) {
  function make() {
    const grid = Array.from({length: size}, (_, r) =>
      Array.from({length: size}, (_, c) =>
        (r === 0 || r === size - 1 || c === 0 || c === size - 1) ? 0 : 1
      )
    )
    const inner = []
    for (let r = 1; r < size - 1; r++)
      for (let c = 1; c < size - 1; c++)
        inner.push([r, c])
    const target = Math.floor(inner.length * 0.28)
    let added = 0
    for (const [r, c] of shuffle(inner)) {
      if (added >= target) break
      grid[r][c] = 0
      if (isValidTemplate(grid)) added++
      else grid[r][c] = 1
    }
    return grid
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    const t = make()
    if (isValidTemplate(t)) return t
  }
  return make()
}

function fillKakuro(template) {
  const R = template.length, C = template[0].length
  const sol = Array.from({length: R}, () => Array(C).fill(0))

  const whiteCells = []
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (template[r][c] === 1) whiteCells.push([r, c])

  function acrossUsed(r, c) {
    let cc = c
    while (cc > 0 && template[r][cc - 1] === 1) cc--
    const used = new Set()
    while (cc < C && template[r][cc] === 1) { if (sol[r][cc]) used.add(sol[r][cc]); cc++ }
    return used
  }

  function downUsed(r, c) {
    let rr = r
    while (rr > 0 && template[rr - 1][c] === 1) rr--
    const used = new Set()
    while (rr < R && template[rr][c] === 1) { if (sol[rr][c]) used.add(sol[rr][c]); rr++ }
    return used
  }

  function solve(idx) {
    if (idx >= whiteCells.length) return true
    const [r, c] = whiteCells[idx]
    const ua = acrossUsed(r, c), ud = downUsed(r, c)
    for (const d of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
      if (ua.has(d) || ud.has(d)) continue
      sol[r][c] = d
      if (solve(idx + 1)) return true
      sol[r][c] = 0
    }
    return false
  }

  return solve(0) ? sol : null
}

function computeClues(template, solution) {
  const R = template.length, C = template[0].length
  const clues = {}
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (template[r][c] === 1) continue
      if (c + 1 < C && template[r][c + 1] === 1) {
        let sum = 0, cc = c + 1
        while (cc < C && template[r][cc] === 1) { sum += solution[r][cc]; cc++ }
        clues[`a_${r}_${c}`] = sum
      }
      if (r + 1 < R && template[r + 1][c] === 1) {
        let sum = 0, rr = r + 1
        while (rr < R && template[rr][c] === 1) { sum += solution[rr][c]; rr++ }
        clues[`d_${r}_${c}`] = sum
      }
    }
  }
  return clues
}

const DIFF_CONFIG = {
  'very-easy': { size: 4 },
  'easy':      { size: 5 },
  'medium':    { size: 6 },
  'hard':      { size: 7 },
  'very-hard': { size: 8 },
  'ultimate':  { size: 9 },
}

function generateGame(difficulty) {
  const size = DIFF_CONFIG[difficulty].size
  for (let attempt = 0; attempt < 20; attempt++) {
    const template = generateTemplate(size)
    const solution = fillKakuro(template)
    if (solution) {
      const clues = computeClues(template, solution)
      return { template, solution, clues }
    }
  }
  return null
}

function getAcrossRun(template, r, c) {
  let cc = c
  const C = template[0].length
  while (cc > 0 && template[r][cc - 1] === 1) cc--
  const run = []
  while (cc < C && template[r][cc] === 1) { run.push([r, cc]); cc++ }
  return run
}

function getDownRun(template, r, c) {
  let rr = r
  const R = template.length
  while (rr > 0 && template[rr - 1][c] === 1) rr--
  const run = []
  while (rr < R && template[rr][c] === 1) { run.push([rr, c]); rr++ }
  return run
}

function formatTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function Kakuro() {
  const [difficulty, setDifficulty] = useState('medium')
  const [generating, setGenerating] = useState(false)
  const [template, setTemplate]     = useState(null)
  const [solution, setSolution]     = useState(null)
  const [clues, setClues]           = useState(null)
  const [userGrid, setUserGrid]     = useState(null)
  const [selected, setSelected]     = useState(null)
  const [checked, setChecked]       = useState(false)
  const [revealed, setRevealed]     = useState(false)
  const [seconds, setSeconds]       = useState(0)
  const [won, setWon]               = useState(false)
  const [gameKey, setGameKey]       = useState(0)

  function startGame(diff) {
    setGenerating(true)
    setTemplate(null); setSolution(null); setClues(null)
    setUserGrid(null); setSelected(null)
    setChecked(false); setRevealed(false)
    setSeconds(0); setWon(false)
    setGameKey(k => k + 1)
    setTimeout(() => {
      const result = generateGame(diff)
      if (result) {
        const { template: t, solution: s, clues: cl } = result
        setTemplate(t)
        setSolution(s)
        setClues(cl)
        setUserGrid(t.map(row => row.map(cell => cell === 1 ? 0 : null)))
      }
      setGenerating(false)
    }, 30)
  }

  useEffect(() => {
    startGame(difficulty)
  }, [])

  useEffect(() => {
    if (!template || generating || won) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [gameKey, template, generating, won])

  useEffect(() => {
    if (!selected || !template || won || generating) return
    const [r, c] = selected
    function onKey(e) {
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        const d = +e.key
        setUserGrid(prev => {
          const next = prev.map(row => [...row])
          next[r][c] = d
          return next
        })
        setChecked(false)
        const C = template[0].length
        if (c + 1 < C && template[r][c + 1] === 1) setSelected([r, c + 1])
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        setUserGrid(prev => {
          const next = prev.map(row => [...row])
          next[r][c] = 0
          return next
        })
        setChecked(false)
      } else if (e.key === 'Tab') {
        e.preventDefault()
        const R = template.length, C = template[0].length
        let nr = r, nc = c + 1
        while (nr < R) {
          while (nc < C) { if (template[nr][nc] === 1) { setSelected([nr, nc]); return } nc++ }
          nr++; nc = 0
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, template, won, generating])

  useEffect(() => {
    if (!userGrid || !solution || !template) return
    const R = template.length, C = template[0].length
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++)
        if (template[r][c] === 1 && userGrid[r][c] !== solution[r][c]) return
    setWon(true)
  }, [userGrid])

  function handleReveal() {
    if (!solution || !template) return
    setUserGrid(solution.map(row => [...row]))
    setRevealed(true)
    setChecked(false)
  }

  function handleCheck() { setChecked(true) }

  const acrossSet = new Set()
  const downSet   = new Set()
  if (selected && template) {
    const [sr, sc] = selected
    getAcrossRun(template, sr, sc).forEach(([r, c]) => acrossSet.add(`${r},${c}`))
    getDownRun(template, sr, sc).forEach(([r, c]) => downSet.add(`${r},${c}`))
  }

  if (generating) {
    return (
      <div className="kk-page">
        <Breadcrumb />
        <h1>Kakuro</h1>
        <p className="kk-generating">Generating puzzle…</p>
      </div>
    )
  }

  const cellSize = template
    ? (template.length <= 4 ? 60 : template.length <= 5 ? 52 : template.length <= 6 ? 48 : template.length <= 7 ? 44 : template.length <= 8 ? 40 : 36)
    : 44

  const anyFilled = userGrid && template && template.some((row, r) =>
    row.some((cell, c) => cell === 1 && userGrid[r][c] > 0)
  )

  return (
    <div className="kk-page">
      <Breadcrumb />
      <h1>Kakuro</h1>
      <p className="kk-subtitle">Fill the grid so each run sums to its clue using digits 1–9 (no repeats per run).</p>

      <DifficultySelector
        value={difficulty}
        onChange={(d) => { setDifficulty(d); startGame(d) }}
      />
      <HowToPlay steps={HOW_TO_PLAY} />

      <div className="kk-topbar">
        <span className={`kk-badge kk-badge--${difficulty}`}>{difficulty.replace('-', ' ')}</span>
        <span className="kk-timer">{formatTime(seconds)}</span>
      </div>

      {won && !revealed && (
        <div className="kk-won-banner">
          🎉 Solved! <span className="kk-win-time">{formatTime(seconds)}</span>
          <button className="kk-next-btn" onClick={() => startGame(difficulty)}>New Puzzle →</button>
        </div>
      )}

      {template && (
        <div className="kk-grid-wrap">
          <div
            className="kk-grid"
            style={{
              gridTemplateColumns: `repeat(${template[0].length}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${template.length}, ${cellSize}px)`,
            }}
          >
            {template.map((row, r) => row.map((cell, c) => {
              if (cell === 0) {
                const ac = clues[`a_${r}_${c}`] ?? 0
                const dc = clues[`d_${r}_${c}`] ?? 0
                const hasClue = ac > 0 || dc > 0
                return (
                  <div
                    key={`${r}-${c}`}
                    className="kk-cell kk-cell--black"
                    style={{ width: cellSize, height: cellSize }}
                  >
                    {hasClue && (
                      <>
                        <svg className="kk-diag" viewBox="0 0 40 40" preserveAspectRatio="none">
                          <line x1="2" y1="2" x2="38" y2="38" stroke="#444" strokeWidth="1.5"/>
                        </svg>
                        {dc > 0 && <span className="kk-clue-top">{dc}</span>}
                        {ac > 0 && <span className="kk-clue-bot">{ac}</span>}
                      </>
                    )}
                  </div>
                )
              }

              const key = `${r},${c}`
              const isSel  = selected && selected[0] === r && selected[1] === c
              const inWord = !isSel && (acrossSet.has(key) || downSet.has(key))
              const val    = userGrid[r][c]
              const wrong  = checked && val > 0 && val !== solution[r][c]

              const cls = [
                'kk-cell kk-cell--white',
                isSel  ? 'kk-cell--selected' : '',
                inWord ? 'kk-cell--inword'   : '',
                wrong  ? 'kk-cell--wrong'    : '',
                won    ? 'kk-cell--won'      : '',
              ].filter(Boolean).join(' ')

              return (
                <div
                  key={key}
                  className={cls}
                  style={{ width: cellSize, height: cellSize, fontSize: cellSize < 40 ? '0.9rem' : '1.1rem' }}
                  onClick={() => !won && setSelected([r, c])}
                >
                  {val > 0 ? val : ''}
                </div>
              )
            }))}
          </div>
        </div>
      )}

      <div className="kk-controls">
        <div className="kk-numpad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button
              key={n}
              className="kk-num-btn"
              disabled={!selected || won}
              onClick={() => {
                if (!selected || won) return
                const [r, c] = selected
                setUserGrid(prev => {
                  const next = prev.map(row => [...row])
                  next[r][c] = n
                  return next
                })
                setChecked(false)
                const C = template[0].length
                if (c + 1 < C && template[r][c + 1] === 1) setSelected([r, c + 1])
              }}
            >
              {n}
            </button>
          ))}
          <button
            className="kk-num-btn kk-erase-btn"
            disabled={!selected || won}
            onClick={() => {
              if (!selected || won) return
              const [r, c] = selected
              setUserGrid(prev => {
                const next = prev.map(row => [...row])
                next[r][c] = 0
                return next
              })
              setChecked(false)
            }}
          >
            ⌫
          </button>
        </div>

        <div className="kk-actions">
          <button className="kk-btn" onClick={handleCheck} disabled={!anyFilled || won}>Check</button>
          <button className="kk-btn kk-btn--reveal" onClick={handleReveal} disabled={won}>Reveal</button>
          <button className="kk-btn kk-btn--new" onClick={() => startGame(difficulty)}>New Puzzle</button>
        </div>
      </div>

      <p className="kk-tip">Click a cell · Type 1–9 · Tab to advance · Backspace to erase</p>
    </div>
  )
}
