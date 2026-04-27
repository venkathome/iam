import { useState, useRef, useEffect } from 'react'
import {
  View, Text, FlatList, Pressable, StyleSheet, SafeAreaView,
  Modal, TextInput, Alert, ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_PROFILES, CREATE_PROFILE, DELETE_PROFILE } from '../../src/apollo/queries'
import { Ionicons } from '@expo/vector-icons'

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

// ── CreateProfileModal ────────────────────────────────────────────────────────

const EMPTY = { firstName: '', lastName: '', dateOfBirth: '', email: '' }

function CreateProfileModal({ visible, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [createProfile] = useMutation(CREATE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILES }],
  })

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); setError(null) }

  async function submit() {
    if (!form.firstName.trim()) { setError('First name is required.'); return }
    setSubmitting(true)
    try {
      await createProfile({
        variables: {
          firstName:   form.firstName.trim(),
          lastName:    form.lastName.trim() || null,
          dateOfBirth: form.dateOfBirth || null,
          email:       form.email.trim() || null,
        },
      })
      setForm(EMPTY)
      onClose()
    } catch {
      setError('Failed to create profile. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onRequestClose={onClose}>
      <SafeAreaView style={cp.root}>
        <View style={cp.nav}>
          <Pressable onPress={onClose}><Text style={cp.cancel}>Cancel</Text></Pressable>
          <Text style={cp.title}>New Profile</Text>
          <Pressable onPress={submit} disabled={submitting}>
            <Text style={[cp.save, submitting && { opacity: 0.5 }]}>{submitting ? 'Creating…' : 'Create'}</Text>
          </Pressable>
        </View>

        <View style={cp.body}>
          {error && <Text style={cp.error}>{error}</Text>}

          <View style={cp.row}>
            <View style={[cp.field, { flex: 1 }]}>
              <Text style={cp.label}>First Name *</Text>
              <TextInput style={cp.input} value={form.firstName} onChangeText={v => set('firstName', v)} autoFocus />
            </View>
            <View style={[cp.field, { flex: 1 }]}>
              <Text style={cp.label}>Last Name</Text>
              <TextInput style={cp.input} value={form.lastName} onChangeText={v => set('lastName', v)} />
            </View>
          </View>

          <View style={cp.row}>
            <View style={[cp.field, { flex: 1 }]}>
              <Text style={cp.label}>Date of Birth</Text>
              <TextInput style={cp.input} value={form.dateOfBirth} onChangeText={v => set('dateOfBirth', v)} placeholder="YYYY-MM-DD" placeholderTextColor="#555" />
            </View>
            <View style={[cp.field, { flex: 1 }]}>
              <Text style={cp.label}>Email</Text>
              <TextInput style={cp.input} value={form.email} onChangeText={v => set('email', v)} keyboardType="email-address" autoCapitalize="none" />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}
const cp = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#0f0f0f' },
  nav:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  title:  { color: '#fff', fontSize: 17, fontWeight: '600' },
  cancel: { color: '#888', fontSize: 15 },
  save:   { color: '#646cff', fontSize: 15, fontWeight: '700' },
  body:   { padding: 16 },
  error:  { color: '#ef4444', fontSize: 13, marginBottom: 12, backgroundColor: 'rgba(239,68,68,0.1)', padding: 10, borderRadius: 8 },
  row:    { flexDirection: 'row', gap: 10, marginBottom: 14 },
  field:  {},
  label:  { color: '#888', fontSize: 12, marginBottom: 4 },
  input:  { backgroundColor: '#1e1e1e', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#333' },
})

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function LearningScreen() {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(null)
  const deleteTimerRef = useRef(null)

  useEffect(() => () => clearTimeout(deleteTimerRef.current), [])

  const { data, loading } = useQuery(GET_PROFILES)
  const [deleteProfile] = useMutation(DELETE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILES }],
  })

  const profiles = data?.profiles ?? []

  function handleDeleteClick(id) {
    if (confirmingDelete === id) {
      clearTimeout(deleteTimerRef.current)
      setConfirmingDelete(null)
      deleteProfile({ variables: { id } })
    } else {
      setConfirmingDelete(id)
      clearTimeout(deleteTimerRef.current)
      deleteTimerRef.current = setTimeout(() => setConfirmingDelete(null), 2000)
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <View>
          <Text style={s.title}>Learning</Text>
          <Text style={s.subtitle}>Select a profile to continue.</Text>
        </View>
        <Pressable style={s.addBtn} onPress={() => setShowCreate(true)}>
          <Ionicons name="person-add-outline" size={16} color="#f59e0b" />
          <Text style={s.addBtnText}>Add Profile</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color="#f59e0b" />
        </View>
      ) : profiles.length === 0 ? (
        <View style={s.center}>
          <Text style={s.empty}>No profiles yet.</Text>
          <Pressable style={s.createFirstBtn} onPress={() => setShowCreate(true)}>
            <Text style={s.createFirstText}>Create your first profile</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={p => p.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item: p }) => {
            const color    = avatarColor(p.firstName)
            const isConf   = confirmingDelete === p.id
            return (
              <Pressable
                style={s.card}
                onPress={() => router.push(`/learning/${p.id}`)}
              >
                <View style={[s.avatar, { backgroundColor: color }]}>
                  <Text style={s.avatarText}>{initials(p)}</Text>
                </View>
                <View style={s.info}>
                  <Text style={s.name}>
                    {p.firstName}{p.lastName ? ` ${p.lastName}` : ''}
                  </Text>
                  {p.dateOfBirth && (
                    <Text style={s.meta}>Born {formatDob(p.dateOfBirth)}</Text>
                  )}
                  {p.email && <Text style={s.meta}>{p.email}</Text>}
                </View>
                <Pressable
                  style={[s.delBtn, isConf && s.delBtnConf]}
                  onPress={e => { e.stopPropagation?.(); handleDeleteClick(p.id) }}
                  hitSlop={8}
                >
                  <Text style={[s.delBtnText, isConf && s.delBtnTextConf]}>
                    {isConf ? '✓ Confirm' : '×'}
                  </Text>
                </Pressable>
              </Pressable>
            )
          }}
        />
      )}

      <CreateProfileModal visible={showCreate} onClose={() => setShowCreate(false)} />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: '#0f0f0f' },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title:           { color: '#fff', fontSize: 22, fontWeight: '700' },
  subtitle:        { color: '#888', fontSize: 13, marginTop: 2 },
  addBtn:          { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(245,158,11,0.12)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  addBtnText:      { color: '#f59e0b', fontWeight: '600', fontSize: 13 },
  center:          { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  empty:           { color: '#888', fontSize: 16 },
  createFirstBtn:  { backgroundColor: '#f59e0b', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  createFirstText: { color: '#0f0f0f', fontWeight: '700', fontSize: 15 },
  card:            { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 16, padding: 14, gap: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  avatar:          { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarText:      { color: '#fff', fontWeight: '800', fontSize: 18 },
  info:            { flex: 1 },
  name:            { color: '#fff', fontSize: 17, fontWeight: '600', marginBottom: 2 },
  meta:            { color: '#888', fontSize: 12 },
  delBtn:          { padding: 8, borderRadius: 8 },
  delBtnConf:      { backgroundColor: 'rgba(239,68,68,0.15)' },
  delBtnText:      { color: '#555', fontSize: 20 },
  delBtnTextConf:  { color: '#ef4444', fontSize: 12, fontWeight: '700' },
})
