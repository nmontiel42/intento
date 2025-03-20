const enBtn = document.getElementById('enBtn') as HTMLElement;
const frBtn = document.getElementById('frBtn') as HTMLElement;
const esBtn = document.getElementById('esBtn') as HTMLElement;

const Languages = {
    es: {
        logoText: 'Bienvenido a PONG',
        neonSubtitle: 'REGISTRATE PARA JUGAR',
        placeholders: {
            email: 'Tu correo electrónico',
            userName: 'Tu nombre de usuario',
            password: 'Tu contraseña'
        },
        submit: 'Registrarse',
        theresAccount: '¿Ya tienes una cuenta?',
        gotToLogin: 'Iniciar sesión',
        oGoogle: 'o',
    },
    en: {
        logoText: 'Welcome to PONG',
        neonSubtitle: 'REGISTER TO PLAY',
        placeholders: {
            email: 'Your email',
            userName: 'Your username',
            password: 'Your password'
        },
        submit: 'Sign up',
        theresAccount: 'Already have an account?',
        gotToLogin: 'Log in',
        oGoogle: 'or',
    },
    fr: {
        logoText: 'Bienvenue à PONG',
        neonSubtitle: 'INSCRIVEZ-VOUS POUR JOUER',
        placeholders: {
            email: 'Votre email',
            userName: 'Votre nom d\'utilisateur',
            password: 'Votre mot de passe'
        },
        submit: 'S\'inscrire',
        theresAccount: 'Vous avez déjà un compte?',
        gotToLogin: 'Se connecter',
        oGoogle: 'ou',
    }
};

function changeLanguage() {
    if (localStorage.getItem('lang')) {

        const logoText = document.getElementById('logo-text') as HTMLElement;
        const neonSubtitle = document.getElementById('neon-subtitle') as HTMLElement;
        const email = document.getElementById('email') as HTMLInputElement;
        const userName = document.getElementById('username') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const submit = document.getElementById('submit') as HTMLElement;
        const theresAccount = document.getElementById('theresAccount') as HTMLElement;
        const goToLogin = document.getElementById('goToLogin') as HTMLElement;
        const oGoogle = document.getElementById('oGoogle') as HTMLElement;

        if (localStorage.getItem('lang') === 'en')
        {
            logoText.innerHTML = Languages.en.logoText;
            neonSubtitle.innerHTML = Languages.en.neonSubtitle;
            email.placeholder = Languages.en.placeholders.email;
            userName.placeholder = Languages.en.placeholders.userName;
            password.placeholder = Languages.en.placeholders.password;
            submit.innerHTML = Languages.en.submit;
            theresAccount.innerHTML = Languages.en.theresAccount;
            goToLogin.innerHTML = Languages.en.gotToLogin;
            oGoogle.innerHTML = Languages.en.oGoogle;
        }
        else if (localStorage.getItem('lang') === 'fr')
        {
            logoText.innerHTML = Languages.fr.logoText;
            neonSubtitle.innerHTML = Languages.fr.neonSubtitle;
            email.placeholder = Languages.fr.placeholders.email;
            userName.placeholder = Languages.fr.placeholders.userName;
            password.placeholder = Languages.fr.placeholders.password;
            submit.innerHTML = Languages.fr.submit;
            theresAccount.innerHTML = Languages.fr.theresAccount;
            goToLogin.innerHTML = Languages.fr.gotToLogin;
            oGoogle.innerHTML = Languages.fr.oGoogle;
        } 
        else if (localStorage.getItem('lang') === 'es')
        {
            logoText.innerHTML = Languages.es.logoText;
            neonSubtitle.innerHTML = Languages.es.neonSubtitle;
            email.placeholder = Languages.es.placeholders.email;
            userName.placeholder = Languages.es.placeholders.userName;
            password.placeholder = Languages.es.placeholders.password;
            submit.innerHTML = Languages.es.submit;
            theresAccount.innerHTML = Languages.es.theresAccount;
            goToLogin.innerHTML = Languages.es.gotToLogin;
            oGoogle.innerHTML = Languages.es.oGoogle;
        }
    }
}

if (enBtn) {
    enBtn.addEventListener('click', () => {
        localStorage.setItem('lang', 'en');
        console.log('Cambiado a Ingles');
        changeLanguage();
        //window.location.reload();
    });
}

if (frBtn) {
    frBtn.addEventListener('click', () => {
        localStorage.setItem('lang', 'fr');
        console.log('Cambiado a Frances');
        changeLanguage();
        // window.location.reload();
    });
}

if (esBtn) {
    esBtn.addEventListener('click', () => {
        localStorage.setItem('lang', 'es');
        console.log('Cambiado a Español');
        changeLanguage();
        //window.location.reload();
    });
}