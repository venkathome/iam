import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  View, Text, Pressable, StyleSheet, Animated,
  LayoutAnimation, UIManager, Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const Ctx = createContext(null)
let seq = 0

const COLORS = {
  success: { border: '#10b981', icon: '#10b981', iconBg: 'rgba(16,185,129,0.15)' },
  error:   { border: '#ef4444', icon: '#ef4444', iconBg: 'rgba(239,68,68,0.15)'  },
  info:    { border: '#3b82f6', icon: '#3b82f6', iconBg: 'rgba(59,130,246,0.15)' },
  warning: { border: '#f59e0b', icon: '#f59e0b', iconBg: 'rgba(245,158,11,0.15)' },
}

const ICONS = { success: '✓', error: '✕', info: 'i', warning: '!' }

function ToastItem({ toast, onDismiss }) {
  const opacity  = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(16)).current
  const clr = COLORS[toast.type]

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, tension: 70, friction: 12, useNativeDriver: true }),
    ]).start()
  }, [])

  function handleDismiss() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    onDismiss(toast.id)
  }

  return (
    <Animated.View
      style={[
        s.toast,
        { borderLeftColor: clr.border },
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <Pressable style={s.toastInner} onPress={handleDismiss}>
        <View style={[s.iconWrap, { backgroundColor: clr.iconBg }]}>
          <Text style={[s.icon, { color: clr.icon }]}>{ICONS[toast.type]}</Text>
        </View>
        <View style={s.body}>
          {toast.title && <Text style={s.title} numberOfLines={1}>{toast.title}</Text>}
          <Text style={s.msg} numberOfLines={3}>{toast.message}</Text>
        </View>
        <Text style={s.close}>×</Text>
      </Pressable>
    </Animated.View>
  )
}

function ToastOverlay({ toasts, onDismiss }) {
  const insets = useSafeAreaInsets()
  if (toasts.length === 0) return null

  return (
    <View
      style={[s.overlay, { bottom: Math.max(insets.bottom, 16) + 12 }]}
      pointerEvents="box-none"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </View>
  )
}

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback(id => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const show = useCallback((message, { type = 'info', title, duration } = {}) => {
    const id  = `n${++seq}`
    const dur = duration ?? (type === 'error' ? 5000 : 3500)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setToasts(prev => [...prev.slice(-3), { id, type, title, message }])
    if (dur > 0) timers.current[id] = setTimeout(() => dismiss(id), dur)
    return id
  }, [dismiss])

  const notify = useMemo(() => {
    const fn = (msg, opts) => show(msg, opts)
    fn.success = (msg, opts) => show(msg, { ...opts, type: 'success' })
    fn.error   = (msg, opts) => show(msg, { ...opts, type: 'error'   })
    fn.info    = (msg, opts) => show(msg, { ...opts, type: 'info'    })
    fn.warning = (msg, opts) => show(msg, { ...opts, type: 'warning' })
    return fn
  }, [show])

  return (
    <Ctx.Provider value={notify}>
      <View style={{ flex: 1 }}>
        {children}
        <ToastOverlay toasts={toasts} onDismiss={dismiss} />
      </View>
    </Ctx.Provider>
  )
}

export function useNotify() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useNotify must be used inside NotificationProvider')
  return ctx
}

const s = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 9999,
    gap: 6,
  },
  toast: {
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    borderLeftWidth: 3,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  toastInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 10,
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  icon:  { fontSize: 10, fontWeight: '900' },
  body:  { flex: 1 },
  title: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  msg:   { color: '#888', fontSize: 12, lineHeight: 17 },
  close: { color: '#444', fontSize: 20, lineHeight: 22, flexShrink: 0 },
})
