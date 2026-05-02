import React, { useState, useEffect, useCallback } from 'react'
import {
  View, Text, Pressable, StyleSheet, SafeAreaView,
  ScrollView, TextInput, Dimensions,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'

const STORAGE_KEY = '@ttt_history_v1'

const C = {
  X:      '#a78bfa',
  O:      '#fb923c',
  win:    '#4ade80',
  draw:   '#f59e0b',
  bg:     '#0f0f0f',
  card:   '#1a1a1a',
  card2:  '#1e1e1e',
  border: '#2a2a2a',
  text:   '#ffffff',
  muted:  '#888888',
  dim:    '#444444',
  danger: '#ef4444',
}

// ─── Win detection ────────────────────────────────────────────────────────────
function checkWin(board, size) {
  const check = (cells) => {
    const sym = board[cells[0]]
    return sym && cells.every(i => board[i] === sym) ? { sym, line: cells } : null
  }
  for (let r = 0; r < size; r++) {
    const res = check(Array.from({ length: size }, (_, c) => r * size + c))
    if (res) return res
  }
  for (let c = 0; c < size; c++) {
    const res = check(Array.from({ length: size }, (_, r) => r * size + c))
    if (res) return res
  }
  const d1 = check(Array.from({ length: size }, (_, i) => i * size + i))
  if (d1) return d1
  const d2 = check(Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)))
  if (d2) return d2
  return null
}

// ─── Board component ──────────────────────────────────────────────────────────
function Board({ board, size, winLine, onPress, disabled }) {
  const sw = Dimensions.get('window').width
  const cellSize = Math.floor((sw - 48 - (size - 1) * 4) / size)
  const fontSize = Math.floor(cellSize * 0.46)

  return (
    <View style={{ gap: 4, alignSelf: 'center' }}>
      {Array.from({ length: size }, (_, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: 4 }}>
          {Array.from({ length: size }, (_, c) => {
            const idx = r * size + c
            const sym = board[idx]
            const highlighted = winLine?.includes(idx)
            return (
              <Pressable
                key={c}
                onPress={() => onPress(idx)}
                disabled={disabled || !!sym}
                style={({ pressed }) => ({
                  width: cellSize,
                  height: cellSize,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: highlighted ? C.win : pressed && !sym ? C.muted : C.border,
                  backgroundColor: highlighted
                    ? 'rgba(74,222,128,0.18)'
                    : pressed && !sym
                    ? 'rgba(255,255,255,0.04)'
                    : C.card2,
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                {sym ? (
                  <Text style={{ fontSize, fontWeight: '800', color: C[sym] }}>{sym}</Text>
                ) : null}
              </Pressable>
            )
          })}
        </View>
      ))}
    </View>
  )
}

// ─── Score strip ──────────────────────────────────────────────────────────────
function ScoreStrip({ players, draws }) {
  return (
    <View style={s.scoreStrip}>
      <View style={s.scorePlayer}>
        <Text style={[s.scoreSym, { color: C.X }]}>X</Text>
        <Text style={[s.scoreName, { color: C.X }]} numberOfLines={1}>{players[0].name}</Text>
        <Text style={[s.scoreNum, { color: C.X }]}>{players[0].score}</Text>
      </View>
      <View style={s.scoreMid}>
        <Text style={s.drawLabel}>DRAWS</Text>
        <Text style={s.drawNum}>{draws}</Text>
      </View>
      <View style={[s.scorePlayer, { alignItems: 'flex-end' }]}>
        <Text style={[s.scoreSym, { color: C.O }]}>O</Text>
        <Text style={[s.scoreName, { color: C.O }]} numberOfLines={1}>{players[1].name}</Text>
        <Text style={[s.scoreNum, { color: C.O }]}>{players[1].score}</Text>
      </View>
    </View>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, color }) {
  return (
    <View style={s.statCard}>
      <Text style={[s.statNum, color ? { color } : null]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TicTacToe() {
  const [tab, setTab]         = useState('game')
  const [phase, setPhase]     = useState('setup')
  const [boardSize, setBoardSize] = useState(3)
  const [names, setNames]     = useState(['Player 1', 'Player 2'])
  const [players, setPlayers] = useState([
    { name: 'Player 1', symbol: 'X', score: 0 },
    { name: 'Player 2', symbol: 'O', score: 0 },
  ])
  const [board, setBoard]       = useState(Array(9).fill(null))
  const [current, setCurrent]   = useState(0)
  const [winResult, setWinResult] = useState(null)
  const [draws, setDraws]       = useState(0)
  const [history, setHistory]   = useState([])
  const [moves, setMoves]       = useState(0)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) try { setHistory(JSON.parse(raw)) } catch (_) {}
    })
  }, [])

  const persist = useCallback(async (h) => {
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(h)) } catch (_) {}
  }, [])

  const addHistory = useCallback((entry) => {
    setHistory(prev => {
      const nh = [entry, ...prev]
      persist(nh)
      return nh
    })
  }, [persist])

  const startGame = useCallback(() => {
    setPlayers([
      { name: names[0] || 'Player 1', symbol: 'X', score: players[0].score },
      { name: names[1] || 'Player 2', symbol: 'O', score: players[1].score },
    ])
    setBoard(Array(boardSize * boardSize).fill(null))
    setCurrent(0)
    setWinResult(null)
    setMoves(0)
    setPhase('playing')
  }, [names, boardSize, players])

  const handleCell = useCallback((idx) => {
    if (phase !== 'playing' || board[idx]) return
    const nb = [...board]
    nb[idx] = players[current].symbol
    const nm = moves + 1
    setBoard(nb)
    setMoves(nm)

    const result = checkWin(nb, boardSize)
    if (result) {
      const wi = players.findIndex(p => p.symbol === result.sym)
      setPlayers(prev => prev.map((p, i) => i === wi ? { ...p, score: p.score + 1 } : p))
      setWinResult(result)
      addHistory({
        id: `${Date.now()}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        boardSize,
        result: 'win',
        winner: players[wi].name,
        loser: players[1 - wi].name,
        moves: nm,
      })
      setPhase('ended')
    } else if (nb.every(Boolean)) {
      setWinResult('draw')
      setDraws(d => d + 1)
      addHistory({
        id: `${Date.now()}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        boardSize,
        result: 'draw',
        players: [players[0].name, players[1].name],
        moves: nm,
      })
      setPhase('ended')
    } else {
      setCurrent(c => 1 - c)
    }
  }, [phase, board, players, current, moves, boardSize, addHistory])

  const handleResign = useCallback(() => {
    const wi = 1 - current
    setPlayers(prev => prev.map((p, i) => i === wi ? { ...p, score: p.score + 1 } : p))
    addHistory({
      id: `${Date.now()}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      boardSize,
      result: 'resign',
      winner: players[wi].name,
      loser: players[current].name,
      moves,
    })
    setWinResult({ sym: players[wi].symbol, resign: true })
    setPhase('ended')
  }, [current, players, boardSize, moves, addHistory])

  const playAgain = useCallback(() => {
    setBoard(Array(boardSize * boardSize).fill(null))
    setCurrent(0)
    setWinResult(null)
    setMoves(0)
    setPhase('playing')
  }, [boardSize])

  const goMenu = useCallback(() => setPhase('setup'), [])

  const resetSession = useCallback(() => {
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })))
    setDraws(0)
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    persist([])
  }, [persist])

  const winnerName = winResult && winResult !== 'draw'
    ? players.find(p => p.symbol === winResult.sym)?.name
    : null

  const allTimeStats = history.reduce((acc, g) => {
    if (g.result === 'draw') acc.draws++
    else if (g.winner) acc.wins[g.winner] = (acc.wins[g.winner] || 0) + 1
    return acc
  }, { wins: {}, draws: 0 })

  const topPlayers = Object.entries(allTimeStats.wins)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)

  const hasSession = players[0].score > 0 || players[1].score > 0 || draws > 0

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />

      {/* Tab bar */}
      <View style={s.tabBar}>
        {[
          { key: 'game',    icon: 'game-controller-outline', label: 'Game' },
          { key: 'history', icon: 'trophy-outline',          label: 'Stats & History' },
        ].map(({ key, icon, label }) => (
          <Pressable
            key={key}
            style={[s.tabBtn, tab === key && s.tabBtnActive]}
            onPress={() => setTab(key)}
          >
            <Ionicons name={icon} size={16} color={tab === key ? C.X : C.muted} />
            <Text style={[s.tabLabel, tab === key && { color: C.X }]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 'game' ? (
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <ScoreStrip players={players} draws={draws} />

          {/* ── Setup ── */}
          {phase === 'setup' && (
            <View style={s.section}>
              <Text style={s.heading}>Players</Text>
              {[0, 1].map(i => (
                <View key={i} style={s.playerRow}>
                  <View style={[s.symBadge, { borderColor: C[i === 0 ? 'X' : 'O'] }]}>
                    <Text style={[s.symText, { color: C[i === 0 ? 'X' : 'O'] }]}>
                      {i === 0 ? 'X' : 'O'}
                    </Text>
                  </View>
                  <TextInput
                    style={s.nameInput}
                    value={names[i]}
                    onChangeText={v => setNames(prev => prev.map((n, j) => j === i ? v : n))}
                    placeholder={`Player ${i + 1}`}
                    placeholderTextColor={C.dim}
                    maxLength={20}
                    selectTextOnFocus
                  />
                </View>
              ))}

              <Text style={[s.heading, { marginTop: 20 }]}>Board Size</Text>
              <View style={s.sizeRow}>
                {[
                  { sz: 3, label: '3×3', hint: 'Classic' },
                  { sz: 4, label: '4×4', hint: 'Medium' },
                  { sz: 5, label: '5×5', hint: 'Large' },
                ].map(({ sz, label, hint }) => (
                  <Pressable
                    key={sz}
                    style={[s.sizeChip, boardSize === sz && { borderColor: C.X, backgroundColor: `${C.X}20` }]}
                    onPress={() => setBoardSize(sz)}
                  >
                    <Text style={[s.sizeLabel, boardSize === sz && { color: C.X, fontWeight: '700' }]}>{label}</Text>
                    <Text style={[s.sizeHint, boardSize === sz && { color: C.X }]}>{hint}</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable style={s.primaryBtn} onPress={startGame}>
                <Ionicons name="play" size={18} color="#000" />
                <Text style={s.primaryBtnTxt}>Start Game</Text>
              </Pressable>

              {hasSession && (
                <Pressable style={s.ghostBtn} onPress={resetSession}>
                  <Ionicons name="refresh-outline" size={15} color={C.muted} />
                  <Text style={s.ghostBtnTxt}>Reset Session Scores</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* ── Playing ── */}
          {phase === 'playing' && (
            <View style={s.section}>
              <View style={s.turnBanner}>
                <Text style={[s.turnSym, { color: C[players[current].symbol] }]}>
                  {players[current].symbol}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.turnName, { color: C[players[current].symbol] }]}>
                    {players[current].name}
                  </Text>
                  <Text style={s.turnHint}>it's your turn</Text>
                </View>
                <Text style={s.moveCount}>Move {moves + 1}</Text>
              </View>

              <Board
                board={board}
                size={boardSize}
                winLine={null}
                onPress={handleCell}
                disabled={false}
              />

              <Pressable style={s.ghostBtn} onPress={handleResign}>
                <Ionicons name="flag-outline" size={15} color={C.muted} />
                <Text style={s.ghostBtnTxt}>Resign</Text>
              </Pressable>
            </View>
          )}

          {/* ── Ended ── */}
          {phase === 'ended' && (
            <View style={s.section}>
              <View style={s.resultBanner}>
                {winResult === 'draw' ? (
                  <>
                    <Text style={s.resultEmoji}>🤝</Text>
                    <Text style={[s.resultTitle, { color: C.draw }]}>It's a Draw!</Text>
                    <Text style={s.resultSub}>{moves} moves played</Text>
                  </>
                ) : winResult?.resign ? (
                  <>
                    <Text style={s.resultEmoji}>🏳️</Text>
                    <Text style={[s.resultTitle, { color: C[winResult.sym] }]}>{winnerName} Wins!</Text>
                    <Text style={s.resultSub}>by resignation</Text>
                  </>
                ) : (
                  <>
                    <Text style={s.resultEmoji}>🎉</Text>
                    <Text style={[s.resultTitle, { color: C[winResult?.sym] }]}>{winnerName} Wins!</Text>
                    <Text style={s.resultSub}>in {moves} moves</Text>
                  </>
                )}
              </View>

              <Board
                board={board}
                size={boardSize}
                winLine={winResult !== 'draw' && !winResult?.resign ? winResult?.line : null}
                onPress={() => {}}
                disabled
              />

              <View style={s.endRow}>
                <Pressable style={[s.primaryBtn, { flex: 1 }]} onPress={playAgain}>
                  <Ionicons name="refresh" size={18} color="#000" />
                  <Text style={s.primaryBtnTxt}>Play Again</Text>
                </Pressable>
                <Pressable style={[s.ghostBtn, { flex: 1 }]} onPress={goMenu}>
                  <Ionicons name="home-outline" size={16} color={C.muted} />
                  <Text style={s.ghostBtnTxt}>Menu</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      ) : (
        /* ── History tab ── */
        <ScrollView contentContainerStyle={s.scroll}>
          {history.length === 0 ? (
            <View style={s.empty}>
              <Ionicons name="trophy-outline" size={60} color={C.dim} />
              <Text style={s.emptyTitle}>No games yet</Text>
              <Text style={s.emptyHint}>Start a game to build your history</Text>
            </View>
          ) : (
            <>
              <View style={s.section}>
                <Text style={s.heading}>All-Time Stats</Text>
                <View style={s.statsRow}>
                  <StatCard label="Games"  value={history.length} />
                  <StatCard label="Wins"   value={history.filter(g => g.result !== 'draw').length} color={C.win} />
                  <StatCard label="Draws"  value={allTimeStats.draws} color={C.draw} />
                </View>
              </View>

              {topPlayers.length > 0 && (
                <View style={s.section}>
                  <Text style={s.heading}>Leaderboard</Text>
                  {topPlayers.map(([name, wins], i) => (
                    <View key={name} style={s.leaderRow}>
                      <Text style={s.leaderRank}>#{i + 1}</Text>
                      <Text style={s.leaderName} numberOfLines={1}>{name}</Text>
                      <View style={s.leaderRight}>
                        <Text style={{ color: C.win, fontSize: 15, fontWeight: '800' }}>{wins}</Text>
                        <Text style={{ color: C.muted, fontSize: 12 }}> wins</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <View style={s.section}>
                <View style={s.logHeader}>
                  <Text style={s.heading}>Game Log</Text>
                  <Pressable onPress={clearHistory}>
                    <Text style={{ color: C.danger, fontSize: 13, fontWeight: '600' }}>Clear All</Text>
                  </Pressable>
                </View>
                {history.map(g => (
                  <View key={g.id} style={s.logCard}>
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text style={s.logMain} numberOfLines={1}>
                        {g.result === 'draw'
                          ? `Draw — ${g.players?.join(' vs ')}`
                          : `${g.winner} defeated ${g.loser}${g.result === 'resign' ? ' (resign)' : ''}`}
                      </Text>
                      <Text style={s.logMeta}>
                        {g.boardSize}×{g.boardSize} · {g.moves} moves · {g.date} {g.time}
                      </Text>
                    </View>
                    <View style={[s.logBadge, {
                      backgroundColor: g.result === 'draw'
                        ? 'rgba(245,158,11,0.15)' : 'rgba(74,222,128,0.15)',
                    }]}>
                      <Text style={{
                        fontSize: 10, fontWeight: '700',
                        color: g.result === 'draw' ? C.draw : C.win,
                      }}>
                        {g.result === 'resign' ? 'RESIGN' : g.result.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // Tabs
  tabBar:       { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border },
  tabBtn:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 13 },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: C.X },
  tabLabel:     { fontSize: 14, fontWeight: '600', color: C.muted },

  scroll:  { padding: 20 },
  section: { gap: 10, marginBottom: 22 },
  heading: { fontSize: 11, fontWeight: '700', color: C.muted, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 2 },

  // Score strip
  scoreStrip:  { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 20 },
  scorePlayer: { flex: 1, gap: 1 },
  scoreSym:    { fontSize: 18, fontWeight: '900' },
  scoreName:   { fontSize: 13, fontWeight: '600' },
  scoreNum:    { fontSize: 30, fontWeight: '800' },
  scoreMid:    { alignItems: 'center', paddingHorizontal: 14 },
  drawLabel:   { fontSize: 9, fontWeight: '700', color: C.muted, letterSpacing: 1 },
  drawNum:     { fontSize: 22, fontWeight: '700', color: C.muted },

  // Setup
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 12, padding: 14 },
  symBadge:  { width: 38, height: 38, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  symText:   { fontSize: 18, fontWeight: '900' },
  nameInput: { flex: 1, fontSize: 16, color: C.text, fontWeight: '500' },
  sizeRow:   { flexDirection: 'row', gap: 10 },
  sizeChip:  { flex: 1, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, padding: 12, alignItems: 'center', gap: 3 },
  sizeLabel: { fontSize: 16, fontWeight: '600', color: C.text },
  sizeHint:  { fontSize: 11, color: C.muted },

  // Buttons
  primaryBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.X, borderRadius: 14, paddingVertical: 16 },
  primaryBtnTxt: { fontSize: 16, fontWeight: '700', color: '#000' },
  ghostBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingVertical: 13 },
  ghostBtnTxt:   { fontSize: 14, fontWeight: '600', color: C.muted },

  // Turn banner
  turnBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 14, padding: 14 },
  turnSym:    { fontSize: 28, fontWeight: '900', width: 34 },
  turnName:   { fontSize: 16, fontWeight: '700' },
  turnHint:   { fontSize: 12, color: C.muted },
  moveCount:  { fontSize: 12, color: C.dim, fontWeight: '600' },

  // Result banner
  resultBanner: { alignItems: 'center', gap: 4, backgroundColor: C.card, borderRadius: 16, padding: 22 },
  resultEmoji:  { fontSize: 48 },
  resultTitle:  { fontSize: 26, fontWeight: '800' },
  resultSub:    { fontSize: 14, color: C.muted },
  endRow:       { flexDirection: 'row', gap: 10 },

  // History tab
  empty:      { alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 80 },
  emptyTitle: { fontSize: 18, color: C.muted, fontWeight: '600' },
  emptyHint:  { fontSize: 14, color: C.dim },

  statsRow:  { flexDirection: 'row', gap: 10 },
  statCard:  { flex: 1, backgroundColor: C.card, borderRadius: 12, padding: 14, alignItems: 'center', gap: 3 },
  statNum:   { fontSize: 26, fontWeight: '800', color: C.text },
  statLabel: { fontSize: 11, color: C.muted, fontWeight: '600' },

  leaderRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 10, padding: 13, gap: 10 },
  leaderRank:  { fontSize: 13, fontWeight: '700', color: C.muted, width: 30 },
  leaderName:  { flex: 1, fontSize: 15, fontWeight: '600', color: C.text },
  leaderRight: { flexDirection: 'row', alignItems: 'baseline' },

  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  logCard:   { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 10, padding: 13, gap: 10 },
  logMain:   { fontSize: 14, fontWeight: '600', color: C.text },
  logMeta:   { fontSize: 12, color: C.muted },
  logBadge:  { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
})
