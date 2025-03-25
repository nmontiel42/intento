// Handle 2FA functionality
let twoFactorAuthView: HTMLElement | null = null; // Change to nullable type

document.addEventListener('DOMContentLoaded', () => {
    // Create a modal container for 2FA
    twoFactorAuthView = document.createElement('div');
    twoFactorAuthView.id = 'twoFactorAuthView';
    
    // Estilos para el contenedor modal (capa oscura de fondo)
    twoFactorAuthView.style.position = 'center';
    twoFactorAuthView.style.top = '0';
    twoFactorAuthView.style.left = '0';
    twoFactorAuthView.style.width = '100%';
    twoFactorAuthView.style.height = '100%';
    twoFactorAuthView.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    twoFactorAuthView.style.display = 'none';
    twoFactorAuthView.style.zIndex = '9999';
    twoFactorAuthView.style.alignItems = 'center';
    twoFactorAuthView.style.justifyContent = 'center';
    
    // Crear el contenido del modal
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#111';
    modalContent.style.borderRadius = '8px';
    modalContent.style.padding = '30px';
    modalContent.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.7)';
    modalContent.style.width = '350px';
    modalContent.style.maxWidth = '90%';
    modalContent.style.textAlign = 'center';
    modalContent.style.position = 'relative';
    
    // Contenido HTML del formulario
    modalContent.innerHTML = `
        <h1 style="color: white; font-size: 24px; margin-bottom: 15px;">Two-Factor Authentication</h1>
        <p style="color: white; font-size: 14px; margin-bottom: 20px;">Enter the verification code sent to your email:</p>
        <form id="twoFactorAuthForm">
            <input type="text" id="verificationCode" name="verificationCode" 
                placeholder="Verification Code" required 
                style="width: 100%; padding: 12px; margin-bottom: 15px; background-color: #222; color: white; border: 1px solid #4CAF50; border-radius: 4px; font-size: 16px; box-sizing: border-box;" />
            
            <button id="submitVerificationCode" type="submit"
                style="width: 100%; padding: 12px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
                Verify
            </button>
        </form>
    `;
    
    // Agregar el contenido al modal
    twoFactorAuthView.appendChild(modalContent);
    
    // Agregar el modal al body
    document.body.appendChild(twoFactorAuthView);
    
    // Agregar event listener al formulario
    const twoFactorAuthForm = document.getElementById('twoFactorAuthForm') as HTMLFormElement | null;
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
    const tempToken = localStorage.getItem('tempToken');
    
    if (!tempToken) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        return;
    }
    
    try {
        const response = await fetch('https://localhost:3000/verify-2fa-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                verificationCode,
                tempToken
            }),
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Guardar token y limpiar datos de 2FA
            localStorage.setItem('authToken', data.token);
            localStorage.removeItem('tempToken');

            hide2FAModal();
            
            // Cambiar a vista home
            const twoFactorAuthView = document.getElementById('twoFactorAuthView');
            const homeView = document.getElementById('homeView');
            if (twoFactorAuthView && homeView) {
                twoFactorAuthView.style.display = 'none';
                homeView.style.display = 'block';
            }
            
            // Actualizar nombre de usuario
            const userName = document.getElementById('userName');
            if (userName && data.username) {
                userName.textContent = data.username;
            }
        } else {
            alert('Código de verificación inválido. Por favor, intenta nuevamente.');
        }
    } catch (error) {
        console.error('Error en verificación 2FA:', error);
        alert('Error al verificar el código. Por favor, intenta nuevamente.');
    }
}

// Setup 2FA UI in profile settings
function setupTwoFactorAuthUI() {
    // Create a button for enabling 2FA
    const setup2FABtn = document.createElement('button');
    setup2FABtn.id = 'setup2FABtn';
    setup2FABtn.className = 'bg-[#318ED6] text-white px-4 py-2 rounded-lg w-full text-xs mb-2 hover:cursor-pointer hover:scale-105';
    setup2FABtn.innerText = 'Setup 2FA';
    
    // Add it to the modal content
    const modalContent = document.getElementById('modalContent');
    if (modalContent) {
        modalContent.appendChild(setup2FABtn);
        
        // Add event listener
        setup2FABtn.addEventListener('click', async () => {
            // Create a prompt for email
            const email = prompt('Enter your email to receive verification codes:');
            if (!email) return;
            
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('You must be logged in to enable 2FA');
                return;
            }
            
            try {
                const response = await fetch('https://localhost:3000/enroll-2fa', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Save session info
                    localStorage.setItem('2faSessionInfo', data.sessionInfo);
                    
                    // Ask for verification code
                    const verificationCode = prompt('Enter the verification code sent to your email:');
                    if (!verificationCode) return;
                    
                    // Verify the code
                    const verifyResponse = await fetch('https://localhost:3000/verify-2fa-enrollment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ 
                            verificationCode,
                            sessionInfo: data.sessionInfo, // This was using data without being defined
                            email
                        }),
                    });
                    
                    if (verifyResponse.ok) {
                        alert('Two-factor authentication has been enabled successfully!');
                        // Close the modal if it exists
                        const confirmModal = document.getElementById('confirmModal');
                        if (confirmModal) {
                            confirmModal.style.display = 'none';
                        }
                    } else {
                        const errorData = await verifyResponse.json();
                        alert(`Failed to verify the code: ${errorData.error || 'Unknown error'}`);
                    }
                    
                } else {
                    const errorData = await response.json();
                    alert(`Failed to setup 2FA: ${errorData.error || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error setting up 2FA:', error);
                alert('Error setting up 2FA. Please try again.');
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
                        if(loginView){
                            loginView.style.display = 'none';
                        }
                        show2FAModal();
                        
                        // Show 2FA view
                        if (loginView && twoFactorAuthView) {
                            loginView.style.display = 'none';
                            twoFactorAuthView.style.display = 'flex';
                        }
                        
                        // Alert user to check phone
                        alert('Please check your email for a verification code.');
                    } else {
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
        modal.style.display = 'flex'; // Usar flex para centrar
        
        // Asegurar que está centrado
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        
        // Enfocar en el campo de entrada
        setTimeout(() => {
            const input = document.getElementById('verificationCode') as HTMLInputElement;
            if (input) input.focus();
        }, 100);
    }
}

// Función para ocultar el modal 2FA
function hide2FAModal() {
    const modal = document.getElementById('twoFactorAuthView');
    if (modal) {
        modal.style.display = 'none';
    }
}