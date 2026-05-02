import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react'
import './NotificationContext.css'

const Ctx = createContext(null)
let seq = 0

const TYPE_META = {
  success: { icon: '✓' },
  error:   { icon: '✕' },
  info:    { icon: 'i' },
  warning: { icon: '!' },
}

function Toast({ toast, onDismiss }) {
  return (
    <div
      className={`notif-toast notif-${toast.type}`}
      role="alert"
      onClick={() => onDismiss(toast.id)}
    >
      <div className="notif-icon-wrap">
        <span className="notif-icon">{TYPE_META[toast.type].icon}</span>
      </div>
      <div className="notif-body">
        {toast.title && <div className="notif-title">{toast.title}</div>}
        <div className="notif-msg">{toast.message}</div>
      </div>
      <button
        className="notif-close"
        onClick={e => { e.stopPropagation(); onDismiss(toast.id) }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback(id => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const show = useCallback((message, { type = 'info', title, duration } = {}) => {
    const id = `n${++seq}`
    const dur = duration ?? (type === 'error' ? 5000 : 3500)
    setToasts(prev => [...prev.slice(-4), { id, type, title, message }])
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
      {children}
      <div className="notif-stack" aria-live="polite" aria-atomic="false">
        {toasts.map(t => <Toast key={t.id} toast={t} onDismiss={dismiss} />)}
      </div>
    </Ctx.Provider>
  )
}

export function useNotify() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useNotify must be used inside NotificationProvider')
  return ctx
}
