// Seleccionamos las vistas
const registerView = document.getElementById('registerView') as HTMLElement;
const loginView = document.getElementById('loginView') as HTMLElement;
const homeView = document.getElementById('homeView') as HTMLElement;
const usernameView = document.getElementById('usernameView') as HTMLElement;

// Seleccionamos el elemento para mostrar el nombre de usuario
const userName = document.getElementById('userName') as HTMLElement;

// Seleccionamos los formularios
const registerForm = document.getElementById('registerForm') as HTMLFormElement;
const loginForm = document.getElementById('loginForm') as HTMLFormElement;

// Seleccionamos los botones para cambiar vistas
const goToLoginButton = document.getElementById('goToLogin') as HTMLButtonElement;
const goToRegisterButton = document.getElementById('goToRegister') as HTMLButtonElement;

const submitUsername = document.getElementById('submitUsername') as HTMLButtonElement;

// Manejadores de eventos para cambiar entre vistas
document.addEventListener("DOMContentLoaded", () => {
  goToLoginButton.addEventListener('click', () => {
    registerView.style.display = 'none';
    loginView.style.display = 'block';
  });
});

goToRegisterButton.addEventListener('click', () => {
  loginView.style.display = 'none';
  registerView.style.display = 'block';
});

// Manejo del formulario de registro
registerForm.addEventListener('submit', async (event: Event) => {
  event.preventDefault(); // Evita el envío tradicional del formulario

  // Obtenemos los valores de los campos del formulario
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const username = (document.getElementById('username') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;

  try {
    // Enviamos la solicitud POST al backend para registrar el usuario
    const response = await fetch('https://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    });

    if (response.ok) {
      const data = await response.json();

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
loginForm.addEventListener('submit', async (event: Event) => {
  event.preventDefault(); // Evita el envío tradicional del formulario

  // Obtenemos los valores de los campos del formulario de login
  const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
  const password = (document.getElementById('loginPassword') as HTMLInputElement).value;

  try {
    // Enviamos la solicitud POST al backend para iniciar sesión
    const response = await fetch('https://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      // Cambiar a la vista de inicio
      loginView.style.display = 'none';
      homeView.style.display = 'block';
      userName.textContent = data.username;

      // Guardar los datos del usuario y el token en localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    } else {
      alert('Error en el inicio de sesión. Intenta nuevamente.');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Error al iniciar sesión. Intenta nuevamente.');
  }
});