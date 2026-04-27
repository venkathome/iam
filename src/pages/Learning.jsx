import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_PROFILES, CREATE_PROFILE, DELETE_PROFILE } from '../apollo/queries'
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

function formatDob(str) {
  if (!str) return null
  const [y, m, d] = str.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`
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
      <line x1="30" y1="27" x2="32" y2="29" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="31" y1="29" x2="31" y2="31" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

const EMPTY_FORM = { firstName: '', lastName: '', dateOfBirth: '', email: '' }

export default function Learning() {
  const { profileId } = useParams()
  const navigate = useNavigate()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(null)
  const deleteTimerRef = useRef(null)

  useEffect(() => () => clearTimeout(deleteTimerRef.current), [])

  const { data, loading } = useQuery(GET_PROFILES)
  const [createProfile] = useMutation(CREATE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILES }],
  })
  const [deleteProfile] = useMutation(DELETE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILES }],
  })

  const profiles = data?.profiles ?? []
  const selectedProfile = profileId ? profiles.find(p => p.id === profileId) ?? null : null

  // Redirect if profileId in URL is not found after data loads
  useEffect(() => {
    if (profileId && !loading && data && !selectedProfile) {
      navigate('/learning', { replace: true })
    }
  }, [profileId, loading, data, selectedProfile, navigate])

  function field(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    setFormError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.firstName.trim()) { setFormError('First name is required.'); return }
    setIsSubmitting(true)
    setFormError(null)
    try {
      await createProfile({
        variables: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim() || null,
          dateOfBirth: form.dateOfBirth || null,
          email: form.email.trim() || null,
        },
      })
      setForm(EMPTY_FORM)
      setShowForm(false)
    } catch {
      setFormError('Failed to create profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleDeleteClick(id) {
    if (confirmingDelete === id) {
      clearTimeout(deleteTimerRef.current)
      setConfirmingDelete(null)
      deleteProfile({ variables: { id } })
      if (profileId === id) navigate('/learning', { replace: true })
    } else {
      setConfirmingDelete(id)
      clearTimeout(deleteTimerRef.current)
      deleteTimerRef.current = setTimeout(() => setConfirmingDelete(null), 2000)
    }
  }

  function cancelForm() {
    setShowForm(false)
    setForm(EMPTY_FORM)
    setFormError(null)
  }

  // ── App tiles view (profile selected) ───────────────────────────────────
  if (selectedProfile) {
    const color = avatarColor(selectedProfile.firstName)
    return (
      <div className="learning">
        <Breadcrumb />
        <button
          className="profile-switch-btn"
          onClick={() => navigate('/learning')}
          title="Switch profile"
        >
          <span className="profile-switch-avatar" style={{ background: color }}>
            {initials(selectedProfile)}
          </span>
          <span className="profile-switch-name">
            {selectedProfile.firstName}
            {selectedProfile.lastName ? ` ${selectedProfile.lastName}` : ''}
          </span>
          <span className="profile-switch-caret">▾</span>
        </button>

        <h1>Learning</h1>
        <p>Choose an app to start learning.</p>

        <div className="learning-apps">
          <button
            className="app-tile app-tile-spellings"
            onClick={() => navigate(`/learning/${profileId}/spellings`)}
          >
            <SpellingsIcon />
            <span>Spellings</span>
          </button>
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

  // ── Profile picker view ───────────────────────────────────────────────────
  return (
    <div className="learning learning--picker">
      <Breadcrumb />
      <h1>Learning</h1>
      <p>Select a profile to continue.</p>

      <div className="profile-section">
        {loading ? (
          <p className="profile-msg">Loading profiles…</p>
        ) : profiles.length === 0 && !showForm ? (
          <p className="profile-msg">No profiles yet. Add one below.</p>
        ) : (
          <ul className="profile-list">
            {profiles.map(p => {
              const color = avatarColor(p.firstName)
              const isConfirming = confirmingDelete === p.id
              return (
                <li
                  key={p.id}
                  className="profile-card"
                  onClick={() => navigate(`/learning/${p.id}`)}
                >
                  <div className="profile-avatar" style={{ background: color }}>
                    {initials(p)}
                  </div>
                  <div className="profile-info">
                    <span className="profile-name">
                      {p.firstName}{p.lastName ? ` ${p.lastName}` : ''}
                    </span>
                    {p.dateOfBirth && (
                      <span className="profile-meta">Born {formatDob(p.dateOfBirth)}</span>
                    )}
                    {p.email && (
                      <span className="profile-meta">{p.email}</span>
                    )}
                  </div>
                  <button
                    className={`profile-delete-btn${isConfirming ? ' confirming' : ''}`}
                    onClick={e => { e.stopPropagation(); handleDeleteClick(p.id) }}
                    title={isConfirming ? 'Click again to confirm delete' : 'Delete profile'}
                  >
                    ×
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {!showForm && (
          <button className="add-profile-btn" onClick={() => setShowForm(true)}>
            + Add Profile
          </button>
        )}

        {showForm && (
          <form className="profile-form" onSubmit={handleSubmit}>
            <h3 className="form-title">New Profile</h3>
            {formError && <p className="form-error">{formError}</p>}

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">First Name <span className="required">*</span></label>
                <input
                  className="form-input"
                  type="text"
                  value={form.firstName}
                  onChange={e => field('firstName', e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-field">
                <label className="form-label">Last Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={form.lastName}
                  onChange={e => field('lastName', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Date of Birth</label>
                <input
                  className="form-input form-input--date"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={e => field('dateOfBirth', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={form.email}
                  onChange={e => field('email', e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="form-cancel-btn" onClick={cancelForm}>
                Cancel
              </button>
              <button
                type="submit"
                className="form-submit-btn"
                disabled={isSubmitting || !form.firstName.trim()}
              >
                {isSubmitting ? 'Creating…' : 'Create Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
