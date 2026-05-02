import { useState, useMemo, useRef, useEffect } from 'react'
import {
  View, Text, TextInput, FlatList, Pressable, StyleSheet,
  SafeAreaView, SectionList, ActivityIndicator, ScrollView,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Audio } from 'expo-av'
import { Ionicons } from '@expo/vector-icons'
import { BOOKS, CHAPTERS, KURALS } from '../../../../../src/data/thirukkural/index.js'
import { TTS_URL } from '../../../../src/config'

// ── PlayButton ────────────────────────────────────────────────────────────────

function PlayButton({ text }) {
  const [status, setStatus] = useState('idle') // idle | loading | playing
  const soundsRef  = useRef([])
  const stoppedRef = useRef(false)

  useEffect(() => () => { stopAll() }, [])

  async function stopAll() {
    stoppedRef.current = true
    for (const s of soundsRef.current) {
      try { await s.stopAsync(); await s.unloadAsync() } catch {}
    }
    soundsRef.current = []
    setStatus('idle')
  }

  async function fetchAndPlay(lines) {
    stoppedRef.current = false
    setStatus('loading')
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true })
      setStatus('playing')
      for (let i = 0; i < lines.length; i++) {
        if (stoppedRef.current) return
        const uri = `${TTS_URL}?text=${encodeURIComponent(lines[i])}`
        const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: false, isLooping: false })
        soundsRef.current = [sound]
        await new Promise(resolve => {
          let done = false
          sound.setOnPlaybackStatusUpdate(st => {
            if (done) return
            if (stoppedRef.current || st.didJustFinish || st.error != null) { done = true; resolve() }
          })
          sound.playAsync().catch(() => resolve())
        })
        try { await sound.unloadAsync() } catch {}
        soundsRef.current = []
        if (i < lines.length - 1 && !stoppedRef.current) {
          await new Promise(r => setTimeout(r, 300))
        }
      }
    } catch {
      // silently fail
    } finally {
      if (!stoppedRef.current) setStatus('idle')
    }
  }

  async function toggle() {
    if (status !== 'idle') { await stopAll(); return }
    await fetchAndPlay([text.replace(/\n/g, ' ')])
  }

  return (
    <Pressable style={[pb.btn, status === 'playing' && pb.btnPlaying]} onPress={toggle}>
      {status === 'loading' ? (
        <ActivityIndicator size="small" color="#f59e0b" />
      ) : status === 'playing' ? (
        <Ionicons name="pause" size={16} color="#f59e0b" />
      ) : (
        <Ionicons name="play" size={16} color="#f59e0b" />
      )}
    </Pressable>
  )
}
const pb = StyleSheet.create({
  btn:        { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(245,158,11,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  btnPlaying: { backgroundColor: 'rgba(245,158,11,0.25)' },
})

// ── KuralCard ─────────────────────────────────────────────────────────────────

function KuralCard({ kural }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <View style={kc.card}>
      <View style={kc.header}>
        <Text style={kc.number}>#{kural.number}</Text>
        <PlayButton text={kural.tamil} />
      </View>
      <Text style={kc.tamil}>{kural.tamil}</Text>
      <Text style={kc.translit}>{kural.transliteration}</Text>
      <Text style={kc.english}>{kural.english}</Text>
      {expanded && <Text style={kc.explanation}>{kural.explanation}</Text>}
      <Pressable style={kc.toggleBtn} onPress={() => setExpanded(v => !v)}>
        <Text style={kc.toggleText}>{expanded ? '▲ Hide explanation' : '▼ Show explanation'}</Text>
      </Pressable>
    </View>
  )
}
const kc = StyleSheet.create({
  card:        { backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a2a' },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  number:      { color: '#f59e0b', fontSize: 13, fontWeight: '700' },
  tamil:       { color: '#f0d090', fontSize: 17, lineHeight: 26, marginBottom: 6, letterSpacing: 0.3 },
  translit:    { color: '#a07840', fontSize: 13, fontStyle: 'italic', marginBottom: 6 },
  english:     { color: '#ddd', fontSize: 14, lineHeight: 21, marginBottom: 8 },
  explanation: { color: '#aaa', fontSize: 13, lineHeight: 20, marginBottom: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#2a2a2a' },
  toggleBtn:   {},
  toggleText:  { color: '#f59e0b', fontSize: 12 },
})

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ThirukkuralScreen() {
  const { profileId } = useLocalSearchParams()
  const [activeBook,    setActiveBook]    = useState(0)
  const [activeChapter, setActiveChapter] = useState(null)
  const [search,        setSearch]        = useState('')
  const [showNav,       setShowNav]       = useState(false)

  const filteredChapters = useMemo(() => {
    if (activeBook === 0) return CHAPTERS
    return CHAPTERS.filter(c => c.book === activeBook)
  }, [activeBook])

  const displayedKurals = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (q) {
      return KURALS.filter(k =>
        k.tamil.includes(search.trim()) ||
        k.transliteration.toLowerCase().includes(q) ||
        k.english.toLowerCase().includes(q) ||
        k.explanation.toLowerCase().includes(q) ||
        String(k.number).includes(q)
      )
    }
    if (activeChapter !== null) return KURALS.filter(k => k.chapter === activeChapter)
    if (activeBook !== 0) {
      const book = BOOKS.find(b => b.number === activeBook)
      return KURALS.filter(k => k.chapter >= book.chapters[0] && k.chapter <= book.chapters[1])
    }
    return []
  }, [search, activeChapter, activeBook])

  const isSearching = search.trim().length > 0

  const chapterTitle = activeChapter !== null
    ? CHAPTERS.find(c => c.number === activeChapter)
    : null

  const bookTitle = activeBook !== 0
    ? BOOKS.find(b => b.number === activeBook)
    : null

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.titleTamil}>திருக்குறள்</Text>
            <Text style={s.subtitle}>Thirukkural · 1330 Kurals</Text>
          </View>
          <Pressable style={s.navToggle} onPress={() => setShowNav(v => !v)}>
            <Ionicons name={showNav ? 'close' : 'list'} size={20} color="#f59e0b" />
            <Text style={s.navToggleText}>{showNav ? 'Close' : 'Browse'}</Text>
          </Pressable>
        </View>
        <View style={s.searchRow}>
          <Ionicons name="search-outline" size={14} color="#a07840" style={{ marginRight: 6 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Search in Tamil, transliteration, or English…"
            placeholderTextColor="#7a5030"
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color="#a07840" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Nav panel */}
      {showNav && !isSearching && (
        <View style={s.navPanel}>
          {/* Book tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.bookTabs} contentContainerStyle={{ gap: 6, padding: 8 }}>
            <Pressable
              style={[s.bookTab, activeBook === 0 && s.bookTabActive]}
              onPress={() => { setActiveBook(0); setActiveChapter(null) }}
            >
              <Text style={[s.bookTabText, activeBook === 0 && s.bookTabTextActive]}>All Books</Text>
            </Pressable>
            {BOOKS.map(b => (
              <Pressable
                key={b.number}
                style={[s.bookTab, activeBook === b.number && s.bookTabActive]}
                onPress={() => { setActiveBook(b.number); setActiveChapter(null) }}
              >
                <Text style={[s.bookTabText, activeBook === b.number && s.bookTabTextActive]}>
                  {b.tamil} · {b.english}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Chapter list */}
          <FlatList
            data={filteredChapters}
            keyExtractor={c => String(c.number)}
            style={s.chapterList}
            renderItem={({ item: ch }) => (
              <Pressable
                style={[s.chapterBtn, activeChapter === ch.number && s.chapterBtnActive]}
                onPress={() => { setActiveChapter(ch.number === activeChapter ? null : ch.number); setShowNav(false) }}
              >
                <Text style={s.chapterNum}>Ch {ch.number}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.chapterTamil, activeChapter === ch.number && { color: '#f59e0b' }]}>{ch.tamil}</Text>
                  <Text style={s.chapterEnglish}>{ch.english}</Text>
                </View>
                {activeChapter === ch.number && <Ionicons name="checkmark" size={14} color="#f59e0b" />}
              </Pressable>
            )}
          />
        </View>
      )}

      {/* Active context label */}
      {!isSearching && !showNav && (chapterTitle || bookTitle) && (
        <View style={s.contextBar}>
          <Text style={s.contextText}>
            {chapterTitle
              ? `Ch ${chapterTitle.number} · ${chapterTitle.tamil} · ${chapterTitle.english}`
              : `${bookTitle?.tamil} · ${bookTitle?.english}`}
          </Text>
          <Pressable onPress={() => { setActiveBook(0); setActiveChapter(null) }}>
            <Ionicons name="close-circle" size={16} color="#a07840" />
          </Pressable>
        </View>
      )}

      {/* Kural list */}
      {isSearching ? (
        displayedKurals.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>No kurals found for "{search.trim()}"</Text>
          </View>
        ) : (
          <FlatList
            data={displayedKurals}
            keyExtractor={k => String(k.number)}
            renderItem={({ item }) => <KuralCard kural={item} />}
            contentContainerStyle={s.listContent}
            ListHeaderComponent={() => (
              <Text style={s.resultCount}>{displayedKurals.length} result{displayedKurals.length !== 1 ? 's' : ''}</Text>
            )}
          />
        )
      ) : displayedKurals.length > 0 ? (
        <FlatList
          data={displayedKurals}
          keyExtractor={k => String(k.number)}
          renderItem={({ item }) => <KuralCard kural={item} />}
          contentContainerStyle={s.listContent}
        />
      ) : (
        <View style={s.empty}>
          <Text style={s.emptyHero}>திருக்குறள்</Text>
          <Text style={s.emptyText}>
            {showNav ? 'Select a chapter to begin reading.' : 'Tap Browse to select a book or chapter.'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: '#0f0f0f' },
  header:          { padding: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  headerTop:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  titleTamil:      { color: '#f59e0b', fontSize: 22, fontWeight: '800' },
  subtitle:        { color: '#888', fontSize: 12, marginTop: 2 },
  navToggle:       { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(245,158,11,0.25)' },
  navToggleText:   { color: '#f59e0b', fontSize: 13, fontWeight: '600' },
  searchRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#2a2a2a' },
  searchInput:     { flex: 1, color: '#f0d090', fontSize: 14 },
  navPanel:        { backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: '#2a2a2a', maxHeight: 320 },
  bookTabs:        { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  bookTab:         { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#2a2a2a' },
  bookTabActive:   { backgroundColor: 'rgba(245,158,11,0.15)', borderColor: '#f59e0b' },
  bookTabText:     { color: '#888', fontSize: 12 },
  bookTabTextActive:{ color: '#f59e0b', fontWeight: '600' },
  chapterList:     { maxHeight: 220 },
  chapterBtn:      { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  chapterBtnActive:{ backgroundColor: 'rgba(245,158,11,0.06)' },
  chapterNum:      { color: '#666', fontSize: 11, width: 36 },
  chapterTamil:    { color: '#ddd', fontSize: 14, fontWeight: '500' },
  chapterEnglish:  { color: '#666', fontSize: 11, marginTop: 1 },
  contextBar:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: 'rgba(245,158,11,0.06)', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  contextText:     { color: '#a07840', fontSize: 13, flex: 1, marginRight: 8 },
  listContent:     { padding: 12, paddingBottom: 40 },
  resultCount:     { color: '#888', fontSize: 13, marginBottom: 10 },
  empty:           { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyHero:       { color: '#2a2a2a', fontSize: 52, fontWeight: '800', marginBottom: 16 },
  emptyText:       { color: '#555', fontSize: 15, textAlign: 'center', lineHeight: 22 },
})
