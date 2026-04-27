import { useEffect } from 'react'
import {
  View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView,
} from 'react-native'
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { familyTreePeople } from '../../../src/data/familyTreeData'

const peopleMap = new Map(familyTreePeople.map(p => [p.id, p]))

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
  if (!addr) return null
  if (/bangalore|bellandur|mumbai|andheri|india/i.test(addr)) return 'India'
  if (/CO|Longmont|colorado/i.test(addr)) return 'USA'
  const parts = addr.split(',').map(s => s.trim())
  return parts[parts.length - 2] || parts[parts.length - 1] || null
}

function PersonAvatar({ person, size = 48 }) {
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

function RelationSection({ label, icon, ids, onSelect }) {
  if (!ids || ids.length === 0) return null
  const people = ids.map(id => peopleMap.get(id)).filter(Boolean)
  if (!people.length) return null

  return (
    <View style={rs.section}>
      <Text style={rs.label}>{icon} {label}</Text>
      <View style={rs.chips}>
        {people.map(p => (
          <Pressable key={p.id} style={rs.chip} onPress={() => onSelect(p.id)}>
            <PersonAvatar person={p} size={28} />
            <View style={{ marginLeft: 8 }}>
              <Text style={rs.chipName}>{p.name}</Text>
              {p.alias ? <Text style={rs.chipAlias}>"{p.alias}"</Text> : null}
            </View>
            {p.deceased ? <Text style={rs.chipDeceased}>†</Text> : null}
          </Pressable>
        ))}
      </View>
    </View>
  )
}
const rs = StyleSheet.create({
  section: { marginBottom: 20 },
  label:   { color: '#888', fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  chips:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#2a2a2a' },
  chipName:     { color: '#ddd', fontSize: 14, fontWeight: '500' },
  chipAlias:    { color: '#666', fontSize: 11 },
  chipDeceased: { color: '#555', marginLeft: 4 },
})

export default function PersonDetailScreen() {
  const { personId } = useLocalSearchParams()
  const router       = useRouter()
  const nav          = useNavigation()

  const id     = parseInt(personId, 10)
  const person = peopleMap.get(id)

  useEffect(() => {
    if (person) nav.setOptions({ title: person.name })
  }, [person])

  if (!person) return (
    <View style={s.center}>
      <Text style={s.notFound}>Person not found.</Text>
    </View>
  )

  const age      = getAge(person.dob)
  const gen      = getGeneration(person)
  const loc      = getLocation(person)

  const fatherId   = person.parents?.[0] ?? null
  const motherId   = person.parents?.[1] ?? null

  function sortByAge(ids) {
    return [...(ids || [])].sort((a, b) => {
      const pa = peopleMap.get(a), pb = peopleMap.get(b)
      const da = pa?.dob ? new Date(pa.dob.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')) : null
      const db = pb?.dob ? new Date(pb.dob.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')) : null
      if (!da && !db) return 0
      if (!da) return 1
      if (!db) return -1
      return da - db
    })
  }

  const siblings = sortByAge((person.siblings || []).filter(sid => sid !== person.id))
  const children = sortByAge(person.children || [])

  function navigate(newId) {
    router.push(`/family-tree/${newId}`)
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

        {/* Hero */}
        <View style={s.hero}>
          <PersonAvatar person={person} size={80} />
          <View style={s.heroInfo}>
            <Text style={s.name}>{person.name}</Text>
            {person.alias ? <Text style={s.alias}>"{person.alias}"</Text> : null}
            <View style={s.badges}>
              {person.deceased && (
                <View style={[s.badge, { backgroundColor: 'rgba(156,163,175,0.15)' }]}>
                  <Text style={[s.badgeText, { color: '#9ca3af' }]}>† Deceased</Text>
                </View>
              )}
              <View style={[s.badge, { backgroundColor: 'rgba(96,165,250,0.15)' }]}>
                <Text style={[s.badgeText, { color: '#60a5fa' }]}>{gen}</Text>
              </View>
              {loc && (
                <View style={[s.badge, { backgroundColor: 'rgba(74,222,128,0.12)' }]}>
                  <Text style={[s.badgeText, { color: '#4ade80' }]}>📍 {loc}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Info grid */}
        <View style={s.infoCard}>
          {person.dob && (
            <View style={s.infoRow}>
              <Text style={s.infoIcon}>🎂</Text>
              <View>
                <Text style={s.infoLabel}>Date of Birth</Text>
                <Text style={s.infoValue}>{person.dob}{age !== null ? ` (age ${age})` : ''}</Text>
              </View>
            </View>
          )}
          {person.gender && (
            <View style={s.infoRow}>
              <Text style={s.infoIcon}>⚥</Text>
              <View>
                <Text style={s.infoLabel}>Gender</Text>
                <Text style={s.infoValue}>{person.gender}</Text>
              </View>
            </View>
          )}
          {person.address && (
            <View style={s.infoRow}>
              <Text style={s.infoIcon}>📍</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.infoLabel}>Address</Text>
                <Text style={s.infoValue}>{person.address}</Text>
              </View>
            </View>
          )}
          {person.email?.length > 0 && (
            <View style={s.infoRow}>
              <Text style={s.infoIcon}>✉️</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.infoLabel}>Email</Text>
                <Text style={s.infoValue}>{person.email.join(', ')}</Text>
              </View>
            </View>
          )}
          {person.phone?.length > 0 && (
            <View style={s.infoRow}>
              <Text style={s.infoIcon}>📞</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.infoLabel}>Phone</Text>
                <Text style={s.infoValue}>{person.phone.join(', ')}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Relations */}
        <View style={s.relationsCard}>
          {fatherId && <RelationSection label="Father"   icon="👨" ids={[fatherId]} onSelect={navigate} />}
          {motherId && <RelationSection label="Mother"   icon="👩" ids={[motherId]} onSelect={navigate} />}
          <RelationSection label="Spouse"   icon="💍" ids={person.spouses}  onSelect={navigate} />
          <RelationSection label="Siblings" icon="👥" ids={siblings}        onSelect={navigate} />
          <RelationSection label="Children" icon="🌱" ids={children}        onSelect={navigate} />
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#0f0f0f' },
  scroll:      { flex: 1 },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f0f' },
  notFound:    { color: '#888', fontSize: 16 },
  hero:        { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 20 },
  heroInfo:    { flex: 1 },
  name:        { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  alias:       { color: '#888', fontSize: 14, fontStyle: 'italic', marginBottom: 8 },
  badges:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge:       { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:   { fontSize: 12, fontWeight: '600' },
  infoCard:    { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, marginBottom: 16 },
  infoRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#252525' },
  infoIcon:    { fontSize: 20, marginTop: 2 },
  infoLabel:   { color: '#777', fontSize: 12, marginBottom: 2 },
  infoValue:   { color: '#ddd', fontSize: 14 },
  relationsCard: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16 },
})
