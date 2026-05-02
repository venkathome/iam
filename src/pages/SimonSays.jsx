import { useState, useEffect, useRef, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './SimonSays.css'

const COLORS = [
  { id: 'green',  label: 'Green'  },
  { id: 'red',    label: 'Red'    },
  { id: 'yellow', label: 'Yellow' },
  { id: 'blue',   label: 'Blue'   },
]

function flashDuration(round) {
  return Math.max(180, 600 - Math.floor((round - 1) / 5) * 60)
}

export default function SimonSays() {
  const [phase, setPhase]           = useState('idle')   // idle | watching | input | gameover
  const [sequence, setSequence]     = useState([])
  const [activeColor, setActive]    = useState(null)
  const [playerIndex, setPlayerIdx] = useState(0)
  const [best, setBest]             = useState(() => Number(localStorage.getItem('simon-best') || 0))
  const timers = useRef([])

  function cancel() { timers.current.forEach(clearTimeout); timers.current = [] }

  const playSequence = useCallback((seq) => {
    setPhase('watching')
    setActive(null)
    const dur  = flashDuration(seq.length)
    const step = dur + 180

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

  function start() {
    cancel()
    const seq = [COLORS[Math.floor(Math.random() * 4)].id]
    setSequence(seq)
    playSequence(seq)
  }

  function handleClick(id) {
    if (phase !== 'input') return

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
      timers.current.push(setTimeout(() => playSequence(next), 700))
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
        <button className="simon-cta" onClick={start}>
          {phase === 'idle' ? 'Start Game' : 'Play Again'}
        </button>
      )}
    </div>
  )
}
