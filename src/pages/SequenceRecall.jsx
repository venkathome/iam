import { useState, useEffect, useRef } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './SequenceRecall.css'

const SHOW_MS = 800
const GAP_MS  = 400

function makeSeq(len) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1)
}

export default function SequenceRecall() {
  const [phase, setPhase]       = useState('idle')   // idle | showing | input | correct | gameover
  const [sequence, setSequence] = useState([])
  const [seqLen, setSeqLen]     = useState(3)
  const [shown, setShown]       = useState(null)      // number currently displayed (null = gap)
  const [entered, setEntered]   = useState([])        // player's entries so far
  const [wrongAt, setWrongAt]   = useState(null)      // index of wrong answer
  const [best, setBest]         = useState(
    () => Number(localStorage.getItem('seqrecall-best') || 0)
  )
  const timers = useRef([])

  function cancel() { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => () => cancel(), [])

  function revealSequence(seq) {
    setPhase('showing')
    setShown(null)
    setEntered([])
    setWrongAt(null)

    seq.forEach((n, i) => {
      const offset = i * (SHOW_MS + GAP_MS)
      timers.current.push(setTimeout(() => setShown(n),    offset))
      timers.current.push(setTimeout(() => setShown(null), offset + SHOW_MS))
    })
    timers.current.push(setTimeout(() => {
      setPhase('input')
    }, seq.length * (SHOW_MS + GAP_MS) + 200))
  }

  function start() {
    cancel()
    const len = 3
    setSeqLen(len)
    const seq = makeSeq(len)
    setSequence(seq)
    revealSequence(seq)
  }

  function handleDigit(n) {
    if (phase !== 'input') return
    const idx        = entered.length
    const next       = [...entered, n]
    const isCorrect  = n === sequence[idx]

    if (!isCorrect) {
      setWrongAt(idx)
      setEntered(next)
      const nb = Math.max(best, seqLen)
      if (nb > best) { setBest(nb); localStorage.setItem('seqrecall-best', nb) }
      setPhase('gameover')
      return
    }

    setEntered(next)

    if (next.length === sequence.length) {
      const nb = Math.max(best, seqLen + 1)
      if (nb > best) { setBest(nb); localStorage.setItem('seqrecall-best', nb) }
      setBest(nb)
      setPhase('correct')
      const nextLen = seqLen + 1
      setSeqLen(nextLen)
      timers.current.push(setTimeout(() => {
        const seq = makeSeq(nextLen)
        setSequence(seq)
        revealSequence(seq)
      }, 1100))
    }
  }

  const progress = entered.length

  return (
    <div className="sr-page">
      <Breadcrumb />
      <h1>Sequence Recall</h1>

      <div className="sr-stats">
        <div className="sr-stat">
          <span className="sr-stat-label">Length</span>
          <span className="sr-stat-value">{phase === 'idle' ? '—' : seqLen}</span>
        </div>
        <div className="sr-stat">
          <span className="sr-stat-label">Best</span>
          <span className="sr-stat-value">{best || '—'}</span>
        </div>
      </div>

      {/* Central display */}
      <div className={`sr-display ${phase === 'showing' && shown !== null ? 'sr-display--lit' : ''} ${phase === 'correct' ? 'sr-display--correct' : ''} ${phase === 'gameover' ? 'sr-display--wrong' : ''}`}>
        {phase === 'idle'    && <span className="sr-display-hint">Press Start</span>}
        {phase === 'showing' && shown !== null && <span className="sr-display-num">{shown}</span>}
        {phase === 'showing' && shown === null && <span className="sr-display-gap">·</span>}
        {phase === 'input'   && <span className="sr-display-hint">Your turn</span>}
        {phase === 'correct' && <span className="sr-display-num">✓</span>}
        {phase === 'gameover'&& <span className="sr-display-num">✗</span>}
      </div>

      <p className="sr-phase">
        {phase === 'idle'     && 'Remember the number sequence, then repeat it.'}
        {phase === 'showing'  && 'Memorise the sequence…'}
        {phase === 'input'    && `Enter all ${sequence.length} numbers in order`}
        {phase === 'correct'  && '✓ Correct! Next round loading…'}
        {phase === 'gameover' && `The sequence was: ${sequence.join('  ')}. You reached length ${seqLen}.`}
      </p>

      {/* Progress dots */}
      {phase === 'input' && (
        <div className="sr-dots">
          {sequence.map((_, i) => {
            const isFilled  = i < progress
            const isWrong   = wrongAt !== null && i === wrongAt
            return (
              <span
                key={i}
                className={`sr-dot ${isFilled ? 'sr-dot--filled' : ''} ${isWrong ? 'sr-dot--wrong' : ''}`}
              />
            )
          })}
        </div>
      )}

      {/* Digit pad */}
      {phase === 'input' && (
        <div className="sr-digit-grid">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} className="sr-digit" onClick={() => handleDigit(n)}>{n}</button>
          ))}
        </div>
      )}

      {(phase === 'idle' || phase === 'gameover') && (
        <button className="sr-cta" onClick={start}>
          {phase === 'idle' ? 'Start Game' : 'Play Again'}
        </button>
      )}
    </div>
  )
}
