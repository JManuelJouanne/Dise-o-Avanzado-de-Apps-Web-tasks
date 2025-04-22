
// src/main.js
import './style.css';
import Peer from 'peerjs';

////////////////////////////////////////////////////////////////////////////////
// 0) DOM refs y estado global
////////////////////////////////////////////////////////////////////////////////
const offlineBanner = document.getElementById('offline-banner');
const myIdSpan      = document.getElementById('my-id');
const remoteIdInput = document.getElementById('remote-id');
const callBtn       = document.getElementById('call-btn');
const myVideoEl     = document.getElementById('my-video');
const peerVideoEl   = document.getElementById('peer-video');
const controlsDiv   = document.getElementById('controls');
const hangupBtn     = document.getElementById('hangup-btn');
const muteBtn       = document.getElementById('mute-btn');
const videoBtn      = document.getElementById('video-btn');
const muteIcon      = document.getElementById('mute-icon');
const muteLabel     = document.getElementById('mute-label');
const videoIcon     = document.getElementById('video-icon');
const videoLabel    = document.getElementById('video-label');

let swRegistration = null;
let localStream    = null;
let currentCall    = null;
let pendingCall    = null;

const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

////////////////////////////////////////////////////////////////////////////////
// Helpers de UI
////////////////////////////////////////////////////////////////////////////////
const showControls = () => controlsDiv?.classList.remove('hidden');
const hideControls = () => controlsDiv?.classList.add('hidden');
hideControls();

////////////////////////////////////////////////////////////////////////////////
// 1) Registrar Service Worker y arrancar PeerJS
////////////////////////////////////////////////////////////////////////////////
window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.register('/service-worker.js', { type: 'module' });
      console.log('✅ SW registrado');
    } catch (e) {
      console.error('❌ Error registrando SW:', e);
    }
  }
  updateOnlineStatus();
  initPeer();
});
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
  const offline = !navigator.onLine;
  offlineBanner?.classList.toggle('hidden', !offline);
  if (callBtn && remoteIdInput) {
    callBtn.disabled       = offline;
    remoteIdInput.disabled = offline;
  }
}

////////////////////////////////////////////////////////////////////////////////
// 2) Configurar PeerJS
////////////////////////////////////////////////////////////////////////////////
function initPeer() {
  const savedPeerId = sessionStorage.getItem('peerId');
  const peer = new Peer(savedPeerId || undefined, {
    host:   'localhost',
    port:   3000,
    path:   '/peerjs',
    secure: false,
    debug:  3
  });

  peer.on('error', err => console.error('❌ PeerJS error:', err));

  peer.on('open', async id => {
    console.log('🔗 Peer abierto con ID:', id);
    myIdSpan.textContent = id;
    if (!savedPeerId) sessionStorage.setItem('peerId', id);

    // Push subscription
    if (swRegistration) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') await subscribePush(id);
    }
  });

  // Incoming call
  peer.on('call', call => {
    console.log('🔔 Llamada entrante de', call.peer);
    pendingCall = call;
  });

  // Listener para respuesta de notificación (aceptar/rechazar)
  navigator.serviceWorker.addEventListener('message', ({ data }) => {
    if (data.type !== 'incoming-call-response' || !pendingCall) return;
    if (data.action === 'accept') {
      console.log('✅ Llamada aceptada');
      getLocalStream().then(stream => {
        pendingCall.answer(stream);
        setupCall(pendingCall);
        pendingCall = null;
      });
    } else {
      console.log('❌ Llamada rechazada');
      pendingCall.close();
      pendingCall = null;
    }
  });

  // Botones
  callBtn.addEventListener('click', () => startCall(peer));
  hangupBtn.addEventListener('click', hangUp);
  muteBtn.addEventListener('click', toggleMute);
  videoBtn.addEventListener('click', toggleVideo);
}

////////////////////////////////////////////////////////////////////////////////
// 3) Suscribir push
////////////////////////////////////////////////////////////////////////////////
async function subscribePush(peerId) {
  try {
    let sub = await swRegistration.pushManager.getSubscription();
    if (!sub) {
      sub = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY)
      });
    }
    const res = await fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ subscription: sub, peerId })
    });
    console.log('📨 Suscripción push enviada, status:', res.status);
  } catch (e) {
    console.error('❌ Error subscribePush:', e);
  }
}

////////////////////////////////////////////////////////////////////////////////
// 4) Iniciar llamada
////////////////////////////////////////////////////////////////////////////////
async function startCall(peer) {
  const target = remoteIdInput.value.trim();
  if (!target) return;
  console.log('📞 Iniciando llamada a', target);
  sessionStorage.setItem('currentCallPeer', target);
  sessionStorage.setItem('inCall', 'true');

  // Enviar notificación push
  const notifyRes = await fetch('http://localhost:3000/api/notify', {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({
      target,
      title: 'Videollamada entrante',
      body:  `Tienes llamada de ${peer.id}`,
      from:  peer.id
    })
  });
  console.log('/api/notify status:', notifyRes.status);

  // Obtener media y llamar
  const stream = await getLocalStream();
  showControls();
  setupCall(peer.call(target, stream));
}

////////////////////////////////////////////////////////////////////////////////
// 5) Obtener media local
////////////////////////////////////////////////////////////////////////////////
async function getLocalStream() {
  if (!localStream) {
    localStream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
    myVideoEl.srcObject = localStream;
  }
  return localStream;
}

////////////////////////////////////////////////////////////////////////////////
// 6) Configurar call
////////////////////////////////////////////////////////////////////////////////
function setupCall(call) {
  currentCall = call;
  call.on('stream', remoteStream => {
    peerVideoEl.srcObject = remoteStream;
  });
  call.on('close', hangUp);
}

////////////////////////////////////////////////////////////////////////////////
// 7) Colgar y limpiar todo
////////////////////////////////////////////////////////////////////////////////
function hangUp() {
  // Cerrar llamada
  if (currentCall) {
    currentCall.close();
    currentCall = null;
  }
  if (pendingCall) {
    pendingCall.close();
    pendingCall = null;
  }

  // Limpieza de estado
  sessionStorage.removeItem('currentCallPeer');
  sessionStorage.removeItem('inCall');
  hideControls();

  // Parar y resetear el stream
  if (localStream) {
    localStream.getTracks().forEach(t => t.stop());
    localStream = null;
  }
  myVideoEl.srcObject   = null;
  peerVideoEl.srcObject = null;
}

////////////////////////////////////////////////////////////////////////////////
// 8) Silenciar / Vídeo on‑off
////////////////////////////////////////////////////////////////////////////////
function toggleMute() {
  if (!localStream) return;
  const was = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks().forEach(t => t.enabled = !was);
  muteIcon.textContent  = was ? '🔇' : '🔊';
  muteLabel.textContent = was ? 'Activar Micrófono' : 'Desactivar Micrófono';
}
function toggleVideo() {
  if (!localStream) return;
  const was = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks().forEach(t => t.enabled = !was);
  videoIcon.textContent  = was ? '🎥' : '🎥❌';
  videoLabel.textContent = was ? 'Vídeo off' : 'Vídeo on';
}

////////////////////////////////////////////////////////////////////////////////
// 9) Helper VAPID
////////////////////////////////////////////////////////////////////////////////
function urlBase64ToUint8Array(b64) {
  const pad    = '='.repeat((4 - b64.length % 4) % 4);
  const base64 = (b64 + pad).replace(/-/g,'+').replace(/_/g,'/');
  return Uint8Array.from(atob(base64).split('').map(c => c.charCodeAt(0)));
}

