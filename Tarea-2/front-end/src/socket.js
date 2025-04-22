import { io } from 'socket.io-client';

const socket = io('http://localhost:3000')


const form = document.getElementById('form');
const input = document.getElementById('input');
const myMsg = document.getElementById('my-message');
const peerMsg = document.getElementById('peer-message');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('message', {msg: input.value, userId: sessionStorage.getItem('peerId')});
        input.value = '';
    }
});

socket.on('message', (msg) => {
    if (msg.userId === sessionStorage.getItem('peerId')) {
        myMsg.innerHTML = msg.msg;
        setTimeout(() => {
            myMsg.innerHTML = '';
        }, 10000);
    } else if (msg.userId === sessionStorage.getItem('currentCallPeer')) {
        peerMsg.innerHTML = msg.msg;
        setTimeout(() => {
            peerMsg.innerHTML = '';
        }, 10000);
    }
});
