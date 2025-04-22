
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const webpush    = require('web-push');
const http       = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');


const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: 'http://localhost:5173' } });

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

io.on('connection', socket => {
  console.log('🔌 Conexión establecida', socket.id);

  socket.on('message', ( message ) => {
    console.log('mensaje recibido', message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Desconexión', socket.id);
  });
});

// VAPID keys en .env: VAPID_PUBLIC, VAPID_PRIVATE
webpush.setVapidDetails(
  'mailto:tu-email@dominio.com',
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

const subscriptions = [];

// Guarda la suscripción del cliente
app.post('/api/subscribe', (req, res) => {
  const { subscription, peerId } = req.body;
  subscriptions.push({ peerId, subscription });
  res.sendStatus(201);
});

// Notifica a un peer
app.post('/api/notify', async (req, res) => {
  const { target, title, body, from } = req.body;
  const payload = JSON.stringify({ title, body, peerId: from });
  const subs = subscriptions.filter(s => s.peerId === target);
  if (!subs.length) return res.status(404).send('No subscription');
  try {
    await Promise.all(subs.map(s => webpush.sendNotification(s.subscription, payload)));
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// PeerJS server
const peerServer = ExpressPeerServer(server, { debug: true });
app.use('/peerjs', peerServer);

server.listen(3000, () => console.log('Backend en http://localhost:3000'));

