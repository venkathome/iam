import { useState, useRef, useEffect } from 'react'
import {
  View, Text, TextInput, ScrollView, Pressable, StyleSheet,
  SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@apollo/client/react'
import { Ionicons } from '@expo/vector-icons'
import * as Speech from 'expo-speech'
import { GET_PROFILES } from '../../../src/apollo/queries'
import { CHAT_URL } from '../../../src/config'

const LANGS = [
  { code: 'en', label: 'English', script: 'En',    tts: 'en-US', name: 'Alex'  },
  { code: 'ta', label: 'Tamil',   script: 'தமிழ்',  tts: 'ta-IN', name: 'Mani'  },
  { code: 'hi', label: 'Hindi',   script: 'हिंदी',   tts: 'hi-IN', name: 'Arjun' },
]

export default function ConversationScreen() {
  const { profileId } = useLocalSearchParams()
  const { data } = useQuery(GET_PROFILES)

  const profileNameRef = useRef('friend')
  profileNameRef.current = (data?.profiles ?? []).find(p => p.id === profileId)?.firstName ?? 'friend'

  const [activeLang, setActiveLang] = useState('en')
  const [startKey,   setStartKey]   = useState(0)
  const [messages,   setMessages]   = useState([])
  const [history,    setHistory]    = useState([])
  const [input,      setInput]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [speakingId, setSpeakingId] = useState(null)

  const scrollRef  = useRef(null)
  const sessionRef = useRef(0)

  const lang = LANGS.find(l => l.code === activeLang)

  // Start / restart conversation when language or startKey changes
  useEffect(() => {
    const session = ++sessionRef.current
    const langObj  = LANGS.find(l => l.code === activeLang)

    Speech.stop()
    setSpeakingId(null)
    setMessages([])
    setHistory([])
    setInput('')
    setLoading(true)

    const seed = [{ role: 'user', content: 'Hello!' }]

    fetch(CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: seed, language: activeLang, profileName: profileNameRef.current }),
    })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(json => {
        if (sessionRef.current !== session) return
        const id = 'a0'
        setMessages([{ id, role: 'agent', content: json.content }])
        setHistory([...seed, { role: 'assistant', content: json.content }])
        setLoading(false)
        doSpeak(id, json.content, langObj.tts)
      })
      .catch(() => {
        if (sessionRef.current !== session) return
        setMessages([{ id: 'err', role: 'agent', content: 'Could not connect to the conversation server. Please make sure the server is running and ANTHROPIC_API_KEY is set.' }])
        setLoading(false)
      })

    return () => { Speech.stop() }
  }, [activeLang, startKey])

  // Scroll to bottom on new messages
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80)
  }, [messages.length, loading])

  function doSpeak(id, text, ttsLang) {
    Speech.stop()
    setSpeakingId(id)
    Speech.speak(text, {
      language: ttsLang,
      rate: 0.92,
      onDone:  () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    })
  }

  function handleToggleSpeak(msg) {
    if (speakingId === msg.id) { Speech.stop(); setSpeakingId(null) }
    else doSpeak(msg.id, msg.content, lang.tts)
  }

  function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const session = sessionRef.current
    setInput('')
    Speech.stop()
    setSpeakingId(null)

    const userId   = `u${Date.now()}`
    const newHist  = [...history, { role: 'user', content: text }]

    setMessages(prev => [...prev, { id: userId, role: 'user', content: text }])
    setHistory(newHist)
    setLoading(true)

    fetch(CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newHist, language: activeLang, profileName: profileNameRef.current }),
    })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(json => {
        if (sessionRef.current !== session) return
        const agentId = `a${Date.now()}`
        setMessages(prev => [...prev, { id: agentId, role: 'agent', content: json.content }])
        setHistory(prev => [...prev, { role: 'assistant', content: json.content }])
        setLoading(false)
        doSpeak(agentId, json.content, lang.tts)
      })
      .catch(() => {
        if (sessionRef.current !== session) return
        setMessages(prev => [...prev, { id: `e${Date.now()}`, role: 'agent', content: 'Something went wrong. Please try again.' }])
        setLoading(false)
      })
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Language picker */}
      <View style={s.langRow}>
        {LANGS.map(l => (
          <Pressable
            key={l.code}
            style={[s.langPill, activeLang === l.code && s.langPillOn]}
            onPress={() => activeLang !== l.code && setActiveLang(l.code)}
          >
            <Text style={[s.langScript, activeLang === l.code && s.langScriptOn]}>{l.script}</Text>
            <Text style={[s.langLabel, activeLang === l.code && s.langLabelOn]}>{l.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Agent info bar */}
      <View style={s.agentBar}>
        <View style={s.agentAvatar}>
          <Text style={s.agentEmoji}>💬</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.agentName}>{lang.name}</Text>
          <Text style={s.agentSub}>Your {lang.label} conversation partner</Text>
        </View>
        <Pressable style={s.restartBtn} onPress={() => setStartKey(k => k + 1)}>
          <Ionicons name="refresh-outline" size={18} color="#555" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Chat messages */}
        <ScrollView
          ref={scrollRef}
          style={s.chat}
          contentContainerStyle={s.chatContent}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(msg => (
            <View key={msg.id} style={[s.bubble, msg.role === 'user' ? s.bUser : s.bAgent]}>
              <Text style={[s.bubbleText, msg.role === 'user' ? s.tUser : s.tAgent]}>
                {msg.content}
              </Text>
              {msg.role === 'agent' && (
                <Pressable style={s.ttsBtn} onPress={() => handleToggleSpeak(msg)}>
                  <Ionicons
                    name={speakingId === msg.id ? 'volume-high' : 'volume-medium-outline'}
                    size={13}
                    color={speakingId === msg.id ? '#10b981' : '#444'}
                  />
                </Pressable>
              )}
            </View>
          ))}

          {loading && (
            <View style={[s.bubble, s.bAgent, s.bTyping]}>
              <ActivityIndicator size="small" color="#10b981" />
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={s.inputRow}>
          <TextInput
            style={s.textInput}
            placeholder="Type your reply…"
            placeholderTextColor="#444"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!loading}
            multiline
            blurOnSubmit={false}
          />
          <Pressable
            style={[s.sendBtn, (!input.trim() || loading) && s.sendDis]}
            onPress={handleSend}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={16} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#0f0f0f' },

  langRow:       { flexDirection: 'row', gap: 8, padding: 12, paddingBottom: 8 },
  langPill:      { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 16, backgroundColor: '#181818', borderWidth: 1, borderColor: '#252525' },
  langPillOn:    { backgroundColor: 'rgba(16,185,129,0.1)', borderColor: '#10b981' },
  langScript:    { color: '#555', fontSize: 13, fontWeight: '800' },
  langScriptOn:  { color: '#10b981' },
  langLabel:     { color: '#555', fontSize: 11, marginTop: 2 },
  langLabelOn:   { color: '#10b981' },

  agentBar:      { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#171717' },
  agentAvatar:   { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(16,185,129,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(16,185,129,0.22)' },
  agentEmoji:    { fontSize: 20 },
  agentName:     { color: '#10b981', fontSize: 15, fontWeight: '700' },
  agentSub:      { color: '#444', fontSize: 11 },
  restartBtn:    { padding: 8 },

  chat:          { flex: 1 },
  chatContent:   { padding: 12, gap: 10, paddingBottom: 24 },

  bubble:        { maxWidth: '82%', borderRadius: 18, padding: 12 },
  bAgent:        { alignSelf: 'flex-start', backgroundColor: 'rgba(16,185,129,0.07)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.18)' },
  bUser:         { alignSelf: 'flex-end', backgroundColor: 'rgba(100,108,255,0.1)', borderWidth: 1, borderColor: 'rgba(100,108,255,0.25)' },
  bubbleText:    { fontSize: 15, lineHeight: 22 },
  tAgent:        { color: '#ddd' },
  tUser:         { color: '#c4c6ff' },
  bTyping:       { paddingVertical: 14, paddingHorizontal: 20 },
  ttsBtn:        { marginTop: 6, alignSelf: 'flex-start' },

  inputRow:      { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, borderTopWidth: 1, borderTopColor: '#171717' },
  textInput:     { flex: 1, backgroundColor: '#181818', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#252525', maxHeight: 100 },
  sendBtn:       { width: 42, height: 42, borderRadius: 21, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  sendDis:       { opacity: 0.35 },
})
