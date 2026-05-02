import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { GET_PROFILES } from '../apollo/queries'
import './Dashboard.css'

const AVATAR_COLORS = ['#646cff', '#4ade80', '#f59e0b', '#60a5fa', '#a78bfa', '#f87171', '#34d399']

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function initials(p) {
  return (p.firstName[0] + (p.lastName?.[0] ?? '')).toUpperCase()
}

function RecipesIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="22" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      <rect x="12" y="4" width="16" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="15" y1="13" x2="25" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="18" x2="25" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="23" x2="21" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function FamilyTreeIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="20" y1="11.5" x2="20" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="10" y1="18" x2="30" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="10" y1="18" x2="10" y2="24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="30" y1="18" x2="30" y2="24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="10" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="30" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  )
}

function LearningIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,6 36,14 20,22 4,14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 17 L9 28 Q9 33 20 33 Q31 33 31 28 L31 17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function DiaryIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 9 C5 7.3 6.3 6 8 6 L18 6 L18 34 L8 34 C6.3 34 5 32.7 5 31 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="20" y1="6" x2="20" y2="34" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M22 6 L32 6 C33.7 6 35 7.3 35 9 L35 31 C35 32.7 33.7 34 32 34 L22 34 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="25" y1="13" x2="32" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="25" y1="18" x2="32" y2="18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="25" y1="23" x2="29" y2="23" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function GamesIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="5" y1="15" x2="35" y2="15" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="5" y1="25" x2="35" y2="25" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="15" y1="5" x2="15" y2="35" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="25" y1="5" x2="25" y2="35" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  )
}

function TherapyIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="20" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      {/* Torso */}
      <line x1="20" y1="13" x2="20" y2="22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      {/* Arms resting on knees */}
      <path d="M20 17 L13 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M20 17 L27 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      {/* Cross-legged lower body */}
      <path d="M20 22 C17 24 11 25 8 29" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M20 22 C23 24 29 25 32 29" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      {/* Ground line */}
      <line x1="7" y1="31" x2="33" y2="31" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

const TILES = [
  { label: 'Recipes',     icon: RecipesIcon,    color: '#646cff', bg: 'rgba(100,108,255,0.08)', border: 'rgba(100,108,255,0.3)', route: () => '/recipes',         profileFilter: null },
  { label: 'Family Tree', icon: FamilyTreeIcon, color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.3)',  route: () => '/family-tree',     profileFilter: p => p.firstName === 'Home' },
  { label: 'Learning',    icon: LearningIcon,   color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.3)',  route: id => `/learning/${id}`,  profileFilter: null },
  { label: 'Diary',       icon: DiaryIcon,      color: '#c47a20', bg: 'rgba(196,122,32,0.08)',  border: 'rgba(196,122,32,0.3)',  route: () => '/diary',           profileFilter: null },
  { label: 'Games',       icon: GamesIcon,      color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.3)', route: () => '/games',           profileFilter: null },
  { label: 'Therapy',     icon: TherapyIcon,    color: '#14b8a6', bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.3)', route: id => `/therapy/${id}`,   profileFilter: p => p.firstName === 'Diya' && p.lastName === 'Venkataraman' },
]

export default function Dashboard() {
  const { profileId } = useParams()
  const navigate = useNavigate()

  const { data, loading } = useQuery(GET_PROFILES)
  const profiles = data?.profiles ?? []
  const profile  = profiles.find(p => p.id === profileId) ?? null

  if (!loading && !profile) {
    navigate('/', { replace: true })
    return null
  }

  const color = profile ? avatarColor(profile.firstName) : '#646cff'

  return (
    <div className="dashboard">
      {profile && (
        <button className="profile-switch-btn" onClick={() => navigate('/')} title="Switch profile">
          <span className="profile-switch-avatar" style={{ background: color }}>
            {initials(profile)}
          </span>
          <span className="profile-switch-name">
            {profile.firstName}{profile.lastName ? ` ${profile.lastName}` : ''}
          </span>
          <span className="profile-switch-caret">▾</span>
        </button>
      )}

      <h1>IAM</h1>
      <p>What would you like to do?</p>

      <div className="dashboard-apps">
        {TILES.filter(t => !t.profileFilter || (profile && t.profileFilter(profile))).map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.label}
              className="app-tile"
              style={{ '--tile-color': t.color, '--tile-bg': t.bg, '--tile-border': t.border }}
              onClick={() => navigate(t.route(profileId))}
            >
              <Icon />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
