import { Link, useLocation, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { GET_PROFILES } from '../apollo/queries'
import './Breadcrumb.css'

function buildCrumbs(pathname, profile, profileId) {
  if (pathname === '/') return [{ label: 'Home' }]

  const crumbs = [{ label: 'Home', to: '/' }]

  if (pathname.startsWith('/recipes')) {
    crumbs.push({ label: 'Recipes' })
  } else if (pathname.startsWith('/family-tree')) {
    crumbs.push({ label: 'Family Tree' })
  } else if (pathname.startsWith('/diary')) {
    crumbs.push({ label: 'Diary' })
  } else if (pathname.startsWith('/games/dos')) {
    crumbs.push({ label: 'Games', to: '/games' })
    crumbs.push({ label: 'DOS Games', to: pathname === '/games/dos' ? undefined : '/games/dos' })
    const DOS_LABELS = {
      '/games/dos/tetris':         'Tetris',
      '/games/dos/snake':          'Snake',
      '/games/dos/minesweeper':    'Minesweeper',
      '/games/dos/breakout':       'Breakout',
      '/games/dos/space-invaders': 'Space Invaders',
      '/games/dos/pong':           'Pong',
    }
    const dosLabel = DOS_LABELS[pathname]
    if (dosLabel) crumbs.push({ label: dosLabel })
  } else if (pathname.startsWith('/games')) {
    crumbs.push({ label: 'Games', to: pathname === '/games' ? undefined : '/games' })
    const GAME_LABELS = {
      '/games/tic-tac-toe':     'Tic Tac Toe',
      '/games/ludo':            'Ludo',
      '/games/questions':       'Questions',
      '/games/brands':          'Brands',
      '/games/hangman':         'Hangman',
      '/games/word-scramble':   'Word Scramble',
      '/games/crossword':       'Crossword',
      '/games/word-chain':      'Word Chain',
      '/games/simon-says':      'Simon Says',
      '/games/memory-match':    'Memory Match',
      '/games/sequence-recall': 'Sequence Recall',
      '/games/quiz-bowl':       'Quiz Bowl',
      '/games/flag-quiz':       'Flag Quiz',
      '/games/true-false':      'True or False',
      '/games/sudoku':          'Sudoku',
      '/games/2048':            '2048',
      '/games/sliding-puzzle':  'Sliding Puzzle',
      '/games/pictionary':      'Pictionary',
      '/games/kakuro':          'Kakuro',
      '/games/killer-kakuro':   'Killer Kakuro',
    }
    const gameLabel = GAME_LABELS[pathname]
    if (gameLabel) crumbs.push({ label: gameLabel })
  } else if (pathname.startsWith('/therapy')) {
    crumbs.push({ label: 'Therapy', to: undefined })
    if (profile) {
      const name = profile.firstName + (profile.lastName ? ` ${profile.lastName}` : '')
      crumbs.push({ label: name })
    }
  } else if (pathname.startsWith('/learning')) {
    const isProfilePicker = pathname === '/learning'
    crumbs.push({ label: 'Learning', to: isProfilePicker ? undefined : `/learning/${profileId}` })

    if (profile) {
      const name = profile.firstName + (profile.lastName ? ` ${profile.lastName}` : '')
      const onSpellings   = pathname.endsWith('/spellings')
      const onTamil       = pathname.endsWith('/tamil')
      const onThirukkural = pathname.endsWith('/thirukkural')

      const hasSubpage = onSpellings || onTamil || onThirukkural
      crumbs.push({
        label: name,
        to: hasSubpage ? `/learning/${profile.id}` : undefined,
      })

      if (onSpellings) {
        crumbs.push({ label: 'Spellings' })
      } else if (onTamil) {
        crumbs.push({ label: 'Tamil' })
      } else if (onThirukkural) {
        crumbs.push({ label: 'Tamil', to: `/learning/${profile.id}/tamil` })
        crumbs.push({ label: 'Thirukkural' })
      }
    }
  }

  return crumbs
}

export default function Breadcrumb({ inline = false }) {
  const { pathname } = useLocation()
  const { profileId } = useParams()
  const { data } = useQuery(GET_PROFILES, { skip: !profileId })
  const profile = profileId ? (data?.profiles ?? []).find(p => p.id === profileId) : null

  const crumbs = buildCrumbs(pathname, profile, profileId)

  return (
    <nav className={`breadcrumb${inline ? ' breadcrumb--inline' : ''}`} aria-label="breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={i} className="crumb-item">
          {i > 0 && <span className="crumb-sep">›</span>}
          {crumb.to
            ? <Link to={crumb.to} className="crumb-link">{crumb.label}</Link>
            : <span className="crumb-current">{crumb.label}</span>
          }
        </span>
      ))}
    </nav>
  )
}
