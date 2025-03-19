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
            headers: { 'Content-Type': 'application/json' },
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
            loginView.style.display = 'none';
            registerView.style.display = 'none';
            homeView.style.display = 'block';
            usernameView.style.display = 'none';
            userName.textContent = data.user.username;

            alert("Google Sign-in successful!");
        } else {
            loginView.style.display = 'none';
            registerView.style.display = 'none';
            homeView.style.display = 'none';
            usernameView.style.display = 'block';

            alert("Google Sign-in successful! Please set your username.");
        }
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

            usernameView.style.display = 'none';
            homeView.style.display = 'block';
            userName.textContent = data.user.username;
        } else {
            alert('Error al guardar el nombre de usuario');
        }
    });
});
