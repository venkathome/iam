import { useState, useEffect, useRef, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './Crossword.css'

// '#' = black cell, letter = solution letter
const PUZZLES = [
  {
    title: 'Puzzle 1',
    solution: [
      ['#','C','A','K','E'],
      ['#','L','#','#','#'],
      ['S','O','A','P','#'],
      ['#','U','#','#','#'],
      ['#','D','#','#','#'],
    ],
    clues: {
      across: [
        { number: 1, clue: 'Sweet baked treat with icing' },
        { number: 2, clue: 'Used to wash your hands' },
      ],
      down: [
        { number: 1, clue: 'White fluffy thing in the sky' },
      ],
    },
  },
  {
    title: 'Puzzle 2',
    solution: [
      ['B','R','E','A','D'],
      ['#','A','#','#','#'],
      ['#','I','N','K','#'],
      ['#','N','#','#','#'],
      ['#','#','#','#','#'],
    ],
    clues: {
      across: [
        { number: 1, clue: 'Baked staple food made with flour' },
        { number: 3, clue: 'Used for writing or printing' },
      ],
      down: [
        { number: 2, clue: 'Water falling from the sky' },
      ],
    },
  },
  {
    title: 'Puzzle 3',
    solution: [
      ['#','#','S','#','#'],
      ['F','L','A','M','E'],
      ['#','#','Y','#','#'],
      ['#','#','S','#','#'],
      ['#','#','#','#','#'],
    ],
    clues: {
      across: [
        { number: 2, clue: "Fire's glowing visible light" },
      ],
      down: [
        { number: 1, clue: 'Speaks or utters (he ___ so)' },
      ],
    },
  },
  {
    title: 'Puzzle 4',
    solution: [
      ['#','M','O','O','N'],
      ['#','A','#','W','#'],
      ['S','P','A','R','K'],
      ['#','#','#','L','#'],
      ['#','#','#','#','#'],
    ],
    clues: {
      across: [
        { number: 1, clue: 'Orbits the Earth; lights the night' },
        { number: 3, clue: 'A tiny flash of light or electricity' },
      ],
      down: [
        { number: 2, clue: 'A chart or diagram of an area' },
        { number: 4, clue: 'An adult male bird of prey' },
      ],
    },
  },
]

function buildNumbering(solution) {
  const size = solution.length
  let n = 1
  const nums = Array(size).fill(null).map(() => Array(size).fill(0))
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (solution[r][c] === '#') continue
      const startsAcross = (c === 0 || solution[r][c - 1] === '#') &&
                           c + 1 < size && solution[r][c + 1] !== '#'
      const startsDown   = (r === 0 || solution[r - 1][c] === '#') &&
                           r + 1 < size && solution[r + 1][c] !== '#'
      if (startsAcross || startsDown) nums[r][c] = n++
    }
  }
  return nums
}

function emptyUserGrid(solution) {
  return solution.map(row => row.map(c => (c === '#' ? '#' : '')))
}

function wordCells(solution, startR, startC, dir) {
  const size = solution.length
  const cells = []
  let r = startR, c = startC
  while (r < size && c < size && solution[r][c] !== '#') {
    cells.push([r, c])
    if (dir === 'across') c++; else r++
  }
  return cells
}

function findWordAt(solution, numbering, number, dir) {
  const size = solution.length
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (numbering[r][c] === number) {
        if (dir === 'across') {
          const ok = (c === 0 || solution[r][c - 1] === '#') &&
                     c + 1 < size && solution[r][c + 1] !== '#'
          if (ok) return wordCells(solution, r, c, 'across')
        } else {
          const ok = (r === 0 || solution[r - 1][c] === '#') &&
                     r + 1 < size && solution[r + 1][c] !== '#'
          if (ok) return wordCells(solution, r, c, 'down')
        }
      }
  return []
}

function directionAt(solution, r, c) {
  const size = solution.length
  const hasAcross = (c > 0 && solution[r][c - 1] !== '#') || (c + 1 < size && solution[r][c + 1] !== '#')
  const hasDown   = (r > 0 && solution[r - 1][c] !== '#') || (r + 1 < size && solution[r + 1][c] !== '#')
  if (hasAcross && !hasDown) return 'across'
  if (hasDown && !hasAcross) return 'down'
  return 'across'
}

export default function Crossword() {
  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const puzzle = PUZZLES[puzzleIdx]
  const { solution, clues } = puzzle
  const numbering = buildNumbering(solution)
  const size = solution.length

  const [userGrid, setUserGrid] = useState(() => emptyUserGrid(solution))
  const [selected, setSelected] = useState(null) // [r, c]
  const [direction, setDirection] = useState('across')
  const [checked, setChecked] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    setUserGrid(emptyUserGrid(solution))
    setSelected(null)
    setDirection('across')
    setChecked(false)
    setRevealed(false)
  }, [puzzleIdx])

  const activeWord = selected
    ? (() => {
        const [r, c] = selected
        const cells = []
        if (direction === 'across') {
          let cc = c
          while (cc >= 0 && solution[r][cc] !== '#') cc--
          cc++
          while (cc < size && solution[r][cc] !== '#') { cells.push([r, cc]); cc++ }
        } else {
          let rr = r
          while (rr >= 0 && solution[rr][c] !== '#') rr--
          rr++
          while (rr < size && solution[rr][c] !== '#') { cells.push([rr, c]); rr++ }
        }
        return cells
      })()
    : []

  const activeWordSet = new Set(activeWord.map(([r, c]) => `${r},${c}`))

  function selectCell(r, c) {
    if (solution[r][c] === '#') return
    if (selected && selected[0] === r && selected[1] === c) {
      setDirection(d => d === 'across' ? 'down' : 'across')
    } else {
      setSelected([r, c])
      setDirection(directionAt(solution, r, c))
    }
    setChecked(false)
    containerRef.current?.focus()
  }

  const advance = useCallback((r, c) => {
    if (direction === 'across') {
      for (let nc = c + 1; nc < size; nc++) {
        if (solution[r][nc] !== '#') { setSelected([r, nc]); return }
      }
    } else {
      for (let nr = r + 1; nr < size; nr++) {
        if (solution[nr][c] !== '#') { setSelected([nr, c]); return }
      }
    }
  }, [direction, solution, size])

  const retreat = useCallback((r, c) => {
    if (direction === 'across') {
      for (let nc = c - 1; nc >= 0; nc--) {
        if (solution[r][nc] !== '#') { setSelected([r, nc]); return }
      }
    } else {
      for (let nr = r - 1; nr >= 0; nr--) {
        if (solution[nr][c] !== '#') { setSelected([nr, c]); return }
      }
    }
  }, [direction, solution])

  function handleKeyDown(e) {
    if (!selected) return
    const [r, c] = selected

    if (e.key === 'Tab') {
      e.preventDefault()
      setDirection(d => d === 'across' ? 'down' : 'across')
      return
    }
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (userGrid[r][c] !== '') {
        setUserGrid(prev => {
          const next = prev.map(row => [...row])
          next[r][c] = ''
          return next
        })
      } else {
        retreat(r, c)
      }
      setChecked(false)
      return
    }
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      const letter = e.key.toUpperCase()
      setUserGrid(prev => {
        const next = prev.map(row => [...row])
        next[r][c] = letter
        return next
      })
      setChecked(false)
      advance(r, c)
    }
    if (e.key === 'ArrowRight') { e.preventDefault(); setDirection('across'); advance(r, c) }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setDirection('across'); retreat(r, c) }
    if (e.key === 'ArrowDown')  { e.preventDefault(); setDirection('down');   advance(r, c) }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setDirection('down');   retreat(r, c) }
  }

  function isCorrect(r, c) {
    return userGrid[r][c].toUpperCase() === solution[r][c].toUpperCase()
  }

  function handleCheck() { setChecked(true) }
  function handleReveal() {
    setUserGrid(solution.map(row => [...row]))
    setRevealed(true)
    setChecked(false)
  }

  const allFilled = solution.every((row, r) =>
    row.every((cell, c) => cell === '#' || userGrid[r][c] !== '')
  )
  const allCorrect = solution.every((row, r) =>
    row.every((cell, c) => cell === '#' || isCorrect(r, c))
  )
  const won = !revealed && allCorrect && allFilled

  function clueCell(number, dir) {
    const cells = findWordAt(solution, numbering, number, dir)
    return cells.length ? cells[0] : null
  }

  function jumpToClue(number, dir) {
    const first = clueCell(number, dir)
    if (first) { setSelected(first); setDirection(dir); containerRef.current?.focus() }
  }

  return (
    <div className="crossword-page">
      <Breadcrumb />
      <h1>Crossword</h1>

      <div className="cw-puzzle-tabs">
        {PUZZLES.map((p, i) => (
          <button key={i} className={`cw-tab ${i === puzzleIdx ? 'cw-tab--active' : ''}`}
            onClick={() => setPuzzleIdx(i)}>{p.title}</button>
        ))}
      </div>

      {won && (
        <div className="cw-win-banner">🎉 Solved! Well done!</div>
      )}

      <div className="cw-layout">
        <div
          ref={containerRef}
          className="cw-grid-wrap"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ outline: 'none' }}
        >
          <div className="cw-grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {solution.map((row, r) => row.map((cell, c) => {
              if (cell === '#') return <div key={`${r}-${c}`} className="cw-cell cw-cell--black" />
              const isSelected = selected && selected[0] === r && selected[1] === c
              const inWord = activeWordSet.has(`${r},${c}`)
              const num = numbering[r][c]
              const userVal = userGrid[r][c]
              const wrongFlag = checked && userVal !== '' && !isCorrect(r, c)
              return (
                <div
                  key={`${r}-${c}`}
                  className={`cw-cell cw-cell--white
                    ${isSelected ? 'cw-cell--selected' : ''}
                    ${inWord && !isSelected ? 'cw-cell--inword' : ''}
                    ${wrongFlag ? 'cw-cell--wrong' : ''}
                    ${won ? 'cw-cell--won' : ''}
                  `}
                  onClick={() => selectCell(r, c)}
                >
                  {num > 0 && <span className="cw-num">{num}</span>}
                  <span className="cw-letter">{userVal}</span>
                </div>
              )
            }))}
          </div>
        </div>

        <div className="cw-clues">
          <div className="cw-clue-group">
            <h3>Across</h3>
            {clues.across.map(({ number, clue }) => (
              <button key={number} className="cw-clue-item" onClick={() => jumpToClue(number, 'across')}>
                <span className="cw-clue-num">{number}</span>
                <span className="cw-clue-text">{clue}</span>
              </button>
            ))}
          </div>
          <div className="cw-clue-group">
            <h3>Down</h3>
            {clues.down.map(({ number, clue }) => (
              <button key={number} className="cw-clue-item" onClick={() => jumpToClue(number, 'down')}>
                <span className="cw-clue-num">{number}</span>
                <span className="cw-clue-text">{clue}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="cw-actions">
        <button className="cw-btn" onClick={handleCheck} disabled={!allFilled}>Check</button>
        <button className="cw-btn cw-btn--reveal" onClick={handleReveal}>Reveal</button>
      </div>
      <p className="cw-tip">Click a cell to select · Click again to toggle direction · Tab also toggles</p>
    </div>
  )
}
