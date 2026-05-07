import { useState, useEffect, useRef } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './SequenceRecall.css'

const HOW_TO_PLAY = [
  'Press Start to begin.',
  'Watch carefully as digits light up one at a time.',
  'When the sequence finishes, tap the same digits in the same order.',
  'Each round adds one more digit to remember.',
  'The game ends when you get the order wrong — how far can you go?',
]

const DIFF_CONFIG = {
  'very-easy': { startLen: 2, showMs: 1100, gapMs: 500 },
  'easy':      { startLen: 3, showMs: 900,  gapMs: 400 },
  'medium':    { startLen: 4, showMs: 700,  gapMs: 350 },
  'hard':      { startLen: 5, showMs: 500,  gapMs: 250 },
  'very-hard': { startLen: 6, showMs: 350,  gapMs: 180 },
  'ultimate':  { startLen: 7, showMs: 200,  gapMs: 120 },
}

function makeSeq(len) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1)
}

export default function SequenceRecall() {
  const [difficulty, setDifficulty] = useState('medium')
  const [phase, setPhase]           = useState('idle')
  const [sequence, setSequence]     = useState([])
  const [seqLen, setSeqLen]         = useState(DIFF_CONFIG['medium'].startLen)
  const [shown, setShown]           = useState(null)
  const [entered, setEntered]       = useState([])
  const [wrongAt, setWrongAt]       = useState(null)
  const [best, setBest]             = useState(
    () => Number(localStorage.getItem('seqrecall-best') || 0)
  )
  const timers = useRef([])

  function cancel() { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => () => cancel(), [])

  function revealSequence(seq, cfg) {
    setPhase('showing')
    setShown(null)
    setEntered([])
    setWrongAt(null)

    seq.forEach((n, i) => {
      const offset = i * (cfg.showMs + cfg.gapMs)
      timers.current.push(setTimeout(() => setShown(n),    offset))
      timers.current.push(setTimeout(() => setShown(null), offset + cfg.showMs))
    })
    timers.current.push(setTimeout(() => {
      setPhase('input')
    }, seq.length * (cfg.showMs + cfg.gapMs) + 200))
  }

  function start(cfg) {
    cancel()
    const len = cfg.startLen
    setSeqLen(len)
    const seq = makeSeq(len)
    setSequence(seq)
    revealSequence(seq, cfg)
  }

  function handleDifficultyChange(d) {
    cancel()
    setDifficulty(d)
    setPhase('idle')
    setSequence([])
    setSeqLen(DIFF_CONFIG[d].startLen)
    setShown(null)
    setEntered([])
    setWrongAt(null)
  }

  function handleDigit(n) {
    if (phase !== 'input') return
    const cfg        = DIFF_CONFIG[difficulty]
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
        revealSequence(seq, cfg)
      }, 1100))
    }
  }

  const progress = entered.length

  return (
    <div className="sr-page">
      <Breadcrumb />
      <h1>Sequence Recall</h1>

      <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
      <HowToPlay steps={HOW_TO_PLAY} />

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

      {phase === 'input' && (
        <div className="sr-digit-grid">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} className="sr-digit" onClick={() => handleDigit(n)}>{n}</button>
          ))}
        </div>
      )}

      {(phase === 'idle' || phase === 'gameover') && (
        <button className="sr-cta" onClick={() => start(DIFF_CONFIG[difficulty])}>
          {phase === 'idle' ? 'Start Game' : 'Play Again'}
        </button>
      )}
    </div>
  )
}
