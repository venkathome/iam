// ─── Server configuration ────────────────────────────────────────────────────
//
// iOS Simulator  → localhost works as-is
// Real device    → replace with your Mac's local IP (e.g. 192.168.1.42)
//   Find it with: ifconfig | grep "inet " | grep -v 127.0.0.1
//
export const SERVER_HOST = 'localhost'
export const SERVER_PORT = 4000
export const GRAPHQL_URL  = `http://${SERVER_HOST}:${SERVER_PORT}/graphql`
export const TTS_URL      = `http://${SERVER_HOST}:${SERVER_PORT}/api/tts`
export const CHAT_URL     = `http://${SERVER_HOST}:${SERVER_PORT}/api/chat`
