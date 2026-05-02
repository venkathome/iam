import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'

const GAMES = [
  {
    label: 'Tic Tac Toe',
    route: '/games/tic-tac-toe',
    icon: 'grid-outline',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    desc: '2 Players • 3×3 to 5×5',
  },
]

export default function GamesScreen() {
  const router = useRouter()
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={s.container}>
        <View style={s.grid}>
          {GAMES.map(g => (
            <Pressable
              key={g.label}
              style={({ pressed }) => [s.tile, { borderColor: g.color, backgroundColor: pressed ? g.bg : '#1e1e1e' }]}
              onPress={() => router.push(g.route)}
            >
              <Ionicons name={g.icon} size={44} color={g.color} />
              <Text style={[s.tileLabel, { color: g.color }]}>{g.label}</Text>
              <Text style={s.tileDesc}>{g.desc}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#0f0f0f' },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  tile:      { width: 160, alignItems: 'center', gap: 8, padding: 28, borderRadius: 18, borderWidth: 1 },
  tileLabel: { fontSize: 15, fontWeight: '700' },
  tileDesc:  { fontSize: 12, color: '#888', textAlign: 'center' },
})
