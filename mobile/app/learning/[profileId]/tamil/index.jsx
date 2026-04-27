import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

export default function TamilScreen() {
  const { profileId } = useLocalSearchParams()
  const router = useRouter()

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.hero}>
        <Text style={s.title}>தமிழ்</Text>
        <Text style={s.subtitle}>Tamil Learning</Text>
      </View>

      <View style={s.tiles}>
        <Pressable
          style={s.tile}
          onPress={() => router.push(`/learning/${profileId}/tamil/thirukkural`)}
        >
          <View style={s.tileIcon}>
            <Text style={s.tileIconText}>குறள்</Text>
          </View>
          <Text style={s.tileLabel}>Thirukkural</Text>
          <Text style={s.tileDesc}>1330 couplets · Thiruvalluvar · Tamil, transliteration & English</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#0f0f0f', padding: 20 },
  hero:         { alignItems: 'center', marginBottom: 40 },
  title:        { color: '#f59e0b', fontSize: 52, fontWeight: '800', marginBottom: 8 },
  subtitle:     { color: '#888', fontSize: 16 },
  tiles:        {},
  tile:         { backgroundColor: 'rgba(245,158,11,0.08)', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(245,158,11,0.25)' },
  tileIcon:     { marginBottom: 12 },
  tileIconText: { color: '#f59e0b', fontSize: 28, fontWeight: '800' },
  tileLabel:    { color: '#f59e0b', fontSize: 20, fontWeight: '700', marginBottom: 6 },
  tileDesc:     { color: '#888', fontSize: 13, lineHeight: 20 },
})
