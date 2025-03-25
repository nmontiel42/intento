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
      const randomAvatarId = Math.floor(Math.random() * 10) + 1;
      const randomAvatar = `../public/avatars/avatar${randomAvatarId}.png`;
      
      // Si el usuario no tiene una imagen, asignar el avatar aleatorio
      if (!data.picture) {
        data.picture = randomAvatar;
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      
      userProfile.innerHTML = `<img src="${data.picture}" alt="User profile picture" />`;
      

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
loginForm.addEventListener('submit', async (event: Event) => {
  event.preventDefault();

  const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
  const password = (document.getElementById('loginPassword') as HTMLInputElement).value;

  try {
    const response = await fetch('https://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      // Si no hay foto de perfil, asignar un avatar aleatorio
      if (!data.picture) {
        const randomAvatarId = Math.floor(Math.random() * 10) + 1;
        data.picture = `../public/avatars/avatar${randomAvatarId}.png`;
      }

      // Guardar en localStorage los datos actualizados incluyendo la imagen
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify({
        ...data,
        picture: data.picture
      }));

      // Cambiar a la vista de inicio
      loginView.style.display = 'none';
      homeView.style.display = 'block';
      userName.textContent = data.username;

      // IMPORTANTE: Actualizar correctamente la imagen de perfil
      // Modificar el SRC del elemento img existente en lugar de reemplazar todo el HTML
      const profileImage = document.getElementById('profileImage') as HTMLImageElement;
      if (profileImage) {
        profileImage.src = data.picture || "../public/avatars/avatar1.png";
      }

    } else {
      // Manejo de errores (sin cambios)
      const lang = localStorage.getItem('lang');
      if (lang === 'en') {
        alert('Error in login: The user does not exist or the Email/Password are incorrect');
      } else if (lang === 'fr') {
        alert('Erreur de connexion: l\'utilisateur n\'existe pas ou l\'Email/Mot de passe sont incorrects');
      } else {
        alert('Error en el inicio de sesión. El usuario no existe o el Email/Contraseña son erroneos.');
      }
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Error al iniciar sesión. Intenta nuevamente.');
  }
});
