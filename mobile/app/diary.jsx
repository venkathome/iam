import { useState, useMemo, useEffect, useRef } from 'react'
import {
  View, Text, ScrollView, TextInput, Pressable, StyleSheet,
  Modal, Alert, FlatList, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_EVENT_TYPES = [
  { id: 'personal',    name: 'Personal',     color: '#7c6fe0' },
  { id: 'family',      name: 'Family',       color: '#22c55e' },
  { id: 'work',        name: 'Work',         color: '#3b82f6' },
  { id: 'travel',      name: 'Travel',       color: '#f97316' },
  { id: 'achievement', name: 'Achievement',  color: '#eab308' },
  { id: 'celebration', name: 'Celebration',  color: '#ec4899' },
  { id: 'health',      name: 'Health',       color: '#10b981' },
  { id: 'memory',      name: 'Memory',       color: '#a855f7' },
  { id: 'milestone',   name: 'Milestone',    color: '#f59e0b' },
  { id: 'other',       name: 'Other',        color: '#94a3b8' },
]

const COLOR_PALETTE = [
  '#7c6fe0', '#3b82f6', '#06b6d4', '#10b981', '#22c55e',
  '#84cc16', '#eab308', '#f97316', '#ef4444', '#ec4899',
  '#a855f7', '#f59e0b', '#94a3b8', '#64748b', '#0ea5e9',
  '#d946ef',
]

const MOODS = [
  { label: 'Happy', emoji: '😊' }, { label: 'Excited', emoji: '🤩' },
  { label: 'Grateful', emoji: '🙏' }, { label: 'Content', emoji: '😌' },
  { label: 'Neutral', emoji: '😐' }, { label: 'Anxious', emoji: '😰' },
  { label: 'Sad', emoji: '😔' }, { label: 'Emotional', emoji: '😢' },
  { label: 'Angry', emoji: '😤' },
]
const GROUP_OPTIONS = [
  { value: 'month', label: 'Month & Year' }, { value: 'eventType', label: 'Event Type' },
  { value: 'mood',  label: 'Mood' },          { value: 'person',    label: 'Person' },
  { value: 'tag',   label: 'Tag' },            { value: 'location',  label: 'Location' },
]
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' },
  { value: 'az',     label: 'A→Z' },    { value: 'za',     label: 'Z→A' },
]
const STORAGE_KEY = 'iam-diary'
const ET_KEY      = 'iam-diary-event-types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }
function todayStr() { return new Date().toISOString().slice(0, 10) }
function moodEmoji(label) { return MOODS.find(m => m.label === label)?.emoji ?? '😐' }
function parseTags(val) {
  if (Array.isArray(val)) return val.filter(Boolean)
  if (!val) return []
  return val.split(',').map(s => s.trim()).filter(Boolean)
}
function fmtDate(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtMonthYear(str) {
  if (!str) return ''
  const [y, m] = str.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
function excerpt(text, n = 120) {
  if (!text) return ''
  return text.length > n ? text.slice(0, n) + '…' : text
}

function groupEntries(entries, groupBy) {
  const map = new Map()
  function add(key, entry) {
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(entry)
  }
  for (const e of entries) {
    switch (groupBy) {
      case 'month':     add(fmtMonthYear(e.date), e); break
      case 'eventType': add(e.eventType || 'Other', e); break
      case 'mood':      add(`${moodEmoji(e.mood || 'Neutral')} ${e.mood || 'Neutral'}`, e); break
      case 'person': {
        const p = parseTags(e.people)
        p.length ? p.forEach(n => add(n, e)) : add('Unspecified', e)
        break
      }
      case 'tag': {
        const t = parseTags(e.tags)
        t.length ? t.forEach(tag => add(`# ${tag}`, e)) : add('Untagged', e)
        break
      }
      case 'location': add(e.location || 'Unknown location', e); break
    }
  }
  return map
}

// ── ColorPicker ───────────────────────────────────────────────────────────────

function ColorPicker({ value, onChange }) {
  return (
    <View style={cp.grid}>
      {COLOR_PALETTE.map(c => (
        <Pressable
          key={c}
          style={[cp.swatch, { backgroundColor: c }, value === c && cp.swatchOn]}
          onPress={() => onChange(c)}
        />
      ))}
    </View>
  )
}
const cp = StyleSheet.create({
  grid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  swatch:   { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: 'transparent' },
  swatchOn: { borderColor: '#3d1f06', transform: [{ scale: 1.15 }] },
})

// ── ManageEventTypesModal ─────────────────────────────────────────────────────

function ManageEventTypesModal({ visible, eventTypes, onAdd, onEdit, onDelete, onClose }) {
  const [editingId,    setEditingId]    = useState(null)
  const [editName,     setEditName]     = useState('')
  const [editColor,    setEditColor]    = useState(COLOR_PALETTE[0])
  const [newName,      setNewName]      = useState('')
  const [newColor,     setNewColor]     = useState(COLOR_PALETTE[0])
  const [pendingDelId, setPendingDelId] = useState(null)
  const delTimerRef = useRef(null)

  function startEdit(et) {
    setEditingId(et.id)
    setEditName(et.name)
    setEditColor(et.color)
  }
  function cancelEdit() { setEditingId(null) }
  function saveEdit() {
    const trimmed = editName.trim()
    if (!trimmed) return
    onEdit(editingId, trimmed, editColor)
    setEditingId(null)
  }

  function handleAdd() {
    const trimmed = newName.trim()
    if (!trimmed) return
    onAdd(trimmed, newColor)
    setNewName('')
    setNewColor(COLOR_PALETTE[0])
  }

  function handleDeletePress(id) {
    if (pendingDelId === id) {
      clearTimeout(delTimerRef.current)
      setPendingDelId(null)
      onDelete(id)
    } else {
      setPendingDelId(id)
      delTimerRef.current = setTimeout(() => setPendingDelId(null), 2500)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onRequestClose={onClose}>
      <SafeAreaView style={mt.root}>
        <StatusBar style="light" />
        <View style={mt.nav}>
          <Text style={mt.navTitle}>Event Types</Text>
          <Pressable onPress={onClose}><Text style={mt.navDone}>Done</Text></Pressable>
        </View>

        <ScrollView style={mt.scroll} keyboardShouldPersistTaps="handled">
          {eventTypes.map(et => (
            <View key={et.id}>
              {editingId === et.id ? (
                <View style={mt.editRow}>
                  <View style={mt.editTop}>
                    <View style={[mt.swatch, { backgroundColor: editColor }]} />
                    <TextInput
                      style={mt.nameInput}
                      value={editName}
                      onChangeText={setEditName}
                      autoFocus
                      selectTextOnFocus
                    />
                    <Pressable style={mt.saveBtn} onPress={saveEdit}>
                      <Text style={mt.saveBtnText}>Save</Text>
                    </Pressable>
                    <Pressable style={mt.cancelBtn} onPress={cancelEdit}>
                      <Text style={mt.cancelBtnText}>✕</Text>
                    </Pressable>
                  </View>
                  <ColorPicker value={editColor} onChange={setEditColor} />
                </View>
              ) : (
                <View style={mt.row}>
                  <View style={[mt.swatch, { backgroundColor: et.color }]} />
                  <Text style={mt.rowName}>{et.name}</Text>
                  <Pressable style={mt.iconBtn} onPress={() => startEdit(et)}>
                    <Text style={mt.iconBtnText}>✎</Text>
                  </Pressable>
                  <Pressable
                    style={[mt.iconBtn, mt.delBtn, pendingDelId === et.id && mt.delBtnPending]}
                    onPress={() => handleDeletePress(et.id)}
                  >
                    <Text style={[mt.iconBtnText, mt.delBtnText]}>
                      {pendingDelId === et.id ? 'Confirm' : '🗑'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))}

          <View style={mt.divider} />
          <Text style={mt.addTitle}>Add Event Type</Text>
          <View style={mt.addTop}>
            <View style={[mt.swatch, { backgroundColor: newColor }]} />
            <TextInput
              style={mt.nameInput}
              placeholder="Type name…"
              placeholderTextColor="#b09060"
              value={newName}
              onChangeText={setNewName}
            />
            <Pressable style={mt.saveBtn} onPress={handleAdd}>
              <Text style={mt.saveBtnText}>Add</Text>
            </Pressable>
          </View>
          <ColorPicker value={newColor} onChange={setNewColor} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
const mt = StyleSheet.create({
  root:           { flex: 1, backgroundColor: '#faf7f2' },
  nav:            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#e8dcc8' },
  navTitle:       { color: '#3d1f06', fontSize: 17, fontWeight: '700' },
  navDone:        { color: '#c47a20', fontSize: 16, fontWeight: '600' },
  scroll:         { flex: 1, padding: 16 },
  row:            { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0e8d8' },
  swatch:         { width: 14, height: 14, borderRadius: 7, flexShrink: 0 },
  rowName:        { flex: 1, color: '#3d1f06', fontSize: 15 },
  iconBtn:        { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: '#f0e8d8' },
  iconBtnText:    { color: '#c47a20', fontSize: 13, fontWeight: '600' },
  delBtn:         { backgroundColor: 'rgba(239,68,68,0.1)' },
  delBtnText:     { color: '#ef4444' },
  delBtnPending:  { backgroundColor: '#ef4444' },
  editRow:        { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0e8d8' },
  editTop:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addTop:         { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  nameInput:      { flex: 1, backgroundColor: '#f0e8d8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, color: '#3d1f06', fontSize: 14, borderWidth: 1, borderColor: '#e8dcc8' },
  saveBtn:        { backgroundColor: '#c47a20', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  saveBtnText:    { color: '#fff', fontWeight: '700', fontSize: 13 },
  cancelBtn:      { backgroundColor: '#f0e8d8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
  cancelBtnText:  { color: '#a07840', fontSize: 13, fontWeight: '700' },
  divider:        { height: 1, backgroundColor: '#e8dcc8', marginVertical: 16 },
  addTitle:       { color: '#a07840', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
})

// ── StatsBar ──────────────────────────────────────────────────────────────────

function StatsBar({ entries }) {
  const thisMonth = useMemo(() => {
    const prefix = todayStr().slice(0, 7)
    return entries.filter(e => (e.date || '').startsWith(prefix)).length
  }, [entries])

  const favorites = entries.filter(e => e.isFavorite).length

  const topMood = useMemo(() => {
    const counts = {}
    entries.forEach(e => { if (e.mood) counts[e.mood] = (counts[e.mood] || 0) + 1 })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return top ? top[0] : null
  }, [entries])

  const streak = useMemo(() => {
    if (!entries.length) return 0
    const dates = [...new Set(entries.map(e => e.date))].sort().reverse()
    let s = 0
    let cursor = new Date(); cursor.setHours(0, 0, 0, 0)
    for (const d of dates) {
      const ed = new Date(d + 'T00:00:00')
      const diff = Math.round((cursor - ed) / 86400000)
      if (diff === 0 || diff === 1) { s++; cursor = ed } else break
    }
    return s
  }, [entries])

  const stats = [
    { val: entries.length,                    lbl: 'Total' },
    { val: thisMonth,                         lbl: 'This Month' },
    { val: favorites,                         lbl: 'Favourites' },
    { val: streak,                            lbl: 'Day Streak' },
    ...(topMood ? [{ val: moodEmoji(topMood), lbl: 'Top Mood' }] : []),
  ]

  return (
    <View style={sb.row}>
      {stats.map(({ val, lbl }) => (
        <View key={lbl} style={sb.item}>
          <Text style={sb.val}>{val}</Text>
          <Text style={sb.lbl}>{lbl}</Text>
        </View>
      ))}
    </View>
  )
}
const sb = StyleSheet.create({
  row:  { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14, paddingHorizontal: 8, backgroundColor: 'rgba(196,122,32,0.08)', marginHorizontal: 12, borderRadius: 14, marginBottom: 12 },
  item: { alignItems: 'center' },
  val:  { color: '#c47a20', fontSize: 20, fontWeight: '700' },
  lbl:  { color: '#a07840', fontSize: 10, marginTop: 2 },
})

// ── EntryForm ─────────────────────────────────────────────────────────────────

const BLANK = { title: '', content: '', date: todayStr(), time: '', eventType: 'Personal', mood: 'Neutral', people: '', location: '', tags: '', isFavorite: false }

function EntryForm({ initial, eventTypes, colorMap, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...BLANK,
    ...(initial ?? {}),
    people: Array.isArray(initial?.people) ? initial.people.join(', ') : (initial?.people ?? ''),
    tags:   Array.isArray(initial?.tags)   ? initial.tags.join(', ')   : (initial?.tags   ?? ''),
  }))
  const [showTypePicker, setShowTypePicker] = useState(false)

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  function save() {
    if (!form.title.trim()) { Alert.alert('Required', 'Title is required.'); return }
    onSave({ ...form, title: form.title.trim(), content: form.content.trim(), location: form.location.trim(), people: parseTags(form.people), tags: parseTags(form.tags) })
  }

  return (
    <Modal visible animationType="slide" presentationStyle="formSheet" onRequestClose={onCancel}>
      <SafeAreaView style={ef.root}>
        <StatusBar style="light" />
        <View style={ef.nav}>
          <Pressable onPress={onCancel}><Text style={ef.navCancel}>Cancel</Text></Pressable>
          <Text style={ef.navTitle}>{initial ? 'Edit Entry' : 'New Entry'}</Text>
          <Pressable onPress={save}><Text style={ef.navSave}>Save</Text></Pressable>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView style={ef.scroll} keyboardShouldPersistTaps="handled">

            <TextInput
              style={ef.titleInput}
              placeholder="What's this entry about?"
              placeholderTextColor="#7a5030"
              value={form.title}
              onChangeText={v => set('title', v)}
              autoFocus
            />

            <View style={ef.row}>
              <View style={ef.fieldHalf}>
                <Text style={ef.label}>Date</Text>
                <TextInput style={ef.input} value={form.date} onChangeText={v => set('date', v)} placeholder="YYYY-MM-DD" placeholderTextColor="#7a5030" />
              </View>
              <View style={ef.fieldHalf}>
                <Text style={ef.label}>Time</Text>
                <TextInput style={ef.input} value={form.time} onChangeText={v => set('time', v)} placeholder="HH:MM" placeholderTextColor="#7a5030" />
              </View>
            </View>

            <View style={ef.row}>
              <Pressable style={[ef.fieldHalf, { flex: 1 }]} onPress={() => setShowTypePicker(true)}>
                <Text style={ef.label}>Event Type</Text>
                <View style={[ef.input, ef.pickerRow]}>
                  <View style={[ef.typeColorDot, { backgroundColor: colorMap[form.eventType] || '#94a3b8' }]} />
                  <Text style={ef.pickerText}>{form.eventType}</Text>
                  <Ionicons name="chevron-down" size={14} color="#a07840" />
                </View>
              </Pressable>
              <View style={ef.fieldHalf}>
                <Text style={ef.label}>Location</Text>
                <TextInput style={ef.input} value={form.location} onChangeText={v => set('location', v)} placeholder="Where?" placeholderTextColor="#7a5030" />
              </View>
            </View>

            <Text style={ef.label}>How are you feeling?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <View style={ef.moodRow}>
                {MOODS.map(m => (
                  <Pressable
                    key={m.label}
                    style={[ef.moodBtn, form.mood === m.label && ef.moodBtnOn]}
                    onPress={() => set('mood', m.label)}
                  >
                    <Text style={ef.moodEmoji}>{m.emoji}</Text>
                    <Text style={[ef.moodLabel, form.mood === m.label && ef.moodLabelOn]}>{m.label}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <Text style={ef.label}>Your thoughts…</Text>
            <TextInput
              style={ef.textarea}
              placeholder="What happened? How did you feel?"
              placeholderTextColor="#7a5030"
              value={form.content}
              onChangeText={v => set('content', v)}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />

            <View style={ef.row}>
              <View style={ef.fieldHalf}>
                <Text style={ef.label}>People</Text>
                <TextInput style={ef.input} value={form.people} onChangeText={v => set('people', v)} placeholder="Alice, Bob, …" placeholderTextColor="#7a5030" />
              </View>
              <View style={ef.fieldHalf}>
                <Text style={ef.label}>Tags</Text>
                <TextInput style={ef.input} value={form.tags} onChangeText={v => set('tags', v)} placeholder="vacation, …" placeholderTextColor="#7a5030" />
              </View>
            </View>

            <Pressable style={ef.favRow} onPress={() => set('isFavorite', !form.isFavorite)}>
              <Text style={ef.favStar}>{form.isFavorite ? '★' : '☆'}</Text>
              <Text style={ef.favText}>Mark as favourite</Text>
            </Pressable>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Type picker */}
        <Modal visible={showTypePicker} transparent animationType="slide" onRequestClose={() => setShowTypePicker(false)}>
          <View style={ef.pickerOverlay}>
            <View style={ef.pickerSheet}>
              <View style={ef.pickerNav}>
                <Text style={ef.pickerNavTitle}>Event Type</Text>
                <Pressable onPress={() => setShowTypePicker(false)}>
                  <Text style={ef.pickerNavDone}>Done</Text>
                </Pressable>
              </View>
              {eventTypes.map(et => (
                <Pressable key={et.id} style={ef.pickerItem} onPress={() => { set('eventType', et.name); setShowTypePicker(false) }}>
                  <View style={[ef.typeColor, { backgroundColor: et.color }]} />
                  <Text style={[ef.pickerItemText, form.eventType === et.name && { color: '#c47a20' }]}>{et.name}</Text>
                  {form.eventType === et.name && <Ionicons name="checkmark" size={16} color="#c47a20" />}
                </Pressable>
              ))}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  )
}
const ef = StyleSheet.create({
  root:          { flex: 1, backgroundColor: '#faf7f2' },
  nav:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#e8dcc8' },
  navTitle:      { color: '#3d1f06', fontSize: 17, fontWeight: '700' },
  navCancel:     { color: '#a07840', fontSize: 15 },
  navSave:       { color: '#c47a20', fontSize: 15, fontWeight: '700' },
  scroll:        { flex: 1, padding: 16 },
  titleInput:    { fontSize: 20, fontWeight: '700', color: '#3d1f06', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: '#e8dcc8', marginBottom: 16 },
  row:           { flexDirection: 'row', gap: 10, marginBottom: 14 },
  fieldHalf:     { flex: 1 },
  label:         { color: '#a07840', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  input:         { backgroundColor: '#f0e8d8', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, color: '#3d1f06', fontSize: 14, borderWidth: 1, borderColor: '#e8dcc8' },
  pickerRow:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pickerText:    { flex: 1, color: '#3d1f06', fontSize: 14 },
  typeColorDot:  { width: 8, height: 8, borderRadius: 4 },
  moodRow:       { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  moodBtn:       { alignItems: 'center', padding: 8, borderRadius: 10, backgroundColor: '#f0e8d8', borderWidth: 1, borderColor: '#e8dcc8', minWidth: 60 },
  moodBtnOn:     { backgroundColor: 'rgba(196,122,32,0.15)', borderColor: '#c47a20' },
  moodEmoji:     { fontSize: 22, marginBottom: 2 },
  moodLabel:     { color: '#a07840', fontSize: 9, textAlign: 'center' },
  moodLabelOn:   { color: '#c47a20', fontWeight: '700' },
  textarea:      { backgroundColor: '#f0e8d8', borderRadius: 8, padding: 12, color: '#3d1f06', fontSize: 15, lineHeight: 22, minHeight: 160, borderWidth: 1, borderColor: '#e8dcc8', marginBottom: 14 },
  favRow:        { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  favStar:       { fontSize: 22, color: '#c47a20' },
  favText:       { color: '#a07840', fontSize: 15 },
  pickerOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  pickerSheet:   { backgroundColor: '#faf7f2', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  pickerNav:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e8dcc8' },
  pickerNavTitle:{ color: '#3d1f06', fontSize: 17, fontWeight: '600' },
  pickerNavDone: { color: '#c47a20', fontSize: 16, fontWeight: '600' },
  pickerItem:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0e8d8', gap: 10 },
  typeColor:     { width: 10, height: 10, borderRadius: 5 },
  pickerItemText:{ flex: 1, color: '#3d1f06', fontSize: 15 },
})

// ── EntryCard ─────────────────────────────────────────────────────────────────

function EntryCard({ entry, colorMap, onEdit, onDelete, onToggleFav }) {
  const [expanded, setExpanded] = useState(false)
  const people = parseTags(entry.people)
  const tags   = parseTags(entry.tags)
  const color  = colorMap[entry.eventType] || '#94a3b8'

  return (
    <View style={[ec.card, { borderLeftColor: color }]}>
      <Pressable onPress={() => setExpanded(v => !v)} style={ec.top}>
        <View style={ec.metaRow}>
          <Text style={ec.date}>{fmtDate(entry.date)}{entry.time ? ` · ${entry.time}` : ''}</Text>
          <View style={[ec.typeBadge, { backgroundColor: color + '22' }]}>
            <Text style={[ec.typeText, { color }]}>{entry.eventType}</Text>
          </View>
          <Text style={ec.moodEmoji}>{moodEmoji(entry.mood)}</Text>
        </View>

        <View style={ec.titleRow}>
          <Text style={ec.title}>{entry.title}</Text>
          <Pressable onPress={() => onToggleFav(entry.id)} hitSlop={8}>
            <Text style={[ec.fav, entry.isFavorite && ec.favOn]}>{entry.isFavorite ? '★' : '☆'}</Text>
          </Pressable>
        </View>

        {!expanded && entry.content && (
          <Text style={ec.excerpt}>{excerpt(entry.content)}</Text>
        )}

        {(entry.location || people.length > 0 || tags.length > 0) && (
          <View style={ec.chips}>
            {entry.location && <View style={ec.chip}><Text style={ec.chipText}>📍 {entry.location}</Text></View>}
            {people.map(p => <View key={p} style={ec.chip}><Text style={ec.chipText}>👤 {p}</Text></View>)}
            {tags.map(t => <View key={t} style={[ec.chip, ec.chipTag]}><Text style={[ec.chipText, ec.chipTagText]}># {t}</Text></View>)}
          </View>
        )}
      </Pressable>

      {expanded && (
        <View style={ec.body}>
          {entry.content ? (
            <Text style={ec.content}>{entry.content}</Text>
          ) : (
            <Text style={ec.noContent}>No content written.</Text>
          )}
          <View style={ec.footer}>
            <Text style={ec.ts}>
              Added {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {entry.updatedAt !== entry.createdAt ? ' · edited' : ''}
            </Text>
            <View style={ec.actions}>
              <Pressable style={ec.actionBtn} onPress={() => onEdit(entry)}>
                <Text style={ec.actionBtnText}>✎ Edit</Text>
              </Pressable>
              <Pressable style={[ec.actionBtn, ec.actionBtnDel]} onPress={() => {
                Alert.alert('Delete Entry', 'Delete this entry?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => onDelete(entry.id) },
                ])
              }}>
                <Text style={ec.actionBtnDelText}>🗑 Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
const ec = StyleSheet.create({
  card:         { backgroundColor: '#fff', borderRadius: 12, borderLeftWidth: 4, marginBottom: 10, overflow: 'hidden', shadowColor: '#0002', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 3 },
  top:          { padding: 14 },
  metaRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  date:         { color: '#a07840', fontSize: 11, flex: 1 },
  typeBadge:    { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  typeText:     { fontSize: 10, fontWeight: '600' },
  moodEmoji:    { fontSize: 16 },
  titleRow:     { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 },
  title:        { flex: 1, color: '#3d1f06', fontSize: 16, fontWeight: '700' },
  fav:          { fontSize: 20, color: '#e8dcc8' },
  favOn:        { color: '#c47a20' },
  excerpt:      { color: '#7a5030', fontSize: 13, lineHeight: 19, marginBottom: 6 },
  chips:        { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  chip:         { backgroundColor: '#f5efe6', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  chipText:     { color: '#a07840', fontSize: 11 },
  chipTag:      { backgroundColor: 'rgba(196,122,32,0.1)' },
  chipTagText:  { color: '#c47a20' },
  body:         { borderTopWidth: 1, borderTopColor: '#f5efe6', padding: 14 },
  content:      { color: '#5a3a1a', fontSize: 14, lineHeight: 22, marginBottom: 12 },
  noContent:    { color: '#bba880', fontStyle: 'italic', fontSize: 13, marginBottom: 12 },
  footer:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ts:           { color: '#bba880', fontSize: 11 },
  actions:      { flexDirection: 'row', gap: 8 },
  actionBtn:    { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f5efe6', borderRadius: 8 },
  actionBtnText:{ color: '#c47a20', fontSize: 12, fontWeight: '600' },
  actionBtnDel: { backgroundColor: 'rgba(239,68,68,0.1)' },
  actionBtnDelText: { color: '#ef4444', fontSize: 12, fontWeight: '600' },
})

// ── Main Diary ────────────────────────────────────────────────────────────────

export default function DiaryScreen() {
  const [entries,        setEntries]        = useState([])
  const [eventTypes,     setEventTypes]     = useState(DEFAULT_EVENT_TYPES)
  const [showForm,       setShowForm]       = useState(false)
  const [editing,        setEditing]        = useState(null)
  const [showManageTypes,setShowManageTypes] = useState(false)
  const [groupBy,        setGroupBy]        = useState('month')
  const [sortOrder,      setSortOrder]      = useState('newest')
  const [search,         setSearch]         = useState('')
  const [filterType,     setFilterType]     = useState('')
  const [filterMood,     setFilterMood]     = useState('')
  const [filterFavs,     setFilterFavs]     = useState(false)
  const [showGroupPicker,setShowGroupPicker] = useState(false)
  const [showSortPicker, setShowSortPicker]  = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) try { setEntries(JSON.parse(raw)) } catch {}
    })
    AsyncStorage.getItem(ET_KEY).then(raw => {
      if (raw) try { setEventTypes(JSON.parse(raw)) } catch {}
    })
  }, [])

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  useEffect(() => {
    AsyncStorage.setItem(ET_KEY, JSON.stringify(eventTypes))
  }, [eventTypes])

  const colorMap = useMemo(() => {
    const m = {}
    for (const et of eventTypes) m[et.name] = et.color
    return m
  }, [eventTypes])

  function addEventType(name, color) {
    if (eventTypes.some(et => et.name.toLowerCase() === name.toLowerCase())) return
    setEventTypes(prev => [...prev, { id: uid(), name, color }])
  }

  function editEventType(id, name, color) {
    const old = eventTypes.find(et => et.id === id)
    setEventTypes(prev => prev.map(et => et.id === id ? { ...et, name, color } : et))
    if (old && old.name !== name) {
      setEntries(prev => prev.map(e => e.eventType === old.name ? { ...e, eventType: name } : e))
      if (filterType === old.name) setFilterType(name)
    }
  }

  function deleteEventType(id) {
    const et = eventTypes.find(t => t.id === id)
    setEventTypes(prev => prev.filter(t => t.id !== id))
    if (et && filterType === et.name) setFilterType('')
  }

  function openNew()        { setEditing(null); setShowForm(true) }
  function openEdit(entry)  { setEditing(entry); setShowForm(true) }
  function closeForm()      { setShowForm(false); setEditing(null) }

  function addEntry(data) {
    const now = new Date().toISOString()
    setEntries(prev => [{ id: uid(), ...data, createdAt: now, updatedAt: now }, ...prev])
    closeForm()
  }
  function updateEntry(data) {
    setEntries(prev => prev.map(e => e.id === editing.id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e))
    closeForm()
  }
  function deleteEntry(id) { setEntries(prev => prev.filter(e => e.id !== id)) }
  function toggleFav(id)   { setEntries(prev => prev.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e)) }

  const filtered = useMemo(() => {
    let r = entries
    if (filterFavs)  r = r.filter(e => e.isFavorite)
    if (filterType)  r = r.filter(e => e.eventType === filterType)
    if (filterMood)  r = r.filter(e => e.mood === filterMood)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      r = r.filter(e =>
        e.title?.toLowerCase().includes(q) || e.content?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        parseTags(e.people).some(p => p.toLowerCase().includes(q)) ||
        parseTags(e.tags).some(t => t.toLowerCase().includes(q))
      )
    }
    const s = [...r]
    if (sortOrder === 'newest') s.sort((a, b) => (b.date + (b.time||'')) > (a.date + (a.time||'')) ? 1 : -1)
    if (sortOrder === 'oldest') s.sort((a, b) => (a.date + (a.time||'')) > (b.date + (b.time||'')) ? 1 : -1)
    if (sortOrder === 'az')     s.sort((a, b) => (a.title||'').localeCompare(b.title||''))
    if (sortOrder === 'za')     s.sort((a, b) => (b.title||'').localeCompare(a.title||''))
    return s
  }, [entries, filterFavs, filterType, filterMood, search, sortOrder])

  const groups = useMemo(() => groupEntries(filtered, groupBy), [filtered, groupBy])

  const groupLabel = GROUP_OPTIONS.find(o => o.value === groupBy)?.label ?? ''
  const sortLabel  = SORT_OPTIONS.find(o => o.value === sortOrder)?.label ?? ''

  const sections = useMemo(() => {
    const arr = []
    for (const [key, items] of groups.entries()) {
      arr.push({ type: 'header', key, count: items.length })
      for (const e of items) arr.push({ type: 'entry', key: `${key}:${e.id}`, entry: e })
    }
    return arr
  }, [groups])

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>My Diary</Text>
          <Text style={s.headerDate}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <Pressable style={s.newBtn} onPress={openNew}>
          <Text style={s.newBtnText}>+ New</Text>
        </Pressable>
      </View>

      {/* Stats */}
      <StatsBar entries={entries} />

      {/* Toolbar */}
      <View style={s.toolbar}>
        <View style={s.searchRow}>
          <Ionicons name="search-outline" size={14} color="#a07840" style={{ marginRight: 6 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Search entries…"
            placeholderTextColor="#c4a06050"
            value={search}
            onChangeText={setSearch}
          />
          {search ? <Pressable onPress={() => setSearch('')}><Ionicons name="close-circle" size={16} color="#c4a060" /></Pressable> : null}
        </View>
        <View style={s.selRow}>
          <Pressable style={s.selBtn} onPress={() => setShowGroupPicker(true)}>
            <Text style={s.selBtnText}>Group: {groupLabel}</Text>
            <Ionicons name="chevron-down" size={12} color="#c47a20" />
          </Pressable>
          <Pressable style={s.selBtn} onPress={() => setShowSortPicker(true)}>
            <Text style={s.selBtnText}>Sort: {sortLabel}</Text>
            <Ionicons name="chevron-down" size={12} color="#c47a20" />
          </Pressable>
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtersScroll} contentContainerStyle={s.filtersContent}>
        <Pressable style={[s.fchip, s.fchipManage]} onPress={() => setShowManageTypes(true)}>
          <Text style={[s.fchipText, s.fchipManageText]}>⚙ Types</Text>
        </Pressable>
        <Pressable style={[s.fchip, filterFavs && s.fchipOn]} onPress={() => setFilterFavs(v => !v)}>
          <Text style={[s.fchipText, filterFavs && s.fchipTextOn]}>★ Favs</Text>
        </Pressable>
        {eventTypes.map(et => (
          <Pressable
            key={et.id}
            style={[s.fchip, filterType === et.name && { borderColor: et.color, backgroundColor: et.color + '20' }]}
            onPress={() => setFilterType(v => v === et.name ? '' : et.name)}
          >
            <View style={[s.fchipDot, { backgroundColor: et.color }]} />
            <Text style={[s.fchipText, filterType === et.name && { color: et.color }]}>{et.name}</Text>
          </Pressable>
        ))}
        {MOODS.map(m => (
          <Pressable
            key={m.label}
            style={[s.fchip, filterMood === m.label && s.fchipOn]}
            onPress={() => setFilterMood(v => v === m.label ? '' : m.label)}
          >
            <Text style={s.fchipText}>{m.emoji}</Text>
          </Pressable>
        ))}
        {(filterFavs || filterType || filterMood || search.trim()) && (
          <Pressable
            style={[s.fchip, { borderColor: '#ef4444' }]}
            onPress={() => { setFilterFavs(false); setFilterType(''); setFilterMood(''); setSearch('') }}
          >
            <Text style={[s.fchipText, { color: '#ef4444' }]}>✕ Clear</Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Content */}
      {sections.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>{entries.length === 0 ? '📖' : '🔍'}</Text>
          <Text style={s.emptyTitle}>{entries.length === 0 ? 'Your diary is empty' : 'No entries match'}</Text>
          {entries.length === 0 && (
            <Pressable style={s.newBtnLg} onPress={openNew}>
              <Text style={s.newBtnLgText}>Write your first entry</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={item => item.key}
          renderItem={({ item }) => {
            if (item.type === 'header') return (
              <View style={s.groupHeader}>
                <Text style={s.groupName}>{item.key}</Text>
                <Text style={s.groupCount}>{item.count} {item.count === 1 ? 'entry' : 'entries'}</Text>
              </View>
            )
            return (
              <View style={s.cardWrapper}>
                <EntryCard
                  entry={item.entry}
                  colorMap={colorMap}
                  onEdit={openEdit}
                  onDelete={deleteEntry}
                  onToggleFav={toggleFav}
                />
              </View>
            )
          }}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 80 }}
        />
      )}

      {/* FAB */}
      <Pressable style={s.fab} onPress={openNew}>
        <Text style={s.fabText}>＋</Text>
      </Pressable>

      {/* Entry Form */}
      {showForm && (
        <EntryForm
          initial={editing}
          eventTypes={eventTypes}
          colorMap={colorMap}
          onSave={editing ? updateEntry : addEntry}
          onCancel={closeForm}
        />
      )}

      {/* Manage Event Types */}
      <ManageEventTypesModal
        visible={showManageTypes}
        eventTypes={eventTypes}
        onAdd={addEventType}
        onEdit={editEventType}
        onDelete={deleteEventType}
        onClose={() => setShowManageTypes(false)}
      />

      {/* Group picker */}
      <Modal visible={showGroupPicker} transparent animationType="slide" onRequestClose={() => setShowGroupPicker(false)}>
        <View style={s.pickerOverlay}>
          <View style={s.pickerSheet}>
            <View style={s.pickerNav}>
              <Text style={s.pickerNavTitle}>Group By</Text>
              <Pressable onPress={() => setShowGroupPicker(false)}><Text style={s.pickerNavDone}>Done</Text></Pressable>
            </View>
            {GROUP_OPTIONS.map(o => (
              <Pressable key={o.value} style={s.pickerItem} onPress={() => { setGroupBy(o.value); setShowGroupPicker(false) }}>
                <Text style={[s.pickerItemText, groupBy === o.value && { color: '#c47a20' }]}>{o.label}</Text>
                {groupBy === o.value && <Ionicons name="checkmark" size={16} color="#c47a20" />}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {/* Sort picker */}
      <Modal visible={showSortPicker} transparent animationType="slide" onRequestClose={() => setShowSortPicker(false)}>
        <View style={s.pickerOverlay}>
          <View style={s.pickerSheet}>
            <View style={s.pickerNav}>
              <Text style={s.pickerNavTitle}>Sort Order</Text>
              <Pressable onPress={() => setShowSortPicker(false)}><Text style={s.pickerNavDone}>Done</Text></Pressable>
            </View>
            {SORT_OPTIONS.map(o => (
              <Pressable key={o.value} style={s.pickerItem} onPress={() => { setSortOrder(o.value); setShowSortPicker(false) }}>
                <Text style={[s.pickerItemText, sortOrder === o.value && { color: '#c47a20' }]}>{o.label}</Text>
                {sortOrder === o.value && <Ionicons name="checkmark" size={16} color="#c47a20" />}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#faf7f2' },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  headerTitle:   { color: '#3d1f06', fontSize: 24, fontWeight: '800' },
  headerDate:    { color: '#a07840', fontSize: 12, marginTop: 2 },
  newBtn:        { backgroundColor: '#c47a20', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  newBtnText:    { color: '#fff', fontWeight: '700', fontSize: 14 },
  toolbar:       { paddingHorizontal: 12, marginBottom: 6 },
  searchRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0e8d8', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e8dcc8' },
  searchInput:   { flex: 1, color: '#3d1f06', fontSize: 14 },
  selRow:        { flexDirection: 'row', gap: 8 },
  selBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0e8d8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#e8dcc8' },
  selBtnText:    { color: '#7a5030', fontSize: 12, fontWeight: '600' },
  filtersScroll: { flexGrow: 0, marginBottom: 8 },
  filtersContent:{ paddingHorizontal: 12, gap: 6, alignItems: 'center' },
  fchip:         { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f0e8d8', borderWidth: 1, borderColor: '#e8dcc8' },
  fchipOn:       { backgroundColor: 'rgba(196,122,32,0.15)', borderColor: '#c47a20' },
  fchipManage:   { backgroundColor: 'rgba(196,122,32,0.12)', borderColor: '#c47a2066' },
  fchipManageText:{ color: '#c47a20', fontWeight: '600' },
  fchipText:     { color: '#a07840', fontSize: 12 },
  fchipTextOn:   { color: '#c47a20', fontWeight: '600' },
  fchipDot:      { width: 7, height: 7, borderRadius: 4 },
  groupHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingTop: 16 },
  groupName:     { color: '#c47a20', fontSize: 15, fontWeight: '700' },
  groupCount:    { color: '#a07840', fontSize: 12 },
  cardWrapper:   {},
  empty:         { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon:     { fontSize: 48, marginBottom: 12 },
  emptyTitle:    { color: '#a07840', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  newBtnLg:      { marginTop: 16, backgroundColor: '#c47a20', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  newBtnLgText:  { color: '#fff', fontWeight: '700', fontSize: 15 },
  fab:           { position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#c47a20', alignItems: 'center', justifyContent: 'center', shadowColor: '#c47a20', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  fabText:       { color: '#fff', fontSize: 28, lineHeight: 32 },
  pickerOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  pickerSheet:   { backgroundColor: '#faf7f2', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  pickerNav:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e8dcc8' },
  pickerNavTitle:{ color: '#3d1f06', fontSize: 17, fontWeight: '600' },
  pickerNavDone: { color: '#c47a20', fontSize: 16, fontWeight: '600' },
  pickerItem:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0e8d8' },
  pickerItemText:{ color: '#3d1f06', fontSize: 15 },
})
