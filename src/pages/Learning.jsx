import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { GET_PROFILES } from '../apollo/queries'
import Breadcrumb from '../components/Breadcrumb'
import './Learning.css'

const AVATAR_COLORS = ['#646cff', '#4ade80', '#f59e0b', '#60a5fa', '#a78bfa', '#f87171', '#34d399']

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function initials(profile) {
  return (profile.firstName[0] + (profile.lastName?.[0] ?? '')).toUpperCase()
}

function SpellingsIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 10 Q5 8 7 8 L19 10 L19 34 L7 32 Q5 32 5 30 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M35 10 Q35 8 33 8 L21 10 L21 34 L33 32 Q35 32 35 30 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="19" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="19" y1="34" x2="21" y2="34" stroke="currentColor" strokeWidth="1.8"/>
      <text x="9" y="20" fontSize="7" fill="currentColor" fontFamily="serif" fontWeight="bold">A</text>
      <text x="9" y="28" fontSize="6" fill="currentColor" fontFamily="serif">bc</text>
      <line x1="25" y1="16" x2="31" y2="28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="25" y1="16" x2="27" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="27" y1="14" x2="29" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="29" y1="16" x2="25" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

export default function Learning() {
  const { profileId } = useParams()
  const navigate = useNavigate()

  const { data, loading } = useQuery(GET_PROFILES)
  const profiles = data?.profiles ?? []
  const profile  = profiles.find(p => p.id === profileId) ?? null

  useEffect(() => {
    if (!loading && data && !profile) navigate('/', { replace: true })
  }, [loading, data, profile, navigate])

  if (loading || !profile) return null

  const color = avatarColor(profile.firstName)
  const fullName = `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ''}`
  const showSpellings = ['Diya Venkataraman', 'Sanjana Venkataraman'].includes(fullName)

  return (
    <div className="learning">
      <Breadcrumb />
      <button
        className="profile-switch-btn"
        onClick={() => navigate('/')}
        title="Switch profile"
      >
        <span className="profile-switch-avatar" style={{ background: color }}>
          {initials(profile)}
        </span>
        <span className="profile-switch-name">
          {profile.firstName}{profile.lastName ? ` ${profile.lastName}` : ''}
        </span>
        <span className="profile-switch-caret">▾</span>
      </button>

      <h1>Learning</h1>
      <p>Choose an app to start learning.</p>

      <div className="learning-apps">
        {showSpellings && (
          <button
            className="app-tile app-tile-spellings"
            onClick={() => navigate(`/learning/${profileId}/spellings`)}
          >
            <SpellingsIcon />
            <span>Spellings</span>
          </button>
        )}
        <button
          className="app-tile app-tile-tamil"
          onClick={() => navigate(`/learning/${profileId}/tamil`)}
        >
          <span className="tamil-icon-glyph">த</span>
          <span>Tamil</span>
        </button>
      </div>
    </div>
  )
}
