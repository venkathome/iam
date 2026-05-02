import { useState, useEffect } from 'react'
import {
  View, Text, TextInput, FlatList, Pressable, StyleSheet,
  SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery, useMutation } from '@apollo/client/react'
import { Ionicons } from '@expo/vector-icons'
import {
  GET_SPELLINGS, SEARCH_SPELLINGS, ADD_SPELLING,
  INCREMENT_SPELT_COUNT, DECREMENT_SPELT_COUNT,
  TOGGLE_REVISION, DELETE_SPELLING,
} from '../../../src/apollo/queries'
import { useNotify } from '../../../src/context/NotificationContext'

async function validateWord(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
    if (!res.ok) return null
    const data = await res.json()
    return data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition || null
  } catch { return null }
}

async function fetchSuggestions(word) {
  try {
    const encoded = encodeURIComponent(word)
    const [rel, ext] = await Promise.all([
      fetch(`https://api.datamuse.com/words?ml=${encoded}&max=10`).then(r => r.json()),
      fetch(`https://api.datamuse.com/words?sp=${encoded}*&max=10`).then(r => r.json()),
    ])
    const wl = word.toLowerCase()
    return {
      related:    rel.map(w => w.word).filter(w => w.toLowerCase() !== wl).slice(0, 5),
      extensions: ext.map(w => w.word).filter(w => { const l = w.toLowerCase(); return l !== wl && l.startsWith(wl) }).slice(0, 5),
    }
  } catch { return { related: [], extensions: [] } }
}

// ── WordRow ───────────────────────────────────────────────────────────────────

function WordRow({ spelling, onIncrement, onDecrement, onRevision, onDelete, expandedId, onToggleExpand, allWords, profileId, onAddSuggestion }) {
  const [suggestions, setSuggestions] = useState(null)
  const isExpanded = expandedId === spelling.id

  useEffect(() => {
    if (isExpanded && !suggestions) {
      fetchSuggestions(spelling.word).then(setSuggestions)
    }
  }, [isExpanded])

  return (
    <View style={[wr.row, spelling.needsRevision && wr.rowRevision]}>
      <Pressable style={wr.main} onPress={() => onToggleExpand(spelling.id)}>
        <View style={wr.top}>
          <Text style={wr.word}>{spelling.word}</Text>
          <View style={wr.actions}>
            <Pressable style={wr.btn} onPress={() => onDecrement(spelling.id)} disabled={spelling.speltCount === 0}>
              <Text style={[wr.btnText, spelling.speltCount === 0 && { opacity: 0.3 }]}>−</Text>
            </Pressable>
            <Text style={wr.count}>{spelling.speltCount}</Text>
            <Pressable style={wr.btn} onPress={() => onIncrement(spelling.id)}>
              <Text style={wr.btnText}>+</Text>
            </Pressable>
            <Pressable style={[wr.btn, spelling.needsRevision && wr.btnRevOn]} onPress={() => onRevision(spelling.id)}>
              <Ionicons name={spelling.needsRevision ? 'bookmark' : 'bookmark-outline'} size={14} color={spelling.needsRevision ? '#f59e0b' : '#666'} />
            </Pressable>
            <Pressable style={wr.btn} onPress={() => onDelete(spelling.id)}>
              <Ionicons name="trash-outline" size={14} color="#666" />
            </Pressable>
          </View>
        </View>

        {isExpanded && (
          <View style={wr.expanded}>
            {spelling.definition ? (
              <Text style={wr.definition}>{spelling.definition}</Text>
            ) : (
              <Text style={wr.noDefinition}>No definition available.</Text>
            )}

            {!suggestions ? (
              <Text style={wr.loadingSugg}>Finding suggestions…</Text>
            ) : (suggestions.related.length > 0 || suggestions.extensions.length > 0) ? (
              <View style={wr.sugg}>
                <Text style={wr.suggLabel}>Suggested to learn next</Text>
                {suggestions.related.length > 0 && (
                  <>
                    <Text style={wr.suggGroupLabel}>Similar meaning</Text>
                    <View style={wr.suggPills}>
                      {suggestions.related.map(w => {
                        const alreadyAdded = allWords.includes(w)
                        return (
                          <Pressable
                            key={w}
                            style={[wr.suggPill, alreadyAdded && wr.suggPillAdded]}
                            onPress={() => !alreadyAdded && onAddSuggestion(w)}
                            disabled={alreadyAdded}
                          >
                            <Text style={[wr.suggPillText, alreadyAdded && wr.suggPillTextAdded]}>{w}</Text>
                          </Pressable>
                        )
                      })}
                    </View>
                  </>
                )}
                {suggestions.extensions.length > 0 && (
                  <>
                    <Text style={wr.suggGroupLabel}>Word extensions</Text>
                    <View style={wr.suggPills}>
                      {suggestions.extensions.map(w => {
                        const alreadyAdded = allWords.includes(w)
                        return (
                          <Pressable
                            key={w}
                            style={[wr.suggPill, wr.suggPillExt, alreadyAdded && wr.suggPillAdded]}
                            onPress={() => !alreadyAdded && onAddSuggestion(w)}
                            disabled={alreadyAdded}
                          >
                            <Text style={[wr.suggPillText, alreadyAdded && wr.suggPillTextAdded]}>{w}</Text>
                          </Pressable>
                        )
                      })}
                    </View>
                  </>
                )}
              </View>
            ) : null}
          </View>
        )}
      </Pressable>
    </View>
  )
}
const wr = StyleSheet.create({
  row:              { backgroundColor: '#1a1a1a', borderRadius: 10, marginBottom: 6, overflow: 'hidden' },
  rowRevision:      { borderLeftWidth: 3, borderLeftColor: '#f59e0b' },
  main:             { padding: 12 },
  top:              { flexDirection: 'row', alignItems: 'center', gap: 8 },
  word:             { flex: 1, color: '#ddd', fontSize: 16, fontWeight: '500' },
  actions:          { flexDirection: 'row', alignItems: 'center', gap: 4 },
  btn:              { padding: 6, borderRadius: 6, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center', minWidth: 28 },
  btnRevOn:         { backgroundColor: 'rgba(245,158,11,0.15)' },
  btnText:          { color: '#888', fontSize: 16, fontWeight: '700', lineHeight: 18 },
  count:            { color: '#646cff', fontSize: 14, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  expanded:         { marginTop: 10 },
  definition:       { color: '#aaa', fontSize: 13, lineHeight: 19, marginBottom: 10 },
  noDefinition:     { color: '#555', fontSize: 12, fontStyle: 'italic', marginBottom: 10 },
  loadingSugg:      { color: '#555', fontSize: 12, fontStyle: 'italic' },
  sugg:             { borderTopWidth: 1, borderTopColor: '#252525', paddingTop: 10 },
  suggLabel:        { color: '#888', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  suggGroupLabel:   { color: '#666', fontSize: 11, marginBottom: 4 },
  suggPills:        { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  suggPill:         { backgroundColor: '#252525', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#646cff40' },
  suggPillExt:      { borderColor: '#4ade8040' },
  suggPillAdded:    { opacity: 0.3 },
  suggPillText:     { color: '#646cff', fontSize: 12 },
  suggPillTextAdded:{ color: '#555' },
})

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function SpellingsScreen() {
  const { profileId } = useLocalSearchParams()
  const notify = useNotify()
  const [addInput,      setAddInput]      = useState('')
  const [isAdding,      setIsAdding]      = useState(false)
  const [searchInput,   setSearchInput]   = useState('')
  const [activeFilter,  setActiveFilter]  = useState('all')
  const [expandedId,    setExpandedId]    = useState(null)
  const [deletedIds, setDeletedIds] = useState(new Set())

  const { data: allData,    loading: allLoading    } = useQuery(GET_SPELLINGS, { variables: { profileId }, skip: !profileId })
  const { data: searchData, loading: searchLoading } = useQuery(SEARCH_SPELLINGS, {
    variables: { profileId, query: searchInput },
    skip: searchInput.trim().length === 0 || !profileId,
  })
  const [addSpelling]        = useMutation(ADD_SPELLING)
  const [incrementSpeltCount]= useMutation(INCREMENT_SPELT_COUNT)
  const [decrementSpeltCount]= useMutation(DECREMENT_SPELT_COUNT)
  const [toggleRevision]     = useMutation(TOGGLE_REVISION)
  const [deleteSpelling]     = useMutation(DELETE_SPELLING)

  const allWords  = (allData?.spellings ?? []).map(s => s.word)
  const baseWords = searchInput.trim() ? (searchData?.searchSpellings ?? []) : (allData?.spellings ?? [])
  const displayed = (activeFilter === 'revision' ? baseWords.filter(w => w.needsRevision) : baseWords).filter(w => !deletedIds.has(w.id))
  const loading   = searchInput.trim() ? searchLoading : allLoading
  const revCount  = (allData?.spellings ?? []).filter(w => w.needsRevision).length

  function getRefetchQueries() {
    return [
      { query: GET_SPELLINGS, variables: { profileId } },
      ...(searchInput.trim() ? [{ query: SEARCH_SPELLINGS, variables: { profileId, query: searchInput } }] : []),
    ]
  }

  async function handleAdd() {
    const word = addInput.trim().toLowerCase()
    if (!word) return
    if (allData?.spellings?.some(s => s.word === word)) {
      notify.error(`"${word}" is already in your list.`); return
    }
    setIsAdding(true)
    const definition = await validateWord(word)
    if (definition === null) {
      notify.error(`"${word}" was not found in the English dictionary.`)
      setIsAdding(false); return
    }
    try {
      await addSpelling({ variables: { profileId, word, definition }, refetchQueries: getRefetchQueries() })
      notify.success(`"${word}" added successfully.`)
      setAddInput('')
    } catch (err) {
      notify.error(err.message?.includes('Unique') ? `"${word}" already added.` : 'Failed to add word.')
    } finally { setIsAdding(false) }
  }

  async function handleAddSuggestion(word) {
    if (allWords.includes(word)) return
    const definition = await validateWord(word)
    if (!definition) { Alert.alert('Not found', `"${word}" was not found in the dictionary.`); return }
    try {
      await addSpelling({ variables: { profileId, word, definition }, refetchQueries: getRefetchQueries() })
    } catch { Alert.alert('Error', 'Failed to add word.') }
  }

  function handleIncrement(id) { incrementSpeltCount({ variables: { id }, refetchQueries: getRefetchQueries() }) }
  function handleDecrement(id) { decrementSpeltCount({ variables: { id }, refetchQueries: getRefetchQueries() }) }
  function handleRevision(id)  { toggleRevision({ variables: { id }, refetchQueries: getRefetchQueries() }) }

  function handleDelete(id) {
    setDeletedIds(prev => new Set([...prev, id]))
    deleteSpelling({ variables: { id }, refetchQueries: getRefetchQueries() })
  }

  function toggleExpand(id) { setExpandedId(v => v === id ? null : id) }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Add word */}
        <View style={s.addRow}>
          <TextInput
            style={s.addInput}
            placeholder="Add a word…"
            placeholderTextColor="#555"
            value={addInput}
            onChangeText={setAddInput}
            onSubmitEditing={handleAdd}
            autoCapitalize="none"
            returnKeyType="done"
            editable={!isAdding}
          />
          <Pressable style={[s.addBtn, (!addInput.trim() || isAdding) && s.addBtnDis]} onPress={handleAdd} disabled={!addInput.trim() || isAdding}>
            <Text style={s.addBtnText}>{isAdding ? '…' : 'Add'}</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View style={s.searchRow}>
          <Ionicons name="search-outline" size={15} color="#555" style={{ marginRight: 6 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Search words…"
            placeholderTextColor="#555"
            value={searchInput}
            onChangeText={setSearchInput}
            autoCapitalize="none"
          />
          {searchInput ? (
            <Pressable onPress={() => setSearchInput('')}>
              <Ionicons name="close-circle" size={16} color="#555" />
            </Pressable>
          ) : null}
        </View>

        {/* Filter chips */}
        <View style={s.filterRow}>
          <Pressable
            style={[s.filterChip, activeFilter === 'all' && s.filterChipActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[s.filterChipText, activeFilter === 'all' && s.filterChipTextActive]}>All ({allWords.length})</Text>
          </Pressable>
          <Pressable
            style={[s.filterChip, s.filterChipRev, activeFilter === 'revision' && s.filterChipActive]}
            onPress={() => setActiveFilter('revision')}
          >
            <Ionicons name={activeFilter === 'revision' ? 'bookmark' : 'bookmark-outline'} size={12} color={activeFilter === 'revision' ? '#f59e0b' : '#888'} />
            <Text style={[s.filterChipText, activeFilter === 'revision' && { color: '#f59e0b' }]}>
              Needs Revision {revCount > 0 ? `(${revCount})` : ''}
            </Text>
          </Pressable>
        </View>

        {/* Word list */}
        {loading ? (
          <View style={s.center}><ActivityIndicator color="#646cff" /></View>
        ) : displayed.length === 0 ? (
          <View style={s.center}>
            <Text style={s.emptyText}>
              {activeFilter === 'revision'
                ? 'No words marked for revision yet.'
                : searchInput.trim()
                ? `No words match "${searchInput}".`
                : 'No words added yet. Add your first word above.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayed}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <WordRow
                spelling={item}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onRevision={handleRevision}
                onDelete={handleDelete}
                expandedId={expandedId}
                onToggleExpand={toggleExpand}
                allWords={allWords}
                profileId={profileId}
                onAddSuggestion={handleAddSuggestion}
              />
            )}
            contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: '#0f0f0f' },
  addRow:           { flexDirection: 'row', gap: 8, padding: 12, paddingBottom: 6 },
  addInput:         { flex: 1, backgroundColor: '#1e1e1e', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#333' },
  addBtn:           { backgroundColor: '#646cff', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 11, justifyContent: 'center' },
  addBtnDis:        { opacity: 0.4 },
  addBtnText:       { color: '#fff', fontWeight: '700', fontSize: 15 },
  searchRow:        { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginBottom: 8, backgroundColor: '#1a1a1a', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  searchInput:      { flex: 1, color: '#fff', fontSize: 14 },
  filterRow:        { flexDirection: 'row', gap: 8, paddingHorizontal: 12, marginBottom: 6 },
  filterChip:       { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#2a2a2a' },
  filterChipRev:    {},
  filterChipActive: { backgroundColor: 'rgba(100,108,255,0.1)', borderColor: '#646cff' },
  filterChipText:   { color: '#888', fontSize: 13 },
  filterChipTextActive: { color: '#646cff', fontWeight: '600' },
  center:           { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText:        { color: '#555', fontSize: 14, textAlign: 'center', lineHeight: 22 },
})
