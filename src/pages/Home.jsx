import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_PROFILES, CREATE_PROFILE, UPDATE_PROFILE, DELETE_PROFILE } from '../apollo/queries'
import './Home.css'

const AVATAR_COLORS = ['#646cff', '#4ade80', '#f59e0b', '#60a5fa', '#a78bfa', '#f87171', '#34d399']

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function initials(p) {
  return (p.firstName[0] + (p.lastName?.[0] ?? '')).toUpperCase()
}

function formatDob(str) {
  if (!str) return null
  const [y, m, d] = str.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`
}

const EMPTY = { firstName: '', lastName: '', dateOfBirth: '', email: '' }

export default function Home() {
  const navigate = useNavigate()

  const [showAddForm, setShowAddForm]     = useState(false)
  const [addForm, setAddForm]             = useState(EMPTY)
  const [addError, setAddError]           = useState(null)
  const [isAdding, setIsAdding]           = useState(false)

  const [editingId, setEditingId]         = useState(null)
  const [editForm, setEditForm]           = useState(EMPTY)
  const [editError, setEditError]         = useState(null)
  const [isSaving, setIsSaving]           = useState(false)

  const [confirmingDelete, setConfirmingDelete] = useState(null)
  const deleteTimerRef = useRef(null)
  useEffect(() => () => clearTimeout(deleteTimerRef.current), [])

  const { data, loading } = useQuery(GET_PROFILES)
  const [createProfile] = useMutation(CREATE_PROFILE, { refetchQueries: [{ query: GET_PROFILES }] })
  const [updateProfile] = useMutation(UPDATE_PROFILE, { refetchQueries: [{ query: GET_PROFILES }] })
  const [deleteProfile] = useMutation(DELETE_PROFILE, { refetchQueries: [{ query: GET_PROFILES }] })

  const profiles = data?.profiles ?? []

  // ── Add ──────────────────────────────────────────────────────────────────────
  function addField(k, v) { setAddForm(f => ({ ...f, [k]: v })); setAddError(null) }

  async function handleAdd(e) {
    e.preventDefault()
    if (!addForm.firstName.trim()) { setAddError('First name is required.'); return }
    setIsAdding(true); setAddError(null)
    try {
      await createProfile({ variables: {
        firstName:   addForm.firstName.trim(),
        lastName:    addForm.lastName.trim()  || null,
        dateOfBirth: addForm.dateOfBirth      || null,
        email:       addForm.email.trim()     || null,
      }})
      setAddForm(EMPTY); setShowAddForm(false)
    } catch { setAddError('Failed to create profile.') }
    finally   { setIsAdding(false) }
  }

  // ── Edit ─────────────────────────────────────────────────────────────────────
  function openEdit(e, p) {
    e.stopPropagation()
    setEditingId(p.id)
    setEditForm({ firstName: p.firstName, lastName: p.lastName ?? '', dateOfBirth: p.dateOfBirth ?? '', email: p.email ?? '' })
    setEditError(null)
    setShowAddForm(false)
  }

  function editField(k, v) { setEditForm(f => ({ ...f, [k]: v })); setEditError(null) }

  async function handleSave(e) {
    e.preventDefault()
    if (!editForm.firstName.trim()) { setEditError('First name is required.'); return }
    setIsSaving(true); setEditError(null)
    try {
      await updateProfile({ variables: {
        id:          editingId,
        firstName:   editForm.firstName.trim(),
        lastName:    editForm.lastName.trim()  || null,
        dateOfBirth: editForm.dateOfBirth      || null,
        email:       editForm.email.trim()     || null,
      }})
      setEditingId(null)
    } catch { setEditError('Failed to update profile.') }
    finally   { setIsSaving(false) }
  }

  // ── Delete ───────────────────────────────────────────────────────────────────
  function handleDelete(e, id) {
    e.stopPropagation()
    if (confirmingDelete === id) {
      clearTimeout(deleteTimerRef.current)
      setConfirmingDelete(null)
      deleteProfile({ variables: { id } })
      if (editingId === id) setEditingId(null)
    } else {
      setConfirmingDelete(id)
      clearTimeout(deleteTimerRef.current)
      deleteTimerRef.current = setTimeout(() => setConfirmingDelete(null), 2500)
    }
  }

  return (
    <div className="home">
      <div className="home-header">
        <div>
          <h1>IAM</h1>
          <p>Select a profile to continue</p>
        </div>
        {!showAddForm && (
          <button className="add-profile-btn-inline" onClick={() => { setShowAddForm(true); setEditingId(null) }}>
            + Add Profile
          </button>
        )}
      </div>

      {loading ? (
        <p className="home-msg">Loading profiles…</p>
      ) : (
        <div className="profile-list">

          {profiles.length === 0 && !showAddForm && (
            <p className="home-msg">No profiles yet. Add one to get started.</p>
          )}

          {profiles.map(p => {
            const color   = avatarColor(p.firstName)
            const isConf  = confirmingDelete === p.id
            const isEditing = editingId === p.id
            return (
              <div key={p.id} className="profile-card-wrap">
                <div
                  className={`profile-card${isEditing ? ' profile-card--editing' : ''}`}
                  onClick={() => !isEditing && navigate(`/dashboard/${p.id}`)}
                >
                  <div className="profile-avatar" style={{ background: color }}>
                    {initials(p)}
                  </div>
                  <div className="profile-info">
                    <span className="profile-name">{p.firstName}{p.lastName ? ` ${p.lastName}` : ''}</span>
                    {p.dateOfBirth && <span className="profile-meta">Born {formatDob(p.dateOfBirth)}</span>}
                    {p.email       && <span className="profile-meta">{p.email}</span>}
                  </div>
                  <div className="profile-actions">
                    <button
                      className={`profile-action-btn${isEditing ? ' active' : ''}`}
                      onClick={e => isEditing ? (e.stopPropagation(), setEditingId(null)) : openEdit(e, p)}
                      title={isEditing ? 'Cancel edit' : 'Edit profile'}
                    >
                      {isEditing ? '✕' : '✎'}
                    </button>
                    <button
                      className={`profile-action-btn profile-action-btn--delete${isConf ? ' confirming' : ''}`}
                      onClick={e => handleDelete(e, p.id)}
                      title={isConf ? 'Click again to confirm' : 'Delete profile'}
                    >
                      {isConf ? '✓' : '🗑'}
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <form className="profile-edit-form" onSubmit={handleSave} onClick={e => e.stopPropagation()}>
                    {editError && <p className="form-error">{editError}</p>}
                    <div className="form-row">
                      <div className="form-field">
                        <label className="form-label">First Name <span className="required">*</span></label>
                        <input className="form-input" value={editForm.firstName} onChange={e => editField('firstName', e.target.value)} autoFocus />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Last Name</label>
                        <input className="form-input" value={editForm.lastName} onChange={e => editField('lastName', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label className="form-label">Date of Birth</label>
                        <input className="form-input form-input--date" type="date" value={editForm.dateOfBirth} onChange={e => editField('dateOfBirth', e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Email</label>
                        <input className="form-input" type="email" value={editForm.email} onChange={e => editField('email', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="button" className="form-cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                      <button type="submit" className="form-submit-btn" disabled={isSaving}>
                        {isSaving ? 'Saving…' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )
          })}

          {showAddForm && (
            <form className="profile-add-form" onSubmit={handleAdd}>
              <h3 className="form-title">New Profile</h3>
              {addError && <p className="form-error">{addError}</p>}
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">First Name <span className="required">*</span></label>
                  <input className="form-input" value={addForm.firstName} onChange={e => addField('firstName', e.target.value)} autoFocus />
                </div>
                <div className="form-field">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" value={addForm.lastName} onChange={e => addField('lastName', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Date of Birth</label>
                  <input className="form-input form-input--date" type="date" value={addForm.dateOfBirth} onChange={e => addField('dateOfBirth', e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={addForm.email} onChange={e => addField('email', e.target.value)} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="form-cancel-btn" onClick={() => { setShowAddForm(false); setAddForm(EMPTY); setAddError(null) }}>Cancel</button>
                <button type="submit" className="form-submit-btn" disabled={isAdding || !addForm.firstName.trim()}>
                  {isAdding ? 'Creating…' : 'Create Profile'}
                </button>
              </div>
            </form>
          )}

        </div>
      )}
    </div>
  )
}
