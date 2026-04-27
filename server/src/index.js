import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

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
