import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { useRouter, Redirect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { useProfile } from '../src/context/ProfileContext'

const AVATAR_COLORS = ['#646cff', '#4ade80', '#f59e0b', '#60a5fa', '#a78bfa', '#f87171', '#34d399']

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function initials(p) {
  return (p.firstName[0] + (p.lastName?.[0] ?? '')).toUpperCase()
}

const TILES = [
  { label: 'Recipes',     icon: 'restaurant-outline',      color: '#646cff', bg: 'rgba(100,108,255,0.12)', route: () => '/recipes'         },
  { label: 'Family Tree', icon: 'people-outline',          color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  route: () => '/family-tree'     },
  { label: 'Learning',    icon: 'school-outline',          color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  route: id  => `/learning/${id}` },
  { label: 'Diary',       icon: 'book-outline',            color: '#c47a20', bg: 'rgba(196,122,32,0.12)', route: () => '/diary'           },
  { label: 'Games',       icon: 'game-controller-outline', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', route: () => '/games'          },
]

export default function Dashboard() {
  const router = useRouter()
  const { profile, setProfile } = useProfile()

  if (!profile) return <Redirect href="/" />

  const color = avatarColor(profile.firstName)

  function handleSwitch() {
    setProfile(null)
    router.replace('/')
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={s.container}>

        <View style={s.header}>
          <View>
            <Text style={s.title}>IAM</Text>
            <Text style={s.subtitle}>What would you like to do?</Text>
          </View>
          <Pressable style={s.profileBadge} onPress={handleSwitch}>
            <View style={[s.avatar, { backgroundColor: color }]}>
              <Text style={s.avatarText}>{initials(profile)}</Text>
            </View>
            <Text style={s.profileName}>
              {profile.firstName}{profile.lastName ? ` ${profile.lastName}` : ''}
            </Text>
            <Ionicons name="swap-horizontal-outline" size={14} color="#666" />
          </Pressable>
        </View>

        <View style={s.grid}>
          {TILES.map(t => (
            <Pressable
              key={t.label}
              style={({ pressed }) => [s.tile, { borderColor: t.color, backgroundColor: pressed ? t.bg : '#1e1e1e' }]}
              onPress={() => router.push(t.route(profile.id))}
            >
              <Ionicons name={t.icon} size={36} color={t.color} />
              <Text style={[s.tileLabel, { color: t.color }]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#0f0f0f' },
  container:   { flexGrow: 1, padding: 20 },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  title:       { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: 1 },
  subtitle:    { color: '#888', fontSize: 14, marginTop: 2 },
  profileBadge:{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1a1a1a', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#2a2a2a' },
  avatar:      { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  avatarText:  { color: '#fff', fontWeight: '700', fontSize: 11 },
  profileName: { color: '#ddd', fontSize: 13, fontWeight: '600' },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  tile:        { width: '47%', alignItems: 'center', gap: 10, padding: 28, borderRadius: 16, borderWidth: 1 },
  tileLabel:   { fontSize: 14, fontWeight: '600' },
})
