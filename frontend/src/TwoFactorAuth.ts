// Handle 2FA functionality
let twoFactorAuthView: HTMLElement | null = null; // Change to nullable type

document.addEventListener('DOMContentLoaded', () => {
    // Create 2FA view element
    twoFactorAuthView = document.createElement('div');
    twoFactorAuthView.id = 'twoFactorAuthView';
    twoFactorAuthView.className = 'crt';
    twoFactorAuthView.style.display = 'none';
    
    twoFactorAuthView.innerHTML = `
        <h1 class="text-white text-xl mb-2">Two-Factor Authentication</h1>
        <p class="text-white text-xs mb-4">Enter the verification code sent to your phone:</p>
        <form id="twoFactorAuthForm">
            <input type="text" id="verificationCode" name="verificationCode" 
                   placeholder="Verification Code" required class="mb-4" />
            <button id="submitVerificationCode" type="submit">Verify</button>
        </form>
    `;
    
    document.body.appendChild(twoFactorAuthView);
    
    // Add event listener for 2FA form
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
        alert('Authentication session expired. Please login again.');
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
            
            // Save the real token
            localStorage.setItem('authToken', data.token);
            localStorage.removeItem('tempToken'); // Remove temp token
            
            // Switch to home view
            if (twoFactorAuthView && homeView) {
                twoFactorAuthView.style.display = 'none';
                homeView.style.display = 'block';
            }
            
            // Update user info
            if (userName) {
                userName.textContent = data.username;
            }
            
        } else {
            alert('Invalid verification code. Please try again.');
        }
    } catch (error) {
        console.error('Error verifying 2FA code:', error);
        alert('Error verifying code. Please try again.');
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
            // Create a prompt for phone number
            const phoneNumber = prompt('Enter your phone number (with country code, e.g., +1234567890):');
            if (!phoneNumber) return;
            
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
                    body: JSON.stringify({ phoneNumber }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Save session info
                    localStorage.setItem('2faSessionInfo', data.sessionInfo);
                    
                    // Ask for verification code
                    const verificationCode = prompt('Enter the verification code sent to your phone:');
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
                            phoneNumber
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
                        
                        // Show 2FA view
                        if (loginView && twoFactorAuthView) {
                            loginView.style.display = 'none';
                            twoFactorAuthView.style.display = 'block';
                        }
                        
                        // Alert user to check phone
                        alert('Please check your phone for a verification code.');
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