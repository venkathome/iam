import { useState, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './FlagQuiz.css'

const HOW_TO_PLAY = [
  "A country's flag appears on screen.",
  'Pick the correct country name from the choices given.',
  'Score a point for each flag you identify correctly.',
  'How many flags of the world do you recognize?',
]

const COUNTRIES = [
  { flag: '🇬🇧', name: 'United Kingdom' },
  { flag: '🇫🇷', name: 'France' },
  { flag: '🇩🇪', name: 'Germany' },
  { flag: '🇮🇹', name: 'Italy' },
  { flag: '🇪🇸', name: 'Spain' },
  { flag: '🇵🇹', name: 'Portugal' },
  { flag: '🇳🇱', name: 'Netherlands' },
  { flag: '🇧🇪', name: 'Belgium' },
  { flag: '🇨🇭', name: 'Switzerland' },
  { flag: '🇦🇹', name: 'Austria' },
  { flag: '🇸🇪', name: 'Sweden' },
  { flag: '🇳🇴', name: 'Norway' },
  { flag: '🇩🇰', name: 'Denmark' },
  { flag: '🇫🇮', name: 'Finland' },
  { flag: '🇵🇱', name: 'Poland' },
  { flag: '🇬🇷', name: 'Greece' },
  { flag: '🇺🇸', name: 'United States' },
  { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇲🇽', name: 'Mexico' },
  { flag: '🇧🇷', name: 'Brazil' },
  { flag: '🇦🇷', name: 'Argentina' },
  { flag: '🇨🇱', name: 'Chile' },
  { flag: '🇨🇴', name: 'Colombia' },
  { flag: '🇵🇪', name: 'Peru' },
  { flag: '🇯🇵', name: 'Japan' },
  { flag: '🇨🇳', name: 'China' },
  { flag: '🇮🇳', name: 'India' },
  { flag: '🇰🇷', name: 'South Korea' },
  { flag: '🇹🇭', name: 'Thailand' },
  { flag: '🇻🇳', name: 'Vietnam' },
  { flag: '🇮🇩', name: 'Indonesia' },
  { flag: '🇵🇭', name: 'Philippines' },
  { flag: '🇸🇬', name: 'Singapore' },
  { flag: '🇲🇾', name: 'Malaysia' },
  { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇦🇪', name: 'United Arab Emirates' },
  { flag: '🇹🇷', name: 'Turkey' },
  { flag: '🇪🇬', name: 'Egypt' },
  { flag: '🇿🇦', name: 'South Africa' },
  { flag: '🇳🇬', name: 'Nigeria' },
  { flag: '🇰🇪', name: 'Kenya' },
  { flag: '🇬🇭', name: 'Ghana' },
  { flag: '🇪🇹', name: 'Ethiopia' },
  { flag: '🇦🇺', name: 'Australia' },
  { flag: '🇳🇿', name: 'New Zealand' },
  { flag: '🇷🇺', name: 'Russia' },
  { flag: '🇺🇦', name: 'Ukraine' },
  { flag: '🇮🇱', name: 'Israel' },
  { flag: '🇵🇰', name: 'Pakistan' },
  { flag: '🇧🇩', name: 'Bangladesh' },
]

const DIFF_CONFIG = {
  'very-easy': { questionsPerGame: 8,  choices: 3, showCountryName: true  },
  'easy':      { questionsPerGame: 10, choices: 4, showCountryName: false },
  'medium':    { questionsPerGame: 12, choices: 4, showCountryName: false },
  'hard':      { questionsPerGame: 15, choices: 4, showCountryName: false },
  'very-hard': { questionsPerGame: 18, choices: 5, showCountryName: false },
  'ultimate':  { questionsPerGame: 20, choices: 6, showCountryName: false },
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildGame(cfg) {
  const questions = shuffle(COUNTRIES).slice(0, cfg.questionsPerGame)
  return questions.map(correct => {
    const others = shuffle(COUNTRIES.filter(c => c.name !== correct.name)).slice(0, cfg.choices - 1)
    const choices = shuffle([correct, ...others])
    return { correct, choices }
  })
}

export default function FlagQuiz() {
  const [difficulty, setDifficulty] = useState('medium')
  const [questions, setQuestions] = useState(() => buildGame(DIFF_CONFIG['medium']))
  const [qIndex, setQIndex]       = useState(0)
  const [score, setScore]         = useState(0)
  const [chosen, setChosen]       = useState(null)
  const [done, setDone]           = useState(false)

  const cfg = DIFF_CONFIG[difficulty]
  const question = questions[qIndex]

  const pick = useCallback((country) => {
    if (chosen) return
    setChosen(country.name)
    const correct = country.name === question.correct.name
    if (correct) setScore(s => s + 1)
    setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        setDone(true)
      } else {
        setQIndex(i => i + 1)
        setChosen(null)
      }
    }, correct ? 1000 : 1500)
  }, [chosen, qIndex, question, questions.length])

  function restart() {
    setQuestions(buildGame(cfg))
    setQIndex(0)
    setScore(0)
    setChosen(null)
    setDone(false)
  }

  function handleDifficultyChange(d) {
    setDifficulty(d)
    const newCfg = DIFF_CONFIG[d]
    setQuestions(buildGame(newCfg))
    setQIndex(0)
    setScore(0)
    setChosen(null)
    setDone(false)
  }

  if (done) {
    return (
      <div className="fq-page">
        <Breadcrumb />
        <h1>Flag Quiz</h1>
        <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
        <div className="fq-result">
          <p className="fq-result-score">{score}/{questions.length}</p>
          <p className="fq-result-msg">
            {score === questions.length ? '🏆 Perfect score!' :
             score >= Math.round(questions.length * 0.7) ? '🌟 Great job!' :
             score >= Math.round(questions.length * 0.4) ? '👍 Good effort!' : '🗺️ Keep exploring!'}
          </p>
          <button className="fq-btn" onClick={restart}>Play Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fq-page">
      <Breadcrumb />
      <h1>Flag Quiz</h1>
      <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
      <HowToPlay steps={HOW_TO_PLAY} />

      <div className="fq-header">
        <span className="fq-progress">Question {qIndex + 1} of {questions.length}</span>
        <span className="fq-score">Score: {score}</span>
      </div>

      <div className="fq-flag">{question.correct.flag}</div>
      {cfg.showCountryName && (
        <p className="fq-hint">Hint: {question.correct.name}</p>
      )}
      <p className="fq-prompt">Which country does this flag belong to?</p>

      <div className="fq-choices">
        {question.choices.map(country => {
          const isChosen  = chosen === country.name
          const isCorrect = country.name === question.correct.name
          let cls = 'fq-choice'
          if (chosen) {
            if (isCorrect) cls += ' fq-choice--correct'
            else if (isChosen) cls += ' fq-choice--wrong'
            else cls += ' fq-choice--dim'
          }
          return (
            <button key={country.name} className={cls} onClick={() => pick(country)} disabled={!!chosen}>
              {country.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
