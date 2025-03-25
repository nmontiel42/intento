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

// Seleccionamos el elemento de la imagen de perfil
const profileImage = document.getElementById("profileImage") as HTMLImageElement;

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

document.addEventListener("DOMContentLoaded", () => {
  const userProfile = document.getElementById("userProfile") as HTMLButtonElement;

  // Obtener datos del usuario desde localStorage
  const userData = localStorage.getItem("user");

  if (userData) {
    const user = JSON.parse(userData);
    profileImage.src = user.picture || "public/letra-t.png"; // Aquí se carga la foto de perfil o la por defecto
  }
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

      // Actualizamos la imagen de perfil con la foto del usuario o la por defecto
      userProfile.innerHTML = data.picture ? `<img src="${data.picture}" alt="User profile picture" />` : `<img src="public/letra-t.png";" alt="User profile picture" />`;

      registerView.style.display = 'none';
      homeView.style.display = 'block';
      userName.textContent = data.user.username;
    } else {
      const lang = localStorage.getItem('lang');
      if (lang === 'en') {
        alert('Error in registration: email or username is already in use');
      } else if (lang === 'fr') {
        alert('Erreur d\'inscription: l\'email ou le nom d\'utilisateur est déjà utilisé');
      } else {
        alert('Error en el registro: el email o el username ya está en uso');
      }
    }
  } catch (error) {
    console.error('Error al registrar:', error);
    alert('Error al registrar. Intenta nuevamente.');
  }
});

// Manejo del formulario de login
// Mantener todo el código inicial igual...

// Manejo del formulario de login
loginForm.addEventListener('submit', async (event: Event) => {
  event.preventDefault();

  // Obtenemos los valores
  const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
  const password = (document.getElementById('loginPassword') as HTMLInputElement).value;

  try {
    // Usar la URL existente de 2FA
    const response = await fetch('https://localhost:3000/login-with-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      // Verificar si se requiere 2FA
      if (data.requires2FA) {
        // Guardar el token temporal y la info de sesión
        localStorage.setItem('tempToken', data.tempToken);
        
        // Mostrar la vista de 2FA y ocultar login
        loginView.style.display = 'none';
        
        const twoFactorAuthView = document.getElementById('twoFactorAuthView');
        if (twoFactorAuthView) {
          twoFactorAuthView.style.display = 'block';
          
          // Asegurar que sea visible e interactivo
          twoFactorAuthView.style.position = 'fixed';
          twoFactorAuthView.style.zIndex = '1000';
          twoFactorAuthView.style.top = '50%';
          twoFactorAuthView.style.left = '50%';
          twoFactorAuthView.style.transform = 'translate(-50%, -50%)';
          twoFactorAuthView.style.padding = '20px';
          twoFactorAuthView.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        }
        
        // Notificar al usuario
        alert('Se ha enviado un código de verificación a tu correo electrónico.');
        return;
      }

      // Login normal sin 2FA
      loginView.style.display = 'none';
      homeView.style.display = 'block';
      userName.textContent = data.username;

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    } else {
      // Manejo de errores
      alert('Error en el inicio de sesión.');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Error al iniciar sesión. Intenta nuevamente.');
  }
});
