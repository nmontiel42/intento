const goingBack = document.getElementById('goingBack') as HTMLButtonElement;
const changeUsername = document.getElementById('changeUsernameBtn') as HTMLButtonElement;
const changeLang = document.getElementById('changeLanguage') as HTMLButtonElement;

/* Change lang */
const goingBackLang = document.getElementById('goingBackLang') as HTMLButtonElement;
const langView = document.getElementById('selectLang') as HTMLElement;
const faBtn = document.getElementById('setup2FABtn') as HTMLButtonElement;

/* Change username */
const changeUsernameView = document.getElementById('changeUsernameView') as HTMLElement;
const cancelChange = document.getElementById('cancelChange') as HTMLButtonElement;
const submitChangeUsername = document.getElementById('submitChangeUsername') as HTMLButtonElement;
const usernameChangeInput = document.getElementById('usernameChangeInput') as HTMLInputElement;

const buttonsToAnimate = [
    document.getElementById('logoutBtn'),
    document.getElementById('deleteAccountBtn'),
    document.getElementById('optionsBtn'),
    document.getElementById('goingBack'),
    document.getElementById('changeUsernameBtn'),
    document.getElementById('setup2FABtn'),
    document.getElementById('changeLanguage'),
    document.getElementById('selectLang'),
];

const langButtons = [
    document.getElementById('goingBackLang'),
    document.getElementById('esBtn'),
    document.getElementById('enBtn'),
    document.getElementById('frBtn')
];

buttonsToAnimate.forEach(button => {
    if (button) {
        button.classList.add('fade-transition');

        // Configurar el estado inicial
        if (button.style.display === 'none') {
            button.classList.add('fade-out');
        } else {
            button.classList.add('fade-in');
        }
    }
});

langButtons.forEach(button => {
    if (button) {
        button.classList.add('fade-transition');
        // Configurar el estado inicial según su display
        if (button.style.display === 'none') {
            button.classList.add('fade-out');
        } else {
            button.classList.add('fade-in');
        }
    }
});

goingBack.addEventListener('click', () => {
    // Primero, inicia la transición de salida
    [changeLang, changeUsername, goingBack, faBtn].forEach(btn => {
        btn.classList.remove('fade-in');
        btn.classList.add('fade-out');
    });

    // Después de un pequeño retraso, cambia el display y muestra los botones originales
    setTimeout(() => {
        // Ocultar los botones actuales
        changeLang.style.display = 'none';
        changeUsername.style.display = 'none';
        goingBack.style.display = 'none';
        faBtn.style.display = 'none';

        // Preparar los botones originales
        logoutBtn.style.display = 'block';
        deleteAccountBtn.style.display = 'block';
        optionsBtn.style.display = 'block';

        // Forzar un reflow
        document.body.offsetHeight;

        // Aplicar la transición de entrada
        [logoutBtn, deleteAccountBtn, optionsBtn].forEach(btn => {
            btn.classList.remove('fade-out');
            btn.classList.add('fade-in');
        });
    }, 300); // Duración de la transición
});

changeLang.addEventListener('click', () => {
    // Primero, inicia la transición de salida para los botones actuales
    [changeLang, changeUsername, goingBack, faBtn].forEach(btn => {
        btn.classList.remove('fade-in');
        btn.classList.add('fade-out');
    });

    // Añadir la clase fade-transition a langView y sus botones
    if (langView && !langView.classList.contains('fade-transition')) {
        langView.classList.add('fade-transition');
        langView.classList.add('fade-out');
    }

    // Referencias a los botones de idioma
    const langButtons = [
        goingBackLang,
        document.getElementById('esBtn'),
        document.getElementById('enBtn'),
        document.getElementById('frBtn')
    ];

    // Preparar los botones de idioma para la transición
    langButtons.forEach(btn => {
        if (btn && !btn.classList.contains('fade-transition')) {
            btn.classList.add('fade-transition');
            btn.classList.add('fade-out');
        }
    });

    // Después de un pequeño retraso, cambia el display y muestra la vista de idioma
    setTimeout(() => {
        // Ocultar los botones actuales
        changeLang.style.display = 'none';
        changeUsername.style.display = 'none';
        goingBack.style.display = 'none';
        faBtn.style.display = 'none';

        // Mostrar la vista de idioma
        langView.style.display = 'block';

        // Asegurarse de que los botones de idioma estén visibles
        langButtons.forEach(btn => {
            if (btn) btn.style.display = 'block';
        });

        // Forzar un reflow
        document.body.offsetHeight;

        // Aplicar la transición de entrada a langView
        if (langView) {
            langView.classList.remove('fade-out');
            langView.classList.add('fade-in');
        }

        // Aplicar la transición de entrada a los botones de idioma
        langButtons.forEach(btn => {
            if (btn) {
                btn.classList.remove('fade-out');
                btn.classList.add('fade-in');
            }
        });
    }, 300); // Duración de la transición
});

goingBackLang.addEventListener('click', () => {
    // Primero, inicia la transición de salida para los botones de idioma
    langButtons.forEach(btn => {
        if (btn) {
            btn.classList.remove('fade-in');
            btn.classList.add('fade-out');
        }
    });

    // También hacer fadeout del contenedor
    langView.classList.remove('fade-in');
    langView.classList.add('fade-out');

    // Después de un pequeño retraso, cambia el display
    setTimeout(() => {
        // Ocultar la vista de idioma
        langView.style.display = 'none';

        // Mostrar los botones de opciones
        changeLang.style.display = 'block';
        changeUsername.style.display = 'block';
        goingBack.style.display = 'block';
        faBtn.style.display = 'block';

        // Forzar un reflow para que la transición funcione
        document.body.offsetHeight;

        // Aplicar la transición de entrada
        [changeLang, changeUsername, goingBack, faBtn].forEach(btn => {
            btn.classList.remove('fade-out');
            btn.classList.add('fade-in');
        });
    }, 300); // Duración de la transición
});

changeUsername.addEventListener('click', () => {
    // Redirigir al usuario a la vista de cambio de username
    changeUsernameView.style.display = 'block';
    homeView.style.display = 'none';
});

cancelChange.addEventListener('click', () => {
    // Redirigir al usuario a la vista de inicio
    changeUsernameView.style.display = 'none';
    homeView.style.display = 'block';
});

/* Por ahora */
submitChangeUsername.addEventListener('click', async (event) => {
    event.preventDefault();
    const newUsername = usernameChangeInput.value;
    //console.log('Cambiando username...');
    //console.log('Nuevo username:', newUsername);

    // Obtener el token JWT del localStorage o de donde lo estés guardando
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    try {
        const response = await fetch('https://localhost:3000/change-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ username: newUsername }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Error desconocido');
        }

        // Procesar la respuesta exitosa
        //console.log('Resultado:', responseData);

        // Actualiza la interfaz
        changeUsernameView.style.display = 'none';
        homeView.style.display = 'block';
        userName.textContent = responseData.username; // Usar el nombre de usuario de la respuesta

    } catch (error) {
        console.error('Error en la solicitud:', error);
        if (error instanceof Error) {
            alert(error.message);
        } else {
            alert('An unknown error occurred');
        }
    }
});
