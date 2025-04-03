const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');

if (localStorage.getItem('darkModeEnabled') === 'true') {
  document.body.classList.add('dark-mode');
}

function updateDarkModeButton() {
  if (document.body.classList.contains('dark-mode')) {
    toggleDarkModeBtn.textContent = '☀️ Modo Claro';
  } else {
    toggleDarkModeBtn.textContent = '🌙 Modo Oscuro';
  }
}

updateDarkModeButton();

toggleDarkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkModeEnabled', document.body.classList.contains('dark-mode'));
  updateDarkModeButton();
});
