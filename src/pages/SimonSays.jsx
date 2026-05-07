import { useState, useEffect, useRef, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './SimonSays.css'

const HOW_TO_PLAY = [
  'Watch the colored buttons light up one at a time.',
  'After the sequence finishes, press the same buttons in the exact same order.',
  'Each round adds one more button to the sequence.',
  'One wrong press and the game is over.',
  'How long a sequence can you remember?',
]

const COLORS = [
  { id: 'green',  label: 'Green'  },
  { id: 'red',    label: 'Red'    },
  { id: 'yellow', label: 'Yellow' },
  { id: 'blue',   label: 'Blue'   },
]

const DIFF_CONFIG = {
  'very-easy': { flashMs: 900, gapMs: 400 },
  'easy':      { flashMs: 700, gapMs: 350 },
  'medium':    { flashMs: 500, gapMs: 300 },
  'hard':      { flashMs: 380, gapMs: 200 },
  'very-hard': { flashMs: 260, gapMs: 150 },
  'ultimate':  { flashMs: 160, gapMs: 100 },
}

export default function SimonSays() {
  const [difficulty, setDifficulty]    = useState('medium')
  const [phase, setPhase]              = useState('idle')
  const [sequence, setSequence]        = useState([])
  const [activeColor, setActive]       = useState(null)
  const [playerIndex, setPlayerIdx]    = useState(0)
  const [best, setBest]                = useState(() => Number(localStorage.getItem('simon-best') || 0))
  const timers = useRef([])

  function cancel() { timers.current.forEach(clearTimeout); timers.current = [] }

  const playSequence = useCallback((seq, cfg) => {
    setPhase('watching')
    setActive(null)
    const dur  = cfg.flashMs
    const step = dur + cfg.gapMs

    seq.forEach((id, i) => {
      timers.current.push(setTimeout(() => setActive(id),   i * step))
      timers.current.push(setTimeout(() => setActive(null), i * step + dur))
    })
    timers.current.push(setTimeout(() => {
      setPhase('input')
      setPlayerIdx(0)
    }, seq.length * step + 300))
  }, [])

  useEffect(() => () => cancel(), [])

  function start(cfg) {
    cancel()
    const seq = [COLORS[Math.floor(Math.random() * 4)].id]
    setSequence(seq)
    playSequence(seq, cfg)
  }

  function handleDifficultyChange(d) {
    cancel()
    setDifficulty(d)
    setPhase('idle')
    setSequence([])
    setActive(null)
    setPlayerIdx(0)
  }

  function handleClick(id) {
    if (phase !== 'input') return
    const cfg = DIFF_CONFIG[difficulty]

    if (id !== sequence[playerIndex]) {
      cancel()
      const survived = sequence.length - 1
      const nb = Math.max(best, survived)
      if (nb > best) { setBest(nb); localStorage.setItem('simon-best', nb) }
      setPhase('gameover')
      return
    }

    if (playerIndex === sequence.length - 1) {
      const next = [...sequence, COLORS[Math.floor(Math.random() * 4)].id]
      const nb = Math.max(best, next.length - 1)
      if (nb > best) { setBest(nb); localStorage.setItem('simon-best', nb) }
      setBest(nb)
      setSequence(next)
      timers.current.push(setTimeout(() => playSequence(next, cfg), 700))
    } else {
      setPlayerIdx(i => i + 1)
    }
  }

  const round    = sequence.length
  const survived = round - 1

  return (
    <div className="simon-page">
      <Breadcrumb />
      <h1>Simon Says</h1>

      <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
      <HowToPlay steps={HOW_TO_PLAY} />

      <div className="simon-stats">
        <div className="simon-stat">
          <span className="simon-stat-label">Round</span>
          <span className="simon-stat-value">{phase === 'idle' ? '—' : round}</span>
        </div>
        <div className="simon-stat">
          <span className="simon-stat-label">Best</span>
          <span className="simon-stat-value">{best || '—'}</span>
        </div>
      </div>

      <p className="simon-phase">
        {phase === 'idle'     && 'Watch the sequence, then repeat it.'}
        {phase === 'watching' && '👀 Watch…'}
        {phase === 'input'    && `🎮 Your turn — ${sequence.length - playerIndex} left`}
        {phase === 'gameover' && `Game over — ${survived} round${survived !== 1 ? 's' : ''} survived`}
      </p>

      <div className="simon-grid">
        {COLORS.map(c => (
          <button
            key={c.id}
            aria-label={c.label}
            className={`simon-btn simon-btn--${c.id}${activeColor === c.id ? ' simon-btn--active' : ''}`}
            onClick={() => handleClick(c.id)}
            disabled={phase !== 'input'}
          />
        ))}
      </div>

      {(phase === 'idle' || phase === 'gameover') && (
        <button className="simon-cta" onClick={() => start(DIFF_CONFIG[difficulty])}>
          {phase === 'idle' ? 'Start Game' : 'Play Again'}
        </button>
      )}
    </div>
  )
}
