import { useState, useEffect, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './TrueFalse.css'

const HOW_TO_PLAY = [
  'A statement appears on the screen.',
  'Decide whether it is True or False.',
  'Tap the correct button to score a point.',
  'Build a streak of correct answers for bonus bragging rights!',
]

const STATEMENTS = [
  { text: 'The Great Wall of China is visible from space with the naked eye.', answer: false, explanation: 'It is too narrow to be seen from space without aid.' },
  { text: 'Sharks are the only fish that can blink with both eyes.', answer: false, explanation: 'Sharks do not have eyelids and cannot blink at all.' },
  { text: 'A day on Venus is longer than a year on Venus.', answer: true, explanation: 'Venus rotates so slowly that its day (243 Earth days) exceeds its year (225 Earth days).' },
  { text: 'Honey never spoils — edible honey has been found in ancient Egyptian tombs.', answer: true, explanation: 'Honey\'s low moisture and acidic pH make it last indefinitely.' },
  { text: 'The Eiffel Tower grows taller in summer due to heat expansion.', answer: true, explanation: 'The iron expands in heat, adding up to 15 cm to its height.' },
  { text: 'Goldfish have a memory of only three seconds.', answer: false, explanation: 'Goldfish can remember things for months, not seconds.' },
  { text: 'Humans share about 50% of their DNA with bananas.', answer: true, explanation: 'Around 50–60% of human genes have a functional equivalent in bananas.' },
  { text: 'Lightning never strikes the same place twice.', answer: false, explanation: 'The Empire State Building is struck by lightning about 20–25 times per year.' },
  { text: 'Antarctica is the largest desert in the world.', answer: true, explanation: 'Antarctica is classified as a polar desert — the largest on Earth.' },
  { text: 'The human eye can distinguish about 10 million different colours.', answer: true, explanation: 'The human visual system can perceive roughly 10 million distinct colours.' },
  { text: 'Water always boils at 100 degrees Celsius, regardless of altitude.', answer: false, explanation: 'Water boils at lower temperatures at higher altitudes due to reduced air pressure.' },
  { text: 'Octopuses have three hearts.', answer: true, explanation: 'Two branchial hearts pump blood through the gills; one systemic heart circulates it to the body.' },
  { text: 'Mount Everest is the closest mountain to outer space when measured from Earth\'s centre.', answer: false, explanation: 'Mount Chimborazo in Ecuador is closest to space due to Earth\'s equatorial bulge.' },
  { text: 'Sound travels faster in water than in air.', answer: true, explanation: 'Sound travels about 4–5 times faster in water than in air.' },
  { text: 'The sun is yellow.', answer: false, explanation: 'The sun is actually white; it appears yellow due to atmospheric scattering.' },
  { text: 'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.', answer: true, explanation: 'Cleopatra lived around 30 BC — about 2,500 years after the pyramids and 2,000 years before the Moon landing.' },
  { text: 'A group of flamingos is called a flamboyance.', answer: true, explanation: 'The collective noun for flamingos is indeed a flamboyance.' },
  { text: 'Napoleon Bonaparte was unusually short for his time.', answer: false, explanation: 'Napoleon was about 5\'7" (170 cm), average or slightly above average for a Frenchman of his era.' },
  { text: 'Cats can taste sweetness.', answer: false, explanation: 'Cats lack the taste receptor for sweetness and cannot taste sweet things.' },
  { text: 'The Great Barrier Reef is visible from space.', answer: true, explanation: 'The Great Barrier Reef is large enough to be seen from low Earth orbit.' },
  { text: 'There are more possible games of chess than atoms in the observable universe.', answer: true, explanation: 'The Shannon number — estimated possible chess games — vastly exceeds the number of atoms in the universe.' },
  { text: 'Penguins only live in Antarctica.', answer: false, explanation: 'Penguins are found across the Southern Hemisphere, including the Galapagos Islands near the equator.' },
  { text: 'Hot water freezes faster than cold water under some conditions.', answer: true, explanation: 'This is known as the Mpemba effect, though scientists still debate the exact mechanism.' },
  { text: 'The Pacific Ocean is larger than all of Earth\'s land combined.', answer: true, explanation: 'The Pacific Ocean covers about 165 million km² — more than all land on Earth.' },
  { text: 'A cockroach can survive for weeks without its head.', answer: true, explanation: 'Cockroaches breathe through tiny holes in their body segments and can survive headless until they die of thirst.' },
  { text: 'Diamonds are made of carbon.', answer: true, explanation: 'Diamonds are the hardest natural substance and are composed entirely of carbon atoms.' },
  { text: 'Humans only use 10% of their brain.', answer: false, explanation: 'Brain imaging shows virtually all parts of the brain are active at some point during the day.' },
  { text: 'The Earth is perfectly spherical in shape.', answer: false, explanation: 'The Earth is an oblate spheroid — slightly flattened at the poles and bulging at the equator.' },
  { text: 'Bats are blind.', answer: false, explanation: 'All bat species can see; many also use echolocation to navigate in the dark.' },
  { text: 'An ostrich\'s eye is bigger than its brain.', answer: true, explanation: 'Each ostrich eyeball is about 5 cm in diameter, larger than its brain.' },
  { text: 'Salty water boils faster than pure water.', answer: false, explanation: 'Dissolved salt raises the boiling point slightly, so salty water actually takes longer to boil.' },
  { text: 'There are more stars in the universe than grains of sand on all of Earth\'s beaches.', answer: true, explanation: 'Estimates put the number of stars at around 10²⁴ — exceeding the estimated number of grains of sand.' },
]

const DIFF_CONFIG = {
  'very-easy': { timePerQuestion: 0,  statementsCount: 15 },
  'easy':      { timePerQuestion: 0,  statementsCount: 20 },
  'medium':    { timePerQuestion: 0,  statementsCount: 25 },
  'hard':      { timePerQuestion: 8,  statementsCount: 25 },
  'very-hard': { timePerQuestion: 5,  statementsCount: 30 },
  'ultimate':  { timePerQuestion: 3,  statementsCount: 30 },
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeQuestions(count) {
  return shuffle(STATEMENTS).slice(0, Math.min(count, STATEMENTS.length))
}

export default function TrueFalse() {
  const [difficulty, setDifficulty] = useState('medium')
  const [questions, setQuestions]   = useState(() => makeQuestions(DIFF_CONFIG['medium'].statementsCount))
  const [index, setIndex]           = useState(0)
  const [score, setScore]           = useState(0)
  const [streak, setStreak]         = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [feedback, setFeedback]     = useState(null)
  const [done, setDone]             = useState(false)
  const [advancing, setAdvancing]   = useState(false)
  const [timeLeft, setTimeLeft]     = useState(DIFF_CONFIG['medium'].timePerQuestion)

  const cfg = DIFF_CONFIG[difficulty]
  const current = questions[index]

  const advance = useCallback(() => {
    if (index + 1 >= questions.length) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
      setFeedback(null)
      setAdvancing(false)
      if (cfg.timePerQuestion > 0) {
        setTimeLeft(cfg.timePerQuestion)
      }
    }
  }, [index, questions.length, cfg.timePerQuestion])

  useEffect(() => {
    if (feedback && !advancing) {
      setAdvancing(true)
      const t = setTimeout(advance, 1400)
      return () => clearTimeout(t)
    }
  }, [feedback, advancing, advance])

  useEffect(() => {
    if (cfg.timePerQuestion === 0 || feedback || advancing || done) return
    if (timeLeft <= 0) {
      setStreak(0)
      setFeedback({ correct: false, explanation: current.explanation, timedOut: true })
      return
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [cfg.timePerQuestion, timeLeft, feedback, advancing, done, current])

  function answer(choice) {
    if (feedback || advancing) return
    const correct = choice === current.answer
    if (correct) {
      setScore(s => s + 1)
      const newStreak = streak + 1
      setStreak(newStreak)
      setBestStreak(b => Math.max(b, newStreak))
    } else {
      setStreak(0)
    }
    setFeedback({ correct, explanation: current.explanation, timedOut: false })
  }

  function restart() {
    setQuestions(makeQuestions(cfg.statementsCount))
    setIndex(0)
    setScore(0)
    setStreak(0)
    setFeedback(null)
    setDone(false)
    setAdvancing(false)
    setTimeLeft(cfg.timePerQuestion)
  }

  function handleDifficultyChange(d) {
    setDifficulty(d)
    const newCfg = DIFF_CONFIG[d]
    setQuestions(makeQuestions(newCfg.statementsCount))
    setIndex(0)
    setScore(0)
    setStreak(0)
    setFeedback(null)
    setDone(false)
    setAdvancing(false)
    setTimeLeft(newCfg.timePerQuestion)
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="tf-page">
        <Breadcrumb />
        <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
        <div className="tf-summary">
          <h1>Well played!</h1>
          <div className="tf-summary-score">
            <span className="summary-num">{score}</span>
            <span className="summary-of">/ {questions.length}</span>
          </div>
          <p className="summary-pct">{pct}% correct</p>
          {bestStreak > 1 && (
            <p className="summary-streak">Best streak: {bestStreak} in a row 🔥</p>
          )}
          <button className="tf-play-again" onClick={restart}>Play Again</button>
        </div>
      </div>
    )
  }

  const progress = ((index) / questions.length) * 100

  return (
    <div className="tf-page">
      <Breadcrumb />
      <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
      <HowToPlay steps={HOW_TO_PLAY} />
      <div className="tf-top">
        <h1>True or False</h1>
        <div className="tf-scoreboard">
          <span className="tf-score-num">{score}</span>
          <span className="tf-score-sep">/</span>
          <span className="tf-score-total">{index}</span>
          {streak >= 3 && <span className="tf-streak">🔥 {streak}</span>}
        </div>
      </div>

      <div className="tf-progress-bar">
        <div className="tf-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="tf-counter">Question {index + 1} of {questions.length}</p>

      {cfg.timePerQuestion > 0 && !feedback && (
        <div className="tf-timer">
          <div
            className={`tf-timer-fill${timeLeft <= 2 ? ' tf-timer-fill--urgent' : ''}`}
            style={{ width: `${(timeLeft / cfg.timePerQuestion) * 100}%` }}
          />
          <span className="tf-timer-label">{timeLeft}s</span>
        </div>
      )}

      <div className={`tf-card ${feedback ? (feedback.correct ? 'tf-card--correct' : 'tf-card--wrong') : ''}`}>
        <p className="tf-statement">{current.text}</p>

        {feedback && (
          <div className="tf-feedback">
            <p className="tf-verdict">
              {feedback.timedOut ? '⏰ Time\'s up!' : (feedback.correct ? '✓ Correct!' : '✗ Wrong!')}
            </p>
            <p className="tf-explanation">{feedback.explanation}</p>
          </div>
        )}
      </div>

      <div className="tf-buttons">
        <button
          className={`tf-btn tf-btn--true ${feedback ? 'tf-btn--disabled' : ''}`}
          onClick={() => answer(true)}
          disabled={!!feedback}
        >
          TRUE
        </button>
        <button
          className={`tf-btn tf-btn--false ${feedback ? 'tf-btn--disabled' : ''}`}
          onClick={() => answer(false)}
          disabled={!!feedback}
        >
          FALSE
        </button>
      </div>
    </div>
  )
}
