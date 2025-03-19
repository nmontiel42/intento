const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
const userProfile = document.getElementById('userProfile') as HTMLElement;
const confirmModal = document.getElementById('confirmModal') as HTMLElement;
const cancelBtn = document.getElementById('cancelBtn') as HTMLButtonElement;
const deleteAccountBtn = document.getElementById('deleteAccountBtn') as HTMLButtonElement;

userProfile.addEventListener('click', () => {
    confirmModal.style.display = 'block'; // Mostrar modal
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

cancelBtn.addEventListener('click', () => {
    confirmModal.style.display = 'none'; // Cerrar el modal
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