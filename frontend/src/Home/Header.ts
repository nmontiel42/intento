const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
const userProfile = document.getElementById('userProfile') as HTMLElement;
const confirmModal = document.getElementById('confirmModal') as HTMLElement;
const cancelBtn = document.getElementById('cancelBtn') as HTMLButtonElement;
const deleteAccountBtn = document.getElementById('deleteAccountBtn') as HTMLButtonElement;
const optionsBtn = document.getElementById('optionsBtn') as HTMLButtonElement;

const localPlay = document.getElementById('localPlay') as HTMLButtonElement;
const multiPlay = document.getElementById('multiPlay') as HTMLButtonElement;
const tourPlay = document.getElementById('tourPlay') as HTMLButtonElement;
const realPlay = document.getElementById('realPlay') as HTMLButtonElement;

const localPlayView = document.getElementById('localPlayView') as HTMLElement;
const multiPlayView = document.getElementById('multiPlayView') as HTMLElement;
const tourPlayView = document.getElementById('tourPlayView') as HTMLElement;
const realPlayView = document.getElementById('realPlayView') as HTMLElement;

userProfile.addEventListener('click', (event) => {
  event.stopPropagation(); // Evita que el clic en userProfile se propague al document
  confirmModal.style.display = 'block';
  requestAnimationFrame(() => {
    confirmModal.style.animation = 'fadeIn 0.3s forwards';
  });
});

// Lógica para cerrar sesión
logoutBtn.addEventListener('click', () => {
  // Eliminar datos del usuario y token
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  // Volver a la vista de login o registro
  homeView.style.display = 'none';
  loginView.style.display = 'block';
  registerView.style.display = 'none';
  confirmModal.style.display = 'none';
});

document.addEventListener('click', (event: MouseEvent) => {
  if (confirmModal.style.display === 'block') {
    const target = event.target as HTMLElement;
    const confirmModal = document.getElementById('confirmModal') as HTMLElement;
    const userProfile = document.getElementById('userProfile') as HTMLElement;

    // Retrasamos la ejecución del cierre para que no se detecte el mismo clic de apertura
    setTimeout(() => {
      if (!confirmModal.contains(target) && target !== userProfile) {
        confirmModal.style.animation = 'fadeOut 0.3s forwards';
        confirmModal.addEventListener('animationend', () => {
          confirmModal.style.display = 'none';
          confirmModal.style.animation = 'none';
        }, { once: true });
      }
    }, 10);
  }
});

// Lógica para eliminar cuenta
deleteAccountBtn.addEventListener('click', async () => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  console.log('User:', user);
  console.log('Token:', token);

  const response = await fetch('https://localhost:3000/delete-account', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ username: user.username }),
  });

  if (response.ok) {
    alert('Cuenta eliminada');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    homeView.style.display = 'none';
    loginView.style.display = 'none';
    registerView.style.display = 'block';
  } else {
    alert('Hubo un error al eliminar la cuenta');
  }

  confirmModal.style.display = 'none';
});

optionsBtn.addEventListener('click', (event) => {
  // Primero, inicia la transición de salida
  [logoutBtn, deleteAccountBtn, optionsBtn].forEach(btn => {
    btn.classList.remove('fade-in');
    btn.classList.add('fade-out');
  });

  // Después de un pequeño retraso, cambia el display y muestra los nuevos botones
  setTimeout(() => {
    // Ocultar los botones anteriores
    logoutBtn.style.display = 'none';
    deleteAccountBtn.style.display = 'none';
    optionsBtn.style.display = 'none';

    // Preparar los nuevos botones (display block pero aún invisibles)
    changeLang.style.display = 'block';
    changeProfilePic.style.display = 'block';
    changeUsername.style.display = 'block';
    goingBack.style.display = 'block';

    // Forzar un reflow para que la transición funcione
    document.body.offsetHeight;

    // Aplicar la transición de entrada
    [changeLang, changeProfilePic, changeUsername, goingBack].forEach(btn => {
      btn.classList.remove('fade-out');
      btn.classList.add('fade-in');
    });
  }, 300); // Duración de la transición
});

localPlay.addEventListener('click', () => {
  localPlayView.style.display = 'block';
  multiPlayView.style.display = 'none';
  tourPlayView.style.display = 'none';
  realPlayView.style.display = 'none';
});

multiPlay.addEventListener('click', () => {
  localPlayView.style.display = 'none';
  multiPlayView.style.display = 'block';
  tourPlayView.style.display = 'none';
  realPlayView.style.display = 'none';
});

tourPlay.addEventListener('click', () => {
  localPlayView.style.display = 'none';
  multiPlayView.style.display = 'none';
  tourPlayView.style.display = 'block';
  realPlayView.style.display = 'none';
});

realPlay.addEventListener('click', () => {
  localPlayView.style.display = 'none';
  multiPlayView.style.display = 'none';
  tourPlayView.style.display = 'none';
  realPlayView.style.display = 'block';
});