const banner = document.getElementById('offline-banner');
const startBtn = document.getElementById('start-call-btn');

function updateStatus() {
    const offline = !navigator.onLine;
    // Banner
    banner.classList.toggle('hidden', !offline);
    // Botón
    if (offline) {
    startBtn.setAttribute('disabled', '');
    startBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
    startBtn.removeAttribute('disabled');
    startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// Al cargar y en cambios de conexión
window.addEventListener('load', updateStatus);
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

// Navegar a la videollamada solo si estamos online
startBtn.addEventListener('click', () => {
    if (navigator.onLine) {
    window.location.href = '/call.html';
    }
});