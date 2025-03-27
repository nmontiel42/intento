const enBtn = document.getElementById('enBtn') as HTMLElement;
const frBtn = document.getElementById('frBtn') as HTMLElement;
const esBtn = document.getElementById('esBtn') as HTMLElement;
const esBtn2 = document.getElementById('esBtn2') as HTMLElement;
const enBtn2 = document.getElementById('enBtn2') as HTMLElement;
const frBtn2 = document.getElementById('frBtn2') as HTMLElement;

function changeLanguage() {
    if (localStorage.getItem('lang')) {

        /*-------------------Login-------------------*/

        const logoText = document.getElementById('logo-text') as HTMLElement;
        const neonSubtitle = document.getElementById('neon-subtitle') as HTMLElement;
        const email = document.getElementById('email') as HTMLInputElement;
        const userName = document.getElementById('username') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const loginEmail = document.getElementById('loginEmail') as HTMLInputElement;
        const loginPassword = document.getElementById('loginPassword') as HTMLInputElement;
        const usernameInput = document.getElementById('usernameInput') as HTMLInputElement;
        const submit = document.getElementById('submit') as HTMLElement;
        const theresAccount = document.getElementById('theresAccount') as HTMLElement;
        const goToLogin = document.getElementById('goToLogin') as HTMLElement;
        const oGoogle = document.getElementById('oGoogle') as HTMLElement;
        const loginTitle = document.getElementById('loginTitle') as HTMLElement;
        const submitLogin = document.getElementById('submitLogin') as HTMLElement;
        const goToRegister = document.getElementById('goToRegister') as HTMLElement;
        const usernameWelcome = document.getElementById('usernameWelcome') as HTMLElement;
        const usernameText = document.getElementById('usernameText') as HTMLElement;
        const submitUsername = document.getElementById('submitUsername') as HTMLElement;

        /*-------------------Options-------------------*/

        const logoutBtn = document.getElementById('logoutBtn') as HTMLElement;
        const deleteAccountBtn = document.getElementById('deleteAccountBtn') as HTMLElement;
        const optionsBtn = document.getElementById('optionsBtn') as HTMLElement;
        const changeUsernameBtn = document.getElementById('changeUsernameBtn') as HTMLElement;
        const changeLanguage = document.getElementById('changeLanguage') as HTMLElement;
        const esBtn2 = document.getElementById('esBtn2') as HTMLElement;
        const enBtn2 = document.getElementById('enBtn2') as HTMLElement;
        const frBtn2 = document.getElementById('frBtn2') as HTMLElement;
        const usernameChangeText = document.getElementById('usernameChangeText') as HTMLElement;
        const usernameChangeInput = document.getElementById('usernameChangeInput') as HTMLInputElement;
        const submitChangeUsername = document.getElementById('submitChangeUsername') as HTMLElement;
        const cancelChange = document.getElementById('cancelChange') as HTMLElement;


        /*-------------------3D-------------------*/

        const gameTitle = document.getElementById('gameTitle') as HTMLElement;
        const show3dGame = document.getElementById('show3dGame') as HTMLButtonElement;
        const activateScore = document.getElementById('activateScore') as HTMLButtonElement;
        const reset3dGame = document.getElementById('reset3dGame') as HTMLButtonElement;
        const winMsg = document.getElementById('winMsg') as HTMLElement;
        const closeWin = document.getElementById('closeWin') as HTMLElement;


        if (localStorage.getItem('lang') === 'en')
        {
            logoText.innerHTML = 'Welcome to PONG';
            neonSubtitle.innerHTML = 'REGISTER TO PLAY';
            email.placeholder = 'Your email';
            userName.placeholder = 'Your username';
            password.placeholder = 'Your password';
            loginEmail.placeholder = 'Your email';
            loginPassword.placeholder = 'Your password';
            usernameInput.placeholder = 'Your username';
            submit.innerHTML = 'Sign up';
            theresAccount.innerHTML = 'Already have an account?';
            goToLogin.innerHTML = 'Log in';
            oGoogle.innerHTML = 'or';
            loginTitle.innerHTML = 'Enter your data';
            submitLogin.innerHTML = 'Log in';
            goToRegister.innerHTML = 'Don\'t have an account? Register';
            usernameWelcome.innerHTML = 'Hello!';
            usernameText.innerHTML = 'Enter a username:';
            submitUsername.innerHTML = 'Save';

            /* ------------------------------------------------------------- */

            logoutBtn.innerHTML = 'Log out';
            deleteAccountBtn.innerHTML = 'Delete account';
            optionsBtn.innerHTML = 'Options';
            changeUsernameBtn.innerHTML = 'Change username';
            changeLanguage.innerHTML = 'Change language';
            esBtn2.innerHTML = 'Spanish';
            enBtn2.innerHTML = 'English';
            frBtn2.innerHTML = 'French';
            usernameChangeText.innerHTML = 'Enter a new username:';
            usernameChangeInput.placeholder = 'New username';
            submitChangeUsername.innerHTML = 'Change';
            cancelChange.innerHTML = 'Cancel';

            /* ------------------------------------------------------------- */
            
            gameTitle.innerHTML = '3D Game';
            show3dGame.innerHTML = 'Show 3D Game';
            activateScore.innerHTML = 'Activate Score';
            reset3dGame.innerHTML = 'Reset 3D Game';
            winMsg.innerHTML = 'You won!';
            closeWin.innerHTML = 'Close';

            /* ------------------------------------------------------------- */
        }
        else if (localStorage.getItem('lang') === 'fr')
        {
            logoText.innerHTML = 'Bienvenue à PONG';
            neonSubtitle.innerHTML = 'INSCRIVEZ-VOUS POUR JOUER';
            email.placeholder = 'Votre email';
            userName.placeholder = 'Votre nom d\'utilisateur';
            password.placeholder = 'Votre mot de passe';
            loginEmail.placeholder = 'Votre email';
            loginPassword.placeholder = 'Votre mot de passe';
            usernameInput.placeholder = 'Votre nom d\'utilisateur';
            submit.innerHTML = 'S\'inscrire';
            theresAccount.innerHTML = 'Vous avez déjà un compte?';
            goToLogin.innerHTML = 'Se connecter';
            oGoogle.innerHTML = 'ou';
            loginTitle.innerHTML = 'Entrez vos données';
            submitLogin.innerHTML = 'Se connecter';
            goToRegister.innerHTML = 'Vous n\'avez pas de compte? S\'inscrire';
            usernameWelcome.innerHTML = 'Bonjour!';
            usernameText.innerHTML = 'Entrez un nom d\'utilisateur:';
            submitUsername.innerHTML = 'Sauvegarder';

            /* ------------------------------------------------------------- */

            logoutBtn.innerHTML = 'Déconnexion';
            deleteAccountBtn.innerHTML = 'Supprimer le compte';
            optionsBtn.innerHTML = 'Options';
            changeUsernameBtn.innerHTML = 'Changer le nom d\'utilisateur';
            changeLanguage.innerHTML = 'Changer de langue';
            esBtn2.innerHTML = 'Espagnol';
            enBtn2.innerHTML = 'Anglais';
            frBtn2.innerHTML = 'Français';
            usernameChangeText.innerHTML = 'Entrez un nouveau nom d\'utilisateur:';
            usernameChangeInput.placeholder = 'Nouveau nom d\'utilisateur';
            submitChangeUsername.innerHTML = 'Changer';
            cancelChange.innerHTML = 'Annuler';

            /* ------------------------------------------------------------- */

            gameTitle.innerHTML = 'Jeu 3D';
            show3dGame.innerHTML = 'Afficher le jeu 3D';
            activateScore.innerHTML = 'Activer le score';
            reset3dGame.innerHTML = 'Réinitialiser le jeu 3D';
            winMsg.innerHTML = 'Vous avez gagné!';
            closeWin.innerHTML = 'Fermer le jeu 3D';

            /* ------------------------------------------------------------- */
        } 
        else if (localStorage.getItem('lang') === 'es')
        {
            logoText.innerHTML = 'Bienvenido a PONG';
            neonSubtitle.innerHTML = 'REGISTRATE PARA JUGAR';
            email.placeholder = 'Tu correo electrónico';
            userName.placeholder = 'Tu nombre de usuario';
            password.placeholder = 'Tu contraseña';
            loginEmail.placeholder = 'Tu correo electrónico';
            loginPassword.placeholder = 'Tu contraseña';
            usernameInput.placeholder = 'Tu nombre de usuario';
            submit.innerHTML = 'Registrarse';
            theresAccount.innerHTML = '¿Ya tienes una cuenta?';
            goToLogin.innerHTML = 'Iniciar sesión';
            oGoogle.innerHTML = 'o';
            loginTitle.innerHTML = 'Introduce tus datos';
            submitLogin.innerHTML = 'Iniciar sesión';
            goToRegister.innerHTML = '¿No tienes cuenta? Registrate';
            usernameWelcome.innerHTML = '¡Hola!';
            usernameText.innerHTML = 'Introduce un nombre de usuario:';
            submitUsername.innerHTML = 'Guardar';

            /* ------------------------------------------------------------- */

            logoutBtn.innerHTML = 'Cerrar sesión';
            deleteAccountBtn.innerHTML = 'Eliminar cuenta';
            optionsBtn.innerHTML = 'Opciones';
            changeUsernameBtn.innerHTML = 'Cambiar nombre de usuario';
            changeLanguage.innerHTML = 'Cambiar idioma';
            esBtn2.innerHTML = 'Español';
            enBtn2.innerHTML = 'Inglés';
            frBtn2.innerHTML = 'Francés';
            usernameChangeText.innerHTML = 'Introduce un nuevo nombre de usuario:';
            usernameChangeInput.placeholder = 'Nuevo nombre de usuario';
            submitChangeUsername.innerHTML = 'Cambiar';
            cancelChange.innerHTML = 'Cancelar';

            /* ------------------------------------------------------------- */
            
            gameTitle.innerHTML = 'Juego 3D';
            show3dGame.innerHTML = 'Mostrar Juego 3D';
            activateScore.innerHTML = 'Activar Puntuación';
            reset3dGame.innerHTML = 'Reiniciar Juego 3D';
            winMsg.innerHTML = '¡Ganaste!';
            closeWin.innerHTML = 'Cerrar Juego 3D';

            /* ------------------------------------------------------------- */
        }
    }
}

if (enBtn) {
    enBtn.addEventListener('click', () => {
        localStorage.setItem('lang', 'en');
        console.log('Cambiado a Inglés');
        changeLanguage();
    });
}
if (enBtn2) {
    enBtn2.addEventListener('click', () => {
        localStorage.setItem('lang', 'en');
        console.log('Cambiado a Inglés (2)');
        changeLanguage();
    });
}

if (frBtn) {
    frBtn.addEventListener('click', () => {
        localStorage.setItem('lang', 'fr');
        console.log('Cambiado a Francés');
        changeLanguage();
    });
}
if (frBtn2) {
    frBtn2.addEventListener('click', () => {
        localStorage.setItem('lang', 'fr');
        console.log('Cambiado a Francés (2)');
        changeLanguage();
    });
}

if (esBtn) {
    esBtn.addEventListener('click', () => {
        localStorage.setItem('lang', 'es');
        console.log('Cambiado a Español');
        changeLanguage();
    });
}
if (esBtn2) {
    esBtn2.addEventListener('click', () => {
        localStorage.setItem('lang', 'es');
        console.log('Cambiado a Español (2)');
        changeLanguage();
    });
}
