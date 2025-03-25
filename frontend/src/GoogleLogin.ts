// Manejo del login con Google
async function handleGoogleLogin(response: any) {
    try {
        const googleToken = response.credential; // Obtener el token de Google
        // Verificar que el token de Google es válido
        if (!googleToken) {
            alert("Google token is missing.");
            return;
        }

        // Enviar el token al backend para validarlo
        const backendResponse = await fetch('https://localhost:3000/google-login', {
            method: 'POST',
            headers: { 
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${googleToken}`
			},
            body: JSON.stringify({ token: googleToken }),
        });

        const data = await backendResponse.json();

        console.log('Backend response:', data);

        if (!data.token) {
            alert("Error: Google authentication failed");
            return;
        }

        localStorage.setItem('googleToken', googleToken);
        localStorage.setItem('authToken', data.token);

        // Comprobar si el usuario ya existe (puedes usar el campo data.userExists o algo similar)
        if (data.userExists) {
            localStorage.setItem('user', JSON.stringify(data.user));

            // Cambiar la vista
            loginView.style.display = 'none';
            registerView.style.display = 'none';
            homeView.style.display = 'block';
            usernameView.style.display = 'none';

            // Actualizar el nombre de usuario y la imagen de perfil
            userName.textContent = data.user.username;

            // Usamos una foto por defecto si no existe una imagen de perfil
            const profilePic = data.user.picture || "public/letra-t.png";
            userProfile.innerHTML = `<img src="${profilePic}" alt="User profile picture" />`;

            alert("Google Sign-in successful!");
        } else {
            // Si el usuario no existe, pedimos que elija un nombre de usuario
            loginView.style.display = 'none';
            registerView.style.display = 'none';
            homeView.style.display = 'none';
            usernameView.style.display = 'block';

            alert("Google Sign-in successful! Please set your username.");
        }
		connectWebSocket();
    } catch (error) {
        console.error("Google Login Error:", error);
        alert("Error al iniciar sesión con Google.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const usernameForm = document.getElementById('usernameForm') as HTMLFormElement;

    usernameForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        console.log("LE HE DADO A GUARDAR");

        const username = (document.getElementById('usernameInput') as HTMLInputElement).value;
        const token = localStorage.getItem('googleToken');

        if (!token) {
            alert('No auth token found');
            return;
        }

        const response = await fetch('https://localhost:3000/google-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ username, token }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data.user));

            // Cambiar la vista
            usernameView.style.display = 'none';
            homeView.style.display = 'block';

            // Actualizar el nombre de usuario y la imagen de perfil
            userName.textContent = data.user.username;

            // Usamos una foto por defecto si no existe una imagen de perfil
            const profilePic = data.picture || "public/letra-t.png";
            userProfile.innerHTML = `<img src="${profilePic}" alt="User profile picture" />`;
        } else {
            alert('Error al guardar el nombre de usuario');
        }
    });
});
