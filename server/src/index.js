import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import path from 'path';
import { existsSync, readdirSync, statSync } from 'fs';

const app = express();
const httpServer = http.createServer(app);

const THERAPY_BASE = path.normalize(
  "/Users/venkataramankrishnamani/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Desktop - Venkataraman’s MacBook Pro (2)/Time Capsule Backup/Diya/Therapy/Home"
)

const THERAPY_CORS = cors({ origin: 'http://localhost:5173' })

function safeAbs(rel) {
  if (!rel) return null
  const abs = path.normalize(path.join(THERAPY_BASE, rel))
  return abs.startsWith(THERAPY_BASE) ? abs : null
}

app.get('/therapy-file', THERAPY_CORS, (req, res) => {
  const abs = safeAbs(req.query.path)
  if (!abs) return res.status(400).end()
  if (!existsSync(abs)) return res.status(404).end()
  res.sendFile(abs)
})

app.get('/therapy-files', THERAPY_CORS, (req, res) => {
  const abs = safeAbs(req.query.dir || '.')
  if (!abs) return res.json([])
  if (!existsSync(abs)) return res.json([])
  try {
    const files = readdirSync(abs)
      .filter(name => !name.startsWith('.') && name.toLowerCase().endsWith('.pdf'))
      .filter(name => { try { return statSync(path.join(abs, name)).isFile() } catch { return false } })
      .sort()
    res.json(files)
  } catch {
    res.json([])
  }
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.post('/api/chat', cors(), bodyParser.json(), async (req, res) => {
  const { messages, language, profileName } = req.body ?? {}
  if (!Array.isArray(messages) || !language) {
    return res.status(400).json({ error: 'messages array and language required' })
  }

  const name = profileName || 'friend'
  const systemPrompts = {
    en: `You are Alex, a cheerful and encouraging conversation partner for ${name}. Speak only English. Have a fun, natural conversation — ask one interesting question at a time about hobbies, sports, food, animals, books, school, or games. Keep every response to 2-3 sentences max. Warmly acknowledge what ${name} says, then ask a follow-up question. Be positive and upbeat.`,
    ta: `You are Mani (மணி), a friendly conversation partner helping ${name} practice Tamil. Speak primarily in simple, everyday Tamil; use English words only when a Tamil equivalent would be difficult. Ask one simple question at a time about Tamil festivals (Pongal, Deepavali, Karthigai), Tamil food, family, school, or stories. Keep every response to 2-3 sentences. Be patient and encouraging.`,
    hi: `You are Arjun (अर्जुन), a friendly conversation partner helping ${name} practice Hindi. Speak primarily in simple, everyday Hindi; use English words only when needed. Ask one simple question at a time about Indian festivals, cricket, Bollywood, Indian food, family, or school. Keep every response to 2-3 sentences. Be warm and enthusiastic.`,
  }

  const systemPrompt = systemPrompts[language] ?? systemPrompts.en
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY is not set on the server.' })
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages,
      }),
    })

    if (!upstream.ok) {
      const errText = await upstream.text()
      console.error('Anthropic error:', upstream.status, errText)
      return res.status(502).json({ error: 'AI service error' })
    }

    const result = await upstream.json()
    res.json({ content: result.content[0].text })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/tts', cors({ origin: 'http://localhost:5173' }), async (req, res) => {
  const { text } = req.query
  if (!text) return res.status(400).json({ error: 'text is required' })

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ta&q=${encodeURIComponent(text)}`
  try {
    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' },
    })
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`)
    res.set('Content-Type', 'audio/mpeg')
    res.send(Buffer.from(await upstream.arrayBuffer()))
  } catch (err) {
    console.error('TTS error:', err.message)
    res.status(502).json({ error: 'TTS unavailable' })
  }
})

app.use(
  '/graphql',
  cors({ origin: 'http://localhost:5173' }),
  bodyParser.json(),
  expressMiddleware(server),
);

const PORT = process.env.PORT || 4000;
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`Server ready at http://localhost:${PORT}/graphql`);
