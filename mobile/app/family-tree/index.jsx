import { useState, useMemo } from 'react'
import {
  View, Text, TextInput, FlatList, Pressable, StyleSheet,
  SafeAreaView, SectionList, Modal, ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { familyTreePeople } from '../../../src/data/familyTreeData'
import { Ionicons } from '@expo/vector-icons'

const peopleMap = new Map(familyTreePeople.map(p => [p.id, p]))

const SORT_OPTIONS = [
  { key: 'alpha',       label: 'A–Z' },
  { key: 'generation',  label: 'Gen' },
  { key: 'location',    label: 'Location' },
  { key: 'connections', label: 'Connect.' },
  { key: 'status',      label: 'Status' },
]

function getAge(dob) {
  if (!dob) return null
  const birth = new Date(dob.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2'))
  if (isNaN(birth)) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function getGeneration(p) {
  const age = getAge(p.dob)
  if (age === null) return p.deceased ? 'Ancestor' : 'Unknown'
  if (age < 18) return 'Young'
  if (age < 35) return 'Millennial'
  if (age < 55) return 'Gen X'
  if (age < 75) return 'Boomer'
  return 'Elder'
}

function getLocation(p) {
  const addr = p.address || ''
  if (!addr) return 'Unknown'
  if (/bangalore|bellandur|mumbai|andheri|india/i.test(addr)) return 'India'
  if (/CO|Longmont|colorado/i.test(addr)) return 'USA'
  const parts = addr.split(',').map(s => s.trim())
  return parts[parts.length - 2] || parts[parts.length - 1] || 'Unknown'
}

function connCount(p) {
  return (p.children?.length || 0) + (p.parents?.length || 0) +
    (p.siblings?.length || 0) + (p.spouses?.length || 0)
}

function buildSections(people, sortBy) {
  const sorted = [...people].sort((a, b) => a.name.localeCompare(b.name))
  const groups = {}
  const order = []

  for (const p of sorted) {
    let key
    switch (sortBy) {
      case 'alpha':       key = p.name[0].toUpperCase(); break
      case 'generation':  key = getGeneration(p); break
      case 'location':    key = getLocation(p); break
      case 'connections': {
        const c = connCount(p)
        key = c >= 6 ? 'Well-Connected (6+)' : c >= 3 ? 'Connected (3–5)' : c >= 1 ? 'Few (1–2)' : 'Isolated (0)'
        break
      }
      case 'status': key = p.deceased ? 'Deceased' : 'Living'; break
      default:       key = p.name[0].toUpperCase()
    }
    if (!groups[key]) { groups[key] = []; order.push(key) }
    groups[key].push(p)
  }

  const orderArr = sortBy === 'generation'
    ? ['Young', 'Millennial', 'Gen X', 'Boomer', 'Elder', 'Ancestor', 'Unknown']
    : sortBy === 'connections'
    ? ['Well-Connected (6+)', 'Connected (3–5)', 'Few (1–2)', 'Isolated (0)']
    : sortBy === 'status'
    ? ['Living', 'Deceased']
    : [...new Set(order)].sort()

  return orderArr.filter(k => groups[k]).map(k => ({ title: k, data: groups[k] }))
}

function PersonAvatar({ person, size = 38 }) {
  const initials = person.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const hue = (person.id * 47) % 360
  return (
    <View style={[av.ring, { width: size, height: size, borderRadius: size / 2, backgroundColor: `hsl(${hue},55%,38%)` }]}>
      <Text style={[av.text, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  )
}
const av = StyleSheet.create({
  ring: { alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontWeight: '700' },
})

// ── Relationship Finder ───────────────────────────────────────────────────────

function findPath(fromId, toId) {
  if (fromId === toId) return [fromId]
  const visited = new Set([fromId])
  const queue = [[fromId, [fromId]]]
  while (queue.length) {
    const [cur, path] = queue.shift()
    const p = peopleMap.get(cur)
    if (!p) continue
    const neighbors = [...(p.children||[]), ...(p.parents||[]), ...(p.siblings||[]), ...(p.spouses||[])]
    for (const nid of neighbors) {
      if (visited.has(nid)) continue
      const np = [...path, nid]
      if (nid === toId) return np
      visited.add(nid)
      queue.push([nid, np])
    }
  }
  return null
}

function describeStep(fromId, toId) {
  const from = peopleMap.get(fromId)
  if (!from) return 'connected to'
  if (from.children?.includes(toId)) return 'parent of'
  if (from.parents?.includes(toId)) return 'child of'
  if (from.siblings?.includes(toId)) return 'sibling of'
  if (from.spouses?.includes(toId)) return 'spouse of'
  return 'connected to'
}

const sortedPeopleForFinder = [...familyTreePeople].sort((a, b) => a.name.localeCompare(b.name))

function RelationshipFinder({ onSelectPerson }) {
  const [fromId, setFromId] = useState(null)
  const [toId,   setToId]   = useState(null)
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)
  const [showFromPicker, setShowFromPicker] = useState(false)
  const [showToPicker,   setShowToPicker]   = useState(false)
  const [pickerSearch,   setPickerSearch]   = useState('')

  function filteredPeople() {
    const q = pickerSearch.toLowerCase()
    return q ? sortedPeopleForFinder.filter(p =>
      p.name.toLowerCase().includes(q) || (p.alias || '').toLowerCase().includes(q)
    ) : sortedPeopleForFinder
  }

  function find() {
    if (!fromId || !toId) return
    const path = findPath(fromId, toId)
    setResult(path); setSearched(true)
  }

  function PersonPicker({ visible, selected, onSelect, onClose }) {
    return (
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View style={rf.pickerOverlay}>
          <View style={rf.pickerSheet}>
            <View style={rf.pickerNav}>
              <Text style={rf.pickerTitle}>Select Person</Text>
              <Pressable onPress={() => { setPickerSearch(''); onClose() }}>
                <Text style={rf.pickerDone}>Done</Text>
              </Pressable>
            </View>
            <View style={rf.pickerSearchRow}>
              <TextInput
                style={rf.pickerSearch}
                placeholder="Search…"
                placeholderTextColor="#555"
                value={pickerSearch}
                onChangeText={setPickerSearch}
                autoFocus
              />
            </View>
            <FlatList
              data={filteredPeople()}
              keyExtractor={p => String(p.id)}
              renderItem={({ item: p }) => (
                <Pressable
                  style={[rf.pickerItem, selected === p.id && rf.pickerItemSel]}
                  onPress={() => { onSelect(p.id); setPickerSearch(''); onClose() }}
                >
                  <PersonAvatar person={p} size={32} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[rf.pickerName, selected === p.id && rf.pickerNameSel]}>{p.name}</Text>
                    {p.alias ? <Text style={rf.pickerAlias}>"{p.alias}"</Text> : null}
                  </View>
                  {p.deceased && <Text style={rf.pickerDeceased}>†</Text>}
                  {selected === p.id && <Ionicons name="checkmark" size={16} color="#4ade80" />}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    )
  }

  const fromPerson = fromId ? peopleMap.get(fromId) : null
  const toPerson   = toId   ? peopleMap.get(toId)   : null

  return (
    <ScrollView style={rf.root} contentContainerStyle={{ padding: 16 }}>
      <Text style={rf.title}>Find Relationship</Text>
      <Text style={rf.desc}>Discover how two people in the family are connected.</Text>

      <View style={rf.selectRow}>
        <Pressable style={rf.selectBtn} onPress={() => setShowFromPicker(true)}>
          {fromPerson ? (
            <View style={rf.selectPerson}>
              <PersonAvatar person={fromPerson} size={32} />
              <Text style={rf.selectName}>{fromPerson.name}</Text>
            </View>
          ) : (
            <Text style={rf.selectPlaceholder}>Select person…</Text>
          )}
          <Ionicons name="chevron-down" size={16} color="#888" />
        </Pressable>

        <Text style={rf.arrow}>→</Text>

        <Pressable style={rf.selectBtn} onPress={() => setShowToPicker(true)}>
          {toPerson ? (
            <View style={rf.selectPerson}>
              <PersonAvatar person={toPerson} size={32} />
              <Text style={rf.selectName}>{toPerson.name}</Text>
            </View>
          ) : (
            <Text style={rf.selectPlaceholder}>Select person…</Text>
          )}
          <Ionicons name="chevron-down" size={16} color="#888" />
        </Pressable>
      </View>

      <Pressable
        style={[rf.findBtn, (!fromId || !toId) && rf.findBtnDis]}
        onPress={find}
        disabled={!fromId || !toId}
      >
        <Text style={rf.findBtnText}>Find Connection</Text>
      </Pressable>

      {searched && (
        <View style={rf.result}>
          {result === null ? (
            <Text style={rf.noPath}>No connection found between these two people.</Text>
          ) : result.length === 1 ? (
            <Text style={rf.samePerson}>These are the same person!</Text>
          ) : (
            <>
              <Text style={rf.pathLabel}>
                Connection path · {result.length - 1} step{result.length > 2 ? 's' : ''}
              </Text>
              {result.map((id, i) => {
                const p = peopleMap.get(id)
                if (!p) return null
                return (
                  <View key={id}>
                    <Pressable style={rf.pathNode} onPress={() => onSelectPerson(id)}>
                      <PersonAvatar person={p} size={36} />
                      <Text style={rf.pathName}>{p.name}</Text>
                    </Pressable>
                    {i < result.length - 1 && (
                      <View style={rf.edgeRow}>
                        <Text style={rf.edgeText}>↓ {describeStep(id, result[i + 1])} ↓</Text>
                      </View>
                    )}
                  </View>
                )
              })}
            </>
          )}
        </View>
      )}

      <PersonPicker visible={showFromPicker} selected={fromId} onSelect={setFromId} onClose={() => setShowFromPicker(false)} />
      <PersonPicker visible={showToPicker}   selected={toId}   onSelect={setToId}   onClose={() => setShowToPicker(false)} />
    </ScrollView>
  )
}
const rf = StyleSheet.create({
  root:             { flex: 1 },
  title:            { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 6 },
  desc:             { color: '#888', fontSize: 14, marginBottom: 20 },
  selectRow:        { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  selectBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e1e1e', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#333' },
  selectPerson:     { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  selectName:       { color: '#ddd', fontSize: 13, flex: 1 },
  selectPlaceholder:{ color: '#555', fontSize: 13, flex: 1 },
  arrow:            { color: '#888', fontSize: 20 },
  findBtn:          { backgroundColor: '#4ade80', borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginBottom: 20 },
  findBtnDis:       { opacity: 0.4 },
  findBtnText:      { color: '#0f0f0f', fontWeight: '700', fontSize: 15 },
  result:           { backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16 },
  noPath:           { color: '#ef4444', fontSize: 14 },
  samePerson:       { color: '#f59e0b', fontSize: 14 },
  pathLabel:        { color: '#888', fontSize: 12, marginBottom: 12 },
  pathNode:         { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#222', borderRadius: 10, padding: 10 },
  pathName:         { color: '#fff', fontSize: 15, fontWeight: '600' },
  edgeRow:          { paddingVertical: 4, alignItems: 'center' },
  edgeText:         { color: '#555', fontSize: 12 },
  pickerOverlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  pickerSheet:      { backgroundColor: '#1e1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '75%' },
  pickerNav:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' },
  pickerTitle:      { color: '#fff', fontSize: 17, fontWeight: '600' },
  pickerDone:       { color: '#4ade80', fontSize: 16, fontWeight: '600' },
  pickerSearchRow:  { padding: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  pickerSearch:     { backgroundColor: '#2a2a2a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: '#fff', fontSize: 14 },
  pickerItem:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  pickerItemSel:    { backgroundColor: 'rgba(74,222,128,0.08)' },
  pickerName:       { color: '#ddd', fontSize: 15 },
  pickerNameSel:    { color: '#4ade80' },
  pickerAlias:      { color: '#666', fontSize: 12 },
  pickerDeceased:   { color: '#888', marginRight: 8 },
})

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function FamilyTreeScreen() {
  const router = useRouter()
  const [sortBy,      setSortBy]      = useState('alpha')
  const [search,      setSearch]      = useState('')
  const [showFinder,  setShowFinder]  = useState(false)
  const [finderModal, setFinderModal] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return familyTreePeople
    return familyTreePeople.filter(p =>
      p.name.toLowerCase().includes(q) || (p.alias || '').toLowerCase().includes(q)
    )
  }, [search])

  const sections = useMemo(() => buildSections(filtered, sortBy), [filtered, sortBy])

  function navigatePerson(id) {
    setFinderModal(false)
    router.push(`/family-tree/${id}`)
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Search */}
      <View style={s.searchRow}>
        <Ionicons name="search-outline" size={16} color="#888" style={{ marginRight: 6 }} />
        <TextInput
          style={s.searchInput}
          placeholder="Search by name or alias…"
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#666" />
          </Pressable>
        ) : null}
      </View>

      {/* Sort tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsRow} contentContainerStyle={{ gap: 6, paddingHorizontal: 12 }}>
        {SORT_OPTIONS.map(({ key, label }) => (
          <Pressable
            key={key}
            style={[s.tab, sortBy === key && s.tabActive]}
            onPress={() => setSortBy(key)}
          >
            <Text style={[s.tabText, sortBy === key && s.tabTextActive]}>{label}</Text>
          </Pressable>
        ))}
        <Pressable style={[s.tab, s.tabFinder]} onPress={() => setFinderModal(true)}>
          <Text style={s.tabFinderText}>🔗 Find Relation</Text>
        </Pressable>
      </ScrollView>

      {/* Count */}
      <Text style={s.count}>{familyTreePeople.length} people</Text>

      {/* List */}
      <SectionList
        sections={sections}
        keyExtractor={p => String(p.id)}
        renderSectionHeader={({ section }) => (
          <View style={s.sectionHeader}>
            <Text style={s.sectionHeaderText}>{section.title}</Text>
            <Text style={s.sectionCount}>{section.data.length}</Text>
          </View>
        )}
        renderItem={({ item: p }) => (
          <Pressable
            style={s.personRow}
            onPress={() => navigatePerson(p.id)}
          >
            <PersonAvatar person={p} size={38} />
            <View style={s.personInfo}>
              <Text style={[s.personName, p.deceased && s.personDeceased]}>{p.name}</Text>
              {p.alias ? <Text style={s.personAlias}>"{p.alias}"</Text> : null}
            </View>
            {p.deceased && <Text style={s.deceasedMark}>†</Text>}
            <Ionicons name="chevron-forward" size={16} color="#444" />
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        stickySectionHeadersEnabled
      />

      {/* Relationship Finder Modal */}
      <Modal visible={finderModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setFinderModal(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
          <View style={s.finderNav}>
            <Text style={s.finderNavTitle}>Find Relationship</Text>
            <Pressable onPress={() => setFinderModal(false)}>
              <Text style={s.finderNavClose}>Done</Text>
            </Pressable>
          </View>
          <RelationshipFinder onSelectPerson={navigatePerson} />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: '#0f0f0f' },
  searchRow:       { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginTop: 8, marginBottom: 4, backgroundColor: '#1a1a1a', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  searchInput:     { flex: 1, color: '#fff', fontSize: 15 },
  tabsRow:         { flexGrow: 0, paddingVertical: 8 },
  tab:             { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#1e1e1e', borderWidth: 1, borderColor: '#333' },
  tabActive:       { backgroundColor: 'rgba(74,222,128,0.12)', borderColor: '#4ade80' },
  tabText:         { color: '#888', fontSize: 13 },
  tabTextActive:   { color: '#4ade80', fontWeight: '600' },
  tabFinder:       { backgroundColor: 'rgba(100,108,255,0.1)', borderColor: '#646cff' },
  tabFinderText:   { color: '#646cff', fontSize: 13, fontWeight: '600' },
  count:           { color: '#555', fontSize: 12, paddingHorizontal: 16, marginBottom: 4 },
  sectionHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#151515', paddingHorizontal: 16, paddingVertical: 6 },
  sectionHeaderText: { color: '#666', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionCount:    { color: '#444', fontSize: 11 },
  personRow:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1a1a1a', gap: 12 },
  personInfo:      { flex: 1 },
  personName:      { color: '#ddd', fontSize: 15 },
  personDeceased:  { color: '#666' },
  personAlias:     { color: '#555', fontSize: 12, marginTop: 1 },
  deceasedMark:    { color: '#555', marginRight: 4 },
  finderNav:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  finderNavTitle:  { color: '#fff', fontSize: 17, fontWeight: '600' },
  finderNavClose:  { color: '#4ade80', fontSize: 16, fontWeight: '600' },
})
