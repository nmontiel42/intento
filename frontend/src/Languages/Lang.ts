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

        /*-------------------Home-------------------*/

        if (localStorage.getItem('lang') === 'en')
        {
            logoText.innerHTML = loginLanguages.en.logoText;
            neonSubtitle.innerHTML = loginLanguages.en.neonSubtitle;
            email.placeholder = loginLanguages.en.placeholders.email;
            userName.placeholder = loginLanguages.en.placeholders.userName;
            password.placeholder = loginLanguages.en.placeholders.password;
            loginEmail.placeholder = loginLanguages.en.placeholders.loginEmail;
            loginPassword.placeholder = loginLanguages.en.placeholders.loginPassword;
            usernameInput.placeholder = loginLanguages.en.placeholders.usernameInput;
            submit.innerHTML = loginLanguages.en.submit;
            theresAccount.innerHTML = loginLanguages.en.theresAccount;
            goToLogin.innerHTML = loginLanguages.en.gotToLogin;
            oGoogle.innerHTML = loginLanguages.en.oGoogle;
            loginTitle.innerHTML = loginLanguages.en.loginTitle;
            submitLogin.innerHTML = loginLanguages.en.submitLogin;
            goToRegister.innerHTML = loginLanguages.en.goToregister;
            usernameWelcome.innerHTML = loginLanguages.en.usernameWelcome;
            usernameText.innerHTML = loginLanguages.en.usernameText;
            submitUsername.innerHTML = loginLanguages.en.submitUsername;

            /* ------------------------------------------------------------- */
        }
        else if (localStorage.getItem('lang') === 'fr')
        {
            logoText.innerHTML = loginLanguages.fr.logoText;
            neonSubtitle.innerHTML = loginLanguages.fr.neonSubtitle;
            email.placeholder = loginLanguages.fr.placeholders.email;
            userName.placeholder = loginLanguages.fr.placeholders.userName;
            password.placeholder = loginLanguages.fr.placeholders.password;
            loginEmail.placeholder = loginLanguages.fr.placeholders.loginEmail;
            loginPassword.placeholder = loginLanguages.fr.placeholders.loginPassword;
            usernameInput.placeholder = loginLanguages.fr.placeholders.usernameInput;
            submit.innerHTML = loginLanguages.fr.submit;
            theresAccount.innerHTML = loginLanguages.fr.theresAccount;
            goToLogin.innerHTML = loginLanguages.fr.gotToLogin;
            oGoogle.innerHTML = loginLanguages.fr.oGoogle;
            loginTitle.innerHTML = loginLanguages.fr.loginTitle;
            submitLogin.innerHTML = loginLanguages.fr.submitLogin;
            goToRegister.innerHTML = loginLanguages.fr.goToregister;
            usernameWelcome.innerHTML = loginLanguages.fr.usernameWelcome;
            usernameText.innerHTML = loginLanguages.fr.usernameText;
            submitUsername.innerHTML = loginLanguages.fr.submitUsername;

            /* ------------------------------------------------------------- */
        } 
        else if (localStorage.getItem('lang') === 'es')
        {
            logoText.innerHTML = loginLanguages.es.logoText;
            neonSubtitle.innerHTML = loginLanguages.es.neonSubtitle;
            email.placeholder = loginLanguages.es.placeholders.email;
            userName.placeholder = loginLanguages.es.placeholders.userName;
            password.placeholder = loginLanguages.es.placeholders.password;
            loginEmail.placeholder = loginLanguages.es.placeholders.loginEmail;
            loginPassword.placeholder = loginLanguages.es.placeholders.loginPassword;
            usernameInput.placeholder = loginLanguages.es.placeholders.usernameInput;
            submit.innerHTML = loginLanguages.es.submit;
            theresAccount.innerHTML = loginLanguages.es.theresAccount;
            goToLogin.innerHTML = loginLanguages.es.gotToLogin;
            oGoogle.innerHTML = loginLanguages.es.oGoogle;
            loginTitle.innerHTML = loginLanguages.es.loginTitle;
            submitLogin.innerHTML = loginLanguages.es.submitLogin;
            goToRegister.innerHTML = loginLanguages.es.goToregister;
            usernameWelcome.innerHTML = loginLanguages.es.usernameWelcome;
            usernameText.innerHTML = loginLanguages.es.usernameText;
            submitUsername.innerHTML = loginLanguages.es.submitUsername;

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
