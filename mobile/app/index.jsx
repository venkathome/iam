import { useState, useRef, useEffect } from 'react'
import {
  View, Text, Pressable, FlatList, Modal, TextInput, StyleSheet,
  SafeAreaView, ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_PROFILES, CREATE_PROFILE, UPDATE_PROFILE, DELETE_PROFILE } from '../src/apollo/queries'
import { useProfile } from '../src/context/ProfileContext'

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── ProfileModal (create + edit) ──────────────────────────────────────────────

const EMPTY = { firstName: '', lastName: '', dateOfBirth: '', email: '' }

function ProfileModal({ visible, onClose, existing }) {
  const isEdit = !!existing
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (visible) {
      setForm(isEdit
        ? { firstName: existing.firstName, lastName: existing.lastName ?? '', dateOfBirth: existing.dateOfBirth ?? '', email: existing.email ?? '' }
        : EMPTY
      )
      setError(null)
    }
  }, [visible])

  const [createProfile] = useMutation(CREATE_PROFILE, { refetchQueries: [{ query: GET_PROFILES }] })
  const [updateProfile] = useMutation(UPDATE_PROFILE, { refetchQueries: [{ query: GET_PROFILES }] })

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); setError(null) }

  async function submit() {
    if (!form.firstName.trim()) { setError('First name is required.'); return }
    setSubmitting(true)
    try {
      if (isEdit) {
        await updateProfile({
          variables: {
            id:          existing.id,
            firstName:   form.firstName.trim(),
            lastName:    form.lastName.trim() || null,
            dateOfBirth: form.dateOfBirth || null,
            email:       form.email.trim() || null,
          },
        })
      } else {
        await createProfile({
          variables: {
            firstName:   form.firstName.trim(),
            lastName:    form.lastName.trim() || null,
            dateOfBirth: form.dateOfBirth || null,
            email:       form.email.trim() || null,
          },
        })
      }
      onClose()
    } catch {
      setError(isEdit ? 'Failed to update profile.' : 'Failed to create profile.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onRequestClose={onClose}>
      <SafeAreaView style={m.root}>
        <View style={m.nav}>
          <Pressable onPress={onClose}><Text style={m.cancel}>Cancel</Text></Pressable>
          <Text style={m.title}>{isEdit ? 'Edit Profile' : 'New Profile'}</Text>
          <Pressable onPress={submit} disabled={submitting}>
            <Text style={[m.save, submitting && { opacity: 0.5 }]}>
              {submitting ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save' : 'Create')}
            </Text>
          </Pressable>
        </View>
        <View style={m.body}>
          {error && <Text style={m.error}>{error}</Text>}
          <View style={m.row}>
            <View style={[m.field, { flex: 1 }]}>
              <Text style={m.label}>First Name *</Text>
              <TextInput style={m.input} value={form.firstName} onChangeText={v => set('firstName', v)} autoFocus />
            </View>
            <View style={[m.field, { flex: 1 }]}>
              <Text style={m.label}>Last Name</Text>
              <TextInput style={m.input} value={form.lastName} onChangeText={v => set('lastName', v)} />
            </View>
          </View>
          <View style={m.row}>
            <View style={[m.field, { flex: 1 }]}>
              <Text style={m.label}>Date of Birth</Text>
              <TextInput style={m.input} value={form.dateOfBirth} onChangeText={v => set('dateOfBirth', v)} placeholder="YYYY-MM-DD" placeholderTextColor="#555" />
            </View>
            <View style={[m.field, { flex: 1 }]}>
              <Text style={m.label}>Email</Text>
              <TextInput style={m.input} value={form.email} onChangeText={v => set('email', v)} keyboardType="email-address" autoCapitalize="none" />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}
const m = StyleSheet.create({
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

// ── Home Screen ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter()
  const { setProfile } = useProfile()

  const [modalVisible, setModalVisible] = useState(false)
  const [editingProfile, setEditingProfile] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(null)
  const deleteTimerRef = useRef(null)

  useEffect(() => () => clearTimeout(deleteTimerRef.current), [])

  const { data, loading } = useQuery(GET_PROFILES)
  const [deleteProfile] = useMutation(DELETE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILES }],
  })
  const profiles = data?.profiles ?? []

  function openCreate() { setEditingProfile(null); setModalVisible(true) }
  function openEdit(p)  { setEditingProfile(p);    setModalVisible(true) }

  function handleDelete(id) {
    if (confirmingDelete === id) {
      clearTimeout(deleteTimerRef.current)
      setConfirmingDelete(null)
      deleteProfile({ variables: { id } })
    } else {
      setConfirmingDelete(id)
      clearTimeout(deleteTimerRef.current)
      deleteTimerRef.current = setTimeout(() => setConfirmingDelete(null), 2500)
    }
  }

  function handleSelect(p) {
    setProfile(p)
    router.push('/dashboard')
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />

      <View style={s.header}>
        <View>
          <Text style={s.appName}>IAM</Text>
          <Text style={s.subtitle}>Select a profile to continue</Text>
        </View>
        <Pressable style={s.addBtn} onPress={openCreate}>
          <Ionicons name="person-add-outline" size={16} color="#646cff" />
          <Text style={s.addBtnText}>Add Profile</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={s.center}><ActivityIndicator color="#646cff" /></View>
      ) : profiles.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="people-outline" size={48} color="#333" />
          <Text style={s.empty}>No profiles yet</Text>
          <Pressable style={s.createFirstBtn} onPress={openCreate}>
            <Text style={s.createFirstText}>Create your first profile</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={p => p.id}
          contentContainerStyle={s.list}
          renderItem={({ item: p }) => {
            const color  = avatarColor(p.firstName)
            const isConf = confirmingDelete === p.id
            return (
              <Pressable style={s.card} onPress={() => handleSelect(p)}>
                <View style={[s.avatar, { backgroundColor: color }]}>
                  <Text style={s.avatarText}>{initials(p)}</Text>
                </View>

                <View style={s.info}>
                  <Text style={s.name}>{p.firstName}{p.lastName ? ` ${p.lastName}` : ''}</Text>
                  {p.dateOfBirth && <Text style={s.meta}>Born {formatDob(p.dateOfBirth)}</Text>}
                  {p.email && <Text style={s.meta}>{p.email}</Text>}
                </View>

                <View style={s.actions}>
                  <Pressable
                    style={s.iconBtn}
                    onPress={e => { e.stopPropagation?.(); openEdit(p) }}
                    hitSlop={8}
                  >
                    <Ionicons name="pencil-outline" size={16} color="#888" />
                  </Pressable>
                  <Pressable
                    style={[s.iconBtn, isConf && s.iconBtnDanger]}
                    onPress={e => { e.stopPropagation?.(); handleDelete(p.id) }}
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={16} color={isConf ? '#ef4444' : '#888'} />
                  </Pressable>
                </View>
              </Pressable>
            )
          }}
        />
      )}

      <ProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        existing={editingProfile}
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: '#0f0f0f' },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 12 },
  appName:         { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: 1 },
  subtitle:        { color: '#888', fontSize: 14, marginTop: 2 },
  addBtn:          { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(100,108,255,0.12)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(100,108,255,0.3)' },
  addBtnText:      { color: '#646cff', fontWeight: '600', fontSize: 13 },
  center:          { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  empty:           { color: '#666', fontSize: 16 },
  createFirstBtn:  { backgroundColor: '#646cff', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  createFirstText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  list:            { padding: 16, gap: 10 },
  card:            { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 16, padding: 14, gap: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  avatar:          { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  avatarText:      { color: '#fff', fontWeight: '800', fontSize: 17 },
  info:            { flex: 1 },
  name:            { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 2 },
  meta:            { color: '#888', fontSize: 12 },
  actions:         { flexDirection: 'row', gap: 4 },
  iconBtn:         { padding: 8, borderRadius: 8, backgroundColor: '#252525' },
  iconBtnDanger:   { backgroundColor: 'rgba(239,68,68,0.15)' },
})
