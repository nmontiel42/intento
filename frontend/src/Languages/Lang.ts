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

            logoutBtn.innerHTML = optionsLanguages.en.logoutBtn;
            deleteAccountBtn.innerHTML = optionsLanguages.en.deleteAccountBtn;
            optionsBtn.innerHTML = optionsLanguages.en.optionsBtn;
            changeUsernameBtn.innerHTML = optionsLanguages.en.changeUsernameBtn;
            changeLanguage.innerHTML = optionsLanguages.en.changeLanguage;
            esBtn2.innerHTML = optionsLanguages.en.esBtn2;
            enBtn2.innerHTML = optionsLanguages.en.enBtn2;
            frBtn2.innerHTML = optionsLanguages.en.frBtn2;
            usernameChangeText.innerHTML = optionsLanguages.en.usernameChangeText;
            usernameChangeInput.placeholder = optionsLanguages.en.placeholders.usernameChangeInput;
            submitChangeUsername.innerHTML = optionsLanguages.en.submitChangeUsername;
            cancelChange.innerHTML = optionsLanguages.en.cancelChange;

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

            logoutBtn.innerHTML = optionsLanguages.fr.logoutBtn;
            deleteAccountBtn.innerHTML = optionsLanguages.fr.deleteAccountBtn;
            optionsBtn.innerHTML = optionsLanguages.fr.optionsBtn;
            changeUsernameBtn.innerHTML = optionsLanguages.fr.changeUsernameBtn;
            changeLanguage.innerHTML = optionsLanguages.fr.changeLanguage;
            esBtn2.innerHTML = optionsLanguages.fr.esBtn2;
            enBtn2.innerHTML = optionsLanguages.fr.enBtn2;
            frBtn2.innerHTML = optionsLanguages.fr.frBtn2;
            usernameChangeText.innerHTML = optionsLanguages.fr.usernameChangeText;
            usernameChangeInput.placeholder = optionsLanguages.fr.placeholders.usernameChangeInput;
            submitChangeUsername.innerHTML = optionsLanguages.fr.submitChangeUsername;
            cancelChange.innerHTML = optionsLanguages.fr.cancelChange;

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

            logoutBtn.innerHTML = optionsLanguages.es.logoutBtn;
            deleteAccountBtn.innerHTML = optionsLanguages.es.deleteAccountBtn;
            optionsBtn.innerHTML = optionsLanguages.es.optionsBtn;
            changeUsernameBtn.innerHTML = optionsLanguages.es.changeUsernameBtn;
            changeLanguage.innerHTML = optionsLanguages.es.changeLanguage;
            esBtn2.innerHTML = optionsLanguages.es.esBtn2;
            enBtn2.innerHTML = optionsLanguages.es.enBtn2;
            frBtn2.innerHTML = optionsLanguages.es.frBtn2;
            usernameChangeText.innerHTML = optionsLanguages.es.usernameChangeText;
            usernameChangeInput.placeholder = optionsLanguages.es.placeholders.usernameChangeInput;
            submitChangeUsername.innerHTML = optionsLanguages.es.submitChangeUsername;
            cancelChange.innerHTML = optionsLanguages.es.cancelChange;

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
