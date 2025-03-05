// Seleccionamos las vistas
const registerView = document.getElementById('registerView');
const loginView = document.getElementById('loginView');
const homeView = document.getElementById('homeView');
const userName = document.getElementById('userName');

// Seleccionamos los formularios
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

// Seleccionamos los botones para cambiar vistas
const goToLoginButton = document.getElementById('goToLogin');
const goToRegisterButton = document.getElementById('goToRegister');

// Seleccionamos el botón de Cerrar Sesión y el Modal
const logoutBtn = document.getElementById('logoutBtn');
const confirmModal = document.getElementById('confirmModal');
const cancelBtn = document.getElementById('cancelBtn');
const logoutOnlyBtn = document.getElementById('logoutOnlyBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');

// Manejadores de eventos para cambiar entre vistas
goToLoginButton.addEventListener('click', () => {
  registerView.style.display = 'none';
  loginView.style.display = 'block';
});

goToRegisterButton.addEventListener('click', () => {
  loginView.style.display = 'none';
  registerView.style.display = 'block';
});

// Manejo del formulario de registro
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita el envío tradicional del formulario

  // Obtenemos los valores de los campos del formulario
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // Enviamos la solicitud POST al backend para registrar el usuario
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Respuesta del backend al registrar:', data);
      console.log('Token almacenado tras registro:', data.token);

      if (!data.token) {
        alert('Error: el backend no devolvió un token');
        return;
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      registerView.style.display = 'none';
      homeView.style.display = 'block';
      userName.textContent = data.user.username;
    } else {
      alert('Error en el registro. Intenta nuevamente.');
    }
  } catch (error) {
    console.error('Error al registrar:', error);
    alert('Error al registrar. Intenta nuevamente.');
  }
});

// Manejo del formulario de login
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita el envío tradicional del formulario

  // Obtenemos los valores de los campos del formulario de login
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    // Enviamos la solicitud POST al backend para iniciar sesión
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Si el login es exitoso, mostramos la vista de home
      const data = await response.json();  // Suponiendo que devuelves un mensaje de éxito

      // Cambiar a la vista de inicio
      loginView.style.display = 'none';
      homeView.style.display = 'block';
      userName.textContent = data.username; // Mostrar nombre de usuario

      // Guardar los datos del usuario y el token en localStorage
      localStorage.setItem('authToken', data.token); // Suponiendo que el backend envíe un token
      localStorage.setItem('user', JSON.stringify(data));
    } else {
      alert('Error en el inicio de sesión. Intenta nuevamente.');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Error al iniciar sesión. Intenta nuevamente.');
  }
});

// Lógica para mostrar el modal de confirmación de cierre de sesión
logoutBtn.addEventListener('click', () => {
  confirmModal.style.display = 'block'; // Mostrar modal
});

// Lógica para cerrar sesión
logoutOnlyBtn.addEventListener('click', () => {
  // Eliminar datos del usuario y token
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');

  // Volver a la vista de login o registro
  homeView.style.display = 'none';
  loginView.style.display = 'block';  // Cambiar a vista de login
  registerView.style.display = 'none';  // Asegurarnos de ocultar el registro si estaba visible
  confirmModal.style.display = 'none'; // Cerrar el modal
});

// Lógica para eliminar cuenta
deleteAccountBtn.addEventListener('click', async () => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Recuperar los datos del usuario
  console.log('Token recuperado:', token);
  console.log('Usuario a eliminar:', user);

  const response = await fetch('http://localhost:3000/delete-account', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ username: user.username }), // Enviar el username
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
  

// Lógica para cancelar y cerrar el modal
cancelBtn.addEventListener('click', () => {
  confirmModal.style.display = 'none'; // Cerrar el modal
});

console.log('Frontend inicializado');