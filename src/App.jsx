import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Recipes from './pages/Recipes'
import FamilyTree from './pages/FamilyTree'
import Learning from './pages/Learning'
import Spellings from './pages/Spellings'
import Tamil from './pages/Tamil'
import Thirukkural from './pages/Thirukkural'
import Diary from './pages/Diary'
import Games from './pages/Games'
import TicTacToe from './pages/TicTacToe'
import Ludo from './pages/Ludo'
import Questions from './pages/Questions'
import Brands from './pages/Brands'
const Therapy = lazy(() => import('./pages/Therapy'))
import Hangman from './pages/Hangman'
import WordScramble from './pages/WordScramble'
import Crossword from './pages/Crossword'
import WordChain from './pages/WordChain'
import SimonSays from './pages/SimonSays'
import MemoryMatch from './pages/MemoryMatch'
import SequenceRecall from './pages/SequenceRecall'
import QuizBowl from './pages/QuizBowl'
import FlagQuiz from './pages/FlagQuiz'
import TrueFalse from './pages/TrueFalse'
import Sudoku from './pages/Sudoku'
import Game2048 from './pages/Game2048'
import SlidingPuzzle from './pages/SlidingPuzzle'
import Pictionary from './pages/Pictionary'
import Kakuro from './pages/Kakuro'
import KillerKakuro from './pages/KillerKakuro'
import DOSGames from './pages/DOSGames'
import Tetris from './pages/Tetris'
import Snake from './pages/Snake'
import Minesweeper from './pages/Minesweeper'
import Breakout from './pages/Breakout'
import SpaceInvaders from './pages/SpaceInvaders'
import Pong from './pages/Pong'

function App() {
  return (
    <Routes>
      <Route path="/"                                        element={<Home />} />
      <Route path="/dashboard/:profileId"                   element={<Dashboard />} />
      <Route path="/therapy/:profileId"                     element={
        <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', fontSize: 18, color: '#888' }}>Loading therapy materials…</div>}>
          <Therapy />
        </Suspense>
      } />
      <Route path="/recipes"                                element={<Recipes />} />
      <Route path="/family-tree"                            element={<FamilyTree />} />
      <Route path="/learning"                               element={<Navigate to="/" replace />} />
      <Route path="/learning/:profileId"                    element={<Learning />} />
      <Route path="/learning/:profileId/spellings"          element={<Spellings />} />
      <Route path="/learning/:profileId/tamil"              element={<Tamil />} />
      <Route path="/learning/:profileId/tamil/thirukkural"  element={<Thirukkural />} />
      <Route path="/diary"                                  element={<Diary />} />
      <Route path="/games"                                  element={<Games />} />
      <Route path="/games/tic-tac-toe"                     element={<TicTacToe />} />
      <Route path="/games/ludo"                            element={<Ludo />} />
      <Route path="/games/questions"                       element={<Questions />} />
      <Route path="/games/brands"                          element={<Brands />} />
      <Route path="/games/hangman"                         element={<Hangman />} />
      <Route path="/games/word-scramble"                   element={<WordScramble />} />
      <Route path="/games/crossword"                       element={<Crossword />} />
      <Route path="/games/word-chain"                      element={<WordChain />} />
      <Route path="/games/simon-says"                      element={<SimonSays />} />
      <Route path="/games/memory-match"                    element={<MemoryMatch />} />
      <Route path="/games/sequence-recall"                 element={<SequenceRecall />} />
      <Route path="/games/quiz-bowl"                       element={<QuizBowl />} />
      <Route path="/games/flag-quiz"                       element={<FlagQuiz />} />
      <Route path="/games/true-false"                      element={<TrueFalse />} />
      <Route path="/games/sudoku"                          element={<Sudoku />} />
      <Route path="/games/2048"                            element={<Game2048 />} />
      <Route path="/games/sliding-puzzle"                  element={<SlidingPuzzle />} />
      <Route path="/games/pictionary"                      element={<Pictionary />} />
      <Route path="/games/kakuro"                         element={<Kakuro />} />
      <Route path="/games/killer-kakuro"                 element={<KillerKakuro />} />
      <Route path="/games/dos"                           element={<DOSGames />} />
      <Route path="/games/dos/tetris"                    element={<Tetris />} />
      <Route path="/games/dos/snake"                     element={<Snake />} />
      <Route path="/games/dos/minesweeper"               element={<Minesweeper />} />
      <Route path="/games/dos/breakout"                  element={<Breakout />} />
      <Route path="/games/dos/space-invaders"            element={<SpaceInvaders />} />
      <Route path="/games/dos/pong"                      element={<Pong />} />
    </Routes>
  )
}

export default App
