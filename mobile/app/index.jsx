import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'

const TILES = [
  { label: 'Recipes',     route: '/recipes',      icon: 'restaurant-outline',  color: '#646cff', bg: 'rgba(100,108,255,0.12)' },
  { label: 'Family Tree', route: '/family-tree',   icon: 'people-outline',      color: '#4ade80', bg: 'rgba(74,222,128,0.12)'  },
  { label: 'Learning',    route: '/learning',      icon: 'school-outline',      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  { label: 'Diary',       route: '/diary',         icon: 'book-outline',        color: '#c47a20', bg: 'rgba(196,122,32,0.12)'  },
]

export default function HomeScreen() {
  const router = useRouter()
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.title}>IAM</Text>
        <Text style={s.subtitle}>Welcome to the IAM application.</Text>
        <View style={s.grid}>
          {TILES.map(t => (
            <Pressable
              key={t.label}
              style={({ pressed }) => [s.tile, { borderColor: t.color, backgroundColor: pressed ? t.bg : '#1e1e1e' }]}
              onPress={() => router.push(t.route)}
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
  safe:      { flex: 1, backgroundColor: '#0f0f0f' },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title:     { fontSize: 42, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  subtitle:  { fontSize: 16, color: '#888', marginBottom: 32 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  tile:      { width: 150, alignItems: 'center', gap: 10, padding: 24, borderRadius: 16,
               borderWidth: 1, borderColor: '#3a3a3a' },
  tileLabel: { fontSize: 14, fontWeight: '600' },
})
