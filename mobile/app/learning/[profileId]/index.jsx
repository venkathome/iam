import { View, Text, Pressable, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@apollo/client/react'
import { GET_PROFILES } from '../../../src/apollo/queries'

const AVATAR_COLORS = ['#646cff', '#4ade80', '#f59e0b', '#60a5fa', '#a78bfa', '#f87171', '#34d399']

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function initials(p) {
  return (p.firstName[0] + (p.lastName?.[0] ?? '')).toUpperCase()
}

export default function LearningHubScreen() {
  const { profileId } = useLocalSearchParams()
  const router = useRouter()

  const { data, loading } = useQuery(GET_PROFILES)
  const profiles = data?.profiles ?? []
  const profile  = profiles.find(p => p.id === profileId)

  if (loading) return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}><ActivityIndicator color="#f59e0b" /></View>
    </SafeAreaView>
  )

  if (!profile) return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}><Text style={s.notFound}>Profile not found.</Text></View>
    </SafeAreaView>
  )

  const color = avatarColor(profile.firstName)

  return (
    <SafeAreaView style={s.safe}>
      {/* Profile badge */}
      <Pressable style={s.profileBadge} onPress={() => router.back()}>
        <View style={[s.profileAvatar, { backgroundColor: color }]}>
          <Text style={s.profileAvatarText}>{initials(profile)}</Text>
        </View>
        <Text style={s.profileName}>
          {profile.firstName}{profile.lastName ? ` ${profile.lastName}` : ''}
        </Text>
        <Text style={s.profileCaret}>▾</Text>
      </Pressable>

      <Text style={s.title}>Learning</Text>
      <Text style={s.subtitle}>Choose an app to start learning.</Text>

      <View style={s.tiles}>
        {/* Spellings tile */}
        <Pressable
          style={[s.tile, s.tileSpellings]}
          onPress={() => router.push(`/learning/${profileId}/spellings`)}
        >
          <View style={s.tileIcon}>
            <Text style={s.tileIconText}>Aa</Text>
          </View>
          <Text style={s.tileLabel}>Spellings</Text>
          <Text style={s.tileDesc}>English word list with definitions & practice</Text>
        </Pressable>

        {/* Tamil tile */}
        <Pressable
          style={[s.tile, s.tileTamil]}
          onPress={() => router.push(`/learning/${profileId}/tamil`)}
        >
          <View style={s.tileIcon}>
            <Text style={[s.tileIconText, s.tileIconTamil]}>த</Text>
          </View>
          <Text style={[s.tileLabel, s.tileLabelTamil]}>Tamil</Text>
          <Text style={s.tileDesc}>Thirukkural · Tamil · Transliteration</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: '#0f0f0f', padding: 20 },
  center:           { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound:         { color: '#888', fontSize: 16 },
  profileBadge:     { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'flex-start', backgroundColor: '#1e1e1e', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginBottom: 28, borderWidth: 1, borderColor: '#2a2a2a' },
  profileAvatar:    { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  profileAvatarText:{ color: '#fff', fontWeight: '700', fontSize: 12 },
  profileName:      { color: '#ddd', fontSize: 14, fontWeight: '600' },
  profileCaret:     { color: '#666', fontSize: 12 },
  title:            { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle:         { color: '#888', fontSize: 15, marginBottom: 32 },
  tiles:            { flexDirection: 'row', gap: 14 },
  tile:             { flex: 1, borderRadius: 20, padding: 20, borderWidth: 1, alignItems: 'flex-start', gap: 8 },
  tileSpellings:    { backgroundColor: 'rgba(100,108,255,0.08)', borderColor: 'rgba(100,108,255,0.3)' },
  tileTamil:        { backgroundColor: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)' },
  tileIcon:         { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(100,108,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  tileIconText:     { color: '#646cff', fontSize: 20, fontWeight: '800' },
  tileIconTamil:    { color: '#f59e0b', fontSize: 24 },
  tileLabel:        { color: '#646cff', fontSize: 17, fontWeight: '700' },
  tileLabelTamil:   { color: '#f59e0b' },
  tileDesc:         { color: '#666', fontSize: 11, lineHeight: 16 },
})
