const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
const userProfile = document.getElementById('userProfile') as HTMLElement;
const confirmModal = document.getElementById('confirmModal') as HTMLElement;
const cancelBtn = document.getElementById('cancelBtn') as HTMLButtonElement;
const deleteAccountBtn = document.getElementById('deleteAccountBtn') as HTMLButtonElement;

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