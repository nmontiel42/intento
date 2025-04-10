// Handle 2FA functionality
document.addEventListener('DOMContentLoaded', () => {
    const twoFactorAuthForm = document.getElementById('twoFactorAuthForm');
    const twoFactorAuthView = document.getElementById('twoFactorAuthView');
    // Agregar event listener al formulario
    if (twoFactorAuthForm) {
        twoFactorAuthForm.addEventListener('submit', handleTwoFactorAuth);
    }
    
    // Add 2FA setup UI to profile settings
    setupTwoFactorAuthUI();
    
    // Setup login form with 2FA support
    setupLoginForm();
});

// Function to handle the 2FA verification process
async function handleTwoFactorAuth(event: Event) {
    event.preventDefault();
    
    const verificationCodeInput = document.getElementById('verificationCode') as HTMLInputElement | null;
    if (!verificationCodeInput) return;

    const verificationCode = verificationCodeInput.value;
    
    const email = localStorage.getItem('tempEmail');
    const tempToken = localStorage.getItem('tempToken');

    console.log('Email for 2FA verification:', email); // Log para depuración

    if (!email || !tempToken) {
        console.error('No email or tempToken found in localStorage');
        return false;
    }

    try {
        const response = await fetch('https://localhost:3000/verify-2fa-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                verificationCode,
                email,
                tempToken
            }),
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("Complete verification response:", data); // Para depuración
            
            // Guardar token y limpiar datos temporales
            localStorage.setItem('authToken', data.token);
            localStorage.removeItem('tempToken');
            localStorage.removeItem('tempEmail');
            
            // Guardar información completa del usuario - no uses data.user
            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                username: data.username,
                email: data.email,
                picture: data.picture,
                has2FA: data.has2FA,
                two_fa_status: data.two_fa_status
            }));

            hide2FAModal();

            
            // Cambiar a vista home
            const homeView = document.getElementById('homeView');
            if (homeView) {
                homeView.style.display = 'block';
            }
            
            // Actualizar nombre de usuario e imagen de perfil
            const userName = document.getElementById('userName');
            if (userName && data.username) {
                userName.textContent = data.username;
            }
            
            // Actualizar imagen de perfil
            const userProfile = document.getElementById('userProfile');
            if (userProfile) {
                console.log('Profile picture data:', data.picture); // Para depuración
                userProfile.innerHTML = data.picture ? 
                    `<img src="${data.picture}" alt="Profile" class="w-10 h-10 rounded-full" />` : 
                    `<img src="public/letra-t.png" alt="Default" class="w-10 h-10 rounded-full" />`;
            }
            
            // Actualizar UI de 2FA
            setupTwoFactorAuthUI();
        } else {
            alert('Código de verificación inválido. Por favor, intenta nuevamente.');
        }
    } catch (error) {
        console.error('Error en verificación 2FA:', error);
        alert('Error al verificar el código. Por favor, intenta nuevamente.');
    }
}

// Setup 2FA UI in profile settings
async function setupTwoFactorAuthUI() {
    // Verificar el estado actual de 2FA
    const is2FAEnabled = await check2FAStatus();

    const setup2FABtn = document.getElementById('setup2FABtn') as HTMLElement;
    
    // Cambiar el estilo y texto según el estado
    if (is2FAEnabled) {
        setup2FABtn.className = 'bg-red-500 text-white px-4 py-2 rounded-lg w-full text-xs mb-2 hover:cursor-pointer hover:scale-105';
        setup2FABtn.innerText = 'Disable 2FA';
    } else {
        setup2FABtn.className = 'bg-[#318ED6] text-white px-4 py-2 rounded-lg w-full text-xs mb-2 hover:cursor-pointer hover:scale-105';
        setup2FABtn.innerText = 'Enable 2FA';
    }
    
    // Add it to the modal content
    const modalContent = document.getElementById('modalContent');
    if (modalContent) {
        // Eliminar el botón anterior si existe
        const existingBtn = document.getElementById('setup2FABtn');
        if (existingBtn && existingBtn.parentNode) {
            existingBtn.parentNode.removeChild(existingBtn);
        }
        
        modalContent.appendChild(setup2FABtn);
        
        // Add event listener
        setup2FABtn.addEventListener('click', async () => {
            if (is2FAEnabled) {
                // Lógica para desactivar 2FA
                if (await disable2FA()) {
                    // Solo actualizar si la desactivación fue exitosa
                    await setupTwoFactorAuthUI(); // Recrear el botón
                }
            } else {
                // Lógica para activar 2FA
                if (await enable2FA()) {
                    // Solo actualizar si la activación fue exitosa
                    await setupTwoFactorAuthUI(); // Recrear el botón
                }
            }
        });
    }
}

// Setup login form with 2FA support
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;
    
    if (loginForm) {
        // Remove existing event listeners
        const newLoginForm = loginForm.cloneNode(true) as HTMLFormElement;
        if (loginForm.parentNode) {
            loginForm.parentNode.replaceChild(newLoginForm, loginForm);
        }
        
        // Add new event listener with 2FA support
        newLoginForm.addEventListener('submit', async (event: Event) => {
            event.preventDefault();
            
            const emailInput = document.getElementById('loginEmail') as HTMLInputElement | null;
            const passwordInput = document.getElementById('loginPassword') as HTMLInputElement | null;
            
            if (!emailInput || !passwordInput) {
                alert('Login form is incomplete');
                return;
            }
            
            const email = emailInput.value;
            const password = passwordInput.value;
            
            try {
                const response = await fetch('https://localhost:3000/login-with-2fa', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Check if 2FA is required
                    if (data.requires2FA) {
                        // Store the temporary token
                        localStorage.setItem('tempToken', data.tempToken);

                        localStorage.setItem('tempEmail', email);
                        
                        // Ocultar login
                        if (loginView) {
                            loginView.style.display = 'none';
                        }
                        
                        // Mostrar modal 2FA
                        show2FAModal();
                        
                        // Alert user to check email
                        alert('Please check your email for a verification code.');
                    }else {
                        // Normal login flow
                        localStorage.setItem('authToken', data.token);
                        localStorage.setItem('user', JSON.stringify(data));
                        
                        // Switch to home view
                        if (loginView && homeView) {
                            loginView.style.display = 'none';
                            homeView.style.display = 'block';
                        }
                        
                        // Update user info
                        if (userName) {
                            userName.textContent = data.username;
                        }
                        
                        // Update profile image
                        if (userProfile) {
                            userProfile.innerHTML = data.picture ? 
                                `<img src="${data.picture}" alt="User profile picture" />` : 
                                `<img src="public/letra-t.png" alt="User profile picture" />`;
                        }
                    }
                } else {
                    const errorData = await response.json();
                    alert(`Login error: ${errorData.error || 'Please try again'}`);
                }
            } catch (error: any) { // Add type annotation for error
                console.error('Error in login:', error);
                alert('Error in login. Please try again.');
            }
        });
    }
}

// Función para mostrar el modal 2FA correctamente centrado
function show2FAModal() {
    const modal = document.getElementById('twoFactorAuthView');
    if (modal) {
        // Usar display: flex para activar el centrado
        modal.style.display = 'flex';
        
        // Enfocar en el campo de entrada
        setTimeout(() => {
            const input = document.getElementById('verificationCode') as HTMLInputElement;
            if (input) input.focus();
        }, 100);
    } else {
        console.error('Modal 2FA not found in the DOM');
    }
}

// Función para ocultar el modal 2FA
function hide2FAModal() {
    const modal = document.getElementById('twoFactorAuthView');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function check2FAStatus(): Promise<boolean> {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {

        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        const email = user?.email;

        console.log('Email for 2FA status check:', email); // Log para depuración
        
        if (!email) {
            console.error('No email found in localStorage');
            return false;
        } // Añadir log para depuración

        //console.log('Checking 2FA status for email:', email);

        // Usa la URL correcta según tu configuración
        const response = await fetch('https://localhost:3000/2fa-status', {
            method: 'POST', // Cambiar a POST
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email }), // Ahora es válido con POST
            credentials: 'include'
        });
        
        console.log('2FA status response:', response.status, response.statusText);
        
        if (response.ok) {
            try {
                // Primero obtén el texto y muéstralo para depuración
                const text = await response.text();
                console.log("Raw response text:", text);
                
                // Luego intenta parsearlo como JSON
                const data = text ? JSON.parse(text) : {};
                console.log('2FA status data:', data);
                return data.enabled || false;
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError);
                return false;
            }
        }

        console.error('Error response:', await response.text());
        return false;
    } catch (error) {
        console.error('Error checking 2FA status:', error);
        return false;
    }
}

async function disable2FA(): Promise<boolean> {
    const confirmation = confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.');
    if (!confirmation) return false;
    
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('You must be logged in to disable 2FA');
        return false;
    }
    
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const email = user?.email;
    if (!email) {
        console.error('No email found in localStorage');
        return false;
    }

    console.log('Disabling 2FA for email:', email); // Log para depuración

    try {
        const response = await fetch('https://localhost:3000/disable-2fa', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ confirm: true, email} ) // Añadir un cuerpo a la solicitud
        });
        
        // Para depuración
        console.log('Response status:', response.status);
        
        if (response.ok) {
            alert('Two-factor authentication has been disabled successfully.');
            return true;
        } else {
            // Intentar leer el mensaje de error
            try {
                const errorData = await response.json();
                alert(`Failed to disable 2FA: ${errorData.error || 'Unknown error'}`);
            } catch (e) {
                alert(`Failed to disable 2FA. Status: ${response.status}`);
            }
            return false;
        }
    } catch (error) {
        console.error('Error disabling 2FA:', error);
        alert('Error disabling 2FA. Please try again.');
        return false;
    }
}

async function enable2FA(): Promise<boolean> {
    // Create a prompt for email
    const email = prompt('Please enter your email address for 2FA setup:');
    if (!email) return false;
    
    console.log('Email for 2FA setup:', email); // Log the email for debugging

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('You must be logged in to enable 2FA');
        return false;
    }

    try {
        const response = await fetch('https://localhost:3000/enroll-2fa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                email: email,
            }),
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Save session info
            localStorage.setItem('2faSessionInfo', data.sessionInfo);
            
            // Ask for verification code
            const verificationCode = prompt('Enter the verification code sent to your email:');
            if (!verificationCode) return false;
            
            // Verify the code
            const verifyResponse = await fetch('https://localhost:3000/verify-2fa-enrollment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    verificationCode,
                    sessionInfo: data.sessionInfo,
                    email
                }),
            });
            
            if (verifyResponse.ok) {
                alert('Two-factor authentication has been enabled successfully!');
                return true;
            } else {
                const errorData = await verifyResponse.json();
                alert(`Failed to verify the code: ${errorData.error || 'Unknown error'}`);
                return false;
            }
        } else {
            const errorData = await response.json();
            alert(`Failed to setup 2FA: ${errorData.error || 'Unknown error'}`);
            return false;
        }
    } catch (error) {
        console.error('Error setting up 2FA:', error);
        alert('Error setting up 2FA. Please try again.');
        return false;
    }
}