// Signup page functionality - JSON STORAGE VERSION - FIXED PERSISTENCE
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Signup page loaded - JSON STORAGE');
    
    // Create robust storage system
    function getStorage() {
        if (window.storage && typeof window.storage.setItem === 'function') {
            return window.storage;
        } else {
            console.warn('Using enhanced localStorage fallback');
            return {
                setItem: function(key, value) {
                    try {
                        // Save to multiple locations for redundancy
                        localStorage.setItem('jdm_' + key, JSON.stringify(value));
                        sessionStorage.setItem('jdm_' + key, JSON.stringify(value));
                        console.log('💾 Saved to storage:', key, value);
                        return true;
                    } catch (e) {
                        console.error('Storage error:', e);
                        return false;
                    }
                },
                getItem: function(key) {
                    try {
                        // Try multiple storage locations
                        let item = localStorage.getItem('jdm_' + key);
                        if (!item) {
                            item = sessionStorage.getItem('jdm_' + key);
                        }
                        return item ? JSON.parse(item) : null;
                    } catch (e) {
                        console.error('Storage get error:', e);
                        return null;
                    }
                },
                removeItem: function(key) {
                    localStorage.removeItem('jdm_' + key);
                    sessionStorage.removeItem('jdm_' + key);
                }
            };
        }
    }

    // Create alert functions
    function showCustomAlert(message) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 10px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 2px solid #d9534f;
        `;
        
        modal.innerHTML = `
            <div style="margin-bottom: 1rem; color: #333;">
                <h3 style="margin: 0 0 1rem 0; color: #d9534f;">JDM Classic</h3>
                <p style="margin: 0; font-size: 16px; line-height: 1.5;">${message}</p>
            </div>
            <button onclick="this.closest('.modal-overlay').remove()" 
                    style="margin-top: 1rem; padding: 12px 30px; background: #d9534f; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold;">
                OK
            </button>
        `;
        
        overlay.className = 'modal-overlay';
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    function showSuccessAlert(message) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 10px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 2px solid #28a745;
        `;
        
        modal.innerHTML = `
            <div style="margin-bottom: 1rem; color: #333;">
                <h3 style="margin: 0 0 1rem 0; color: #28a745;">Success!</h3>
                <p style="margin: 0; font-size: 16px; line-height: 1.5;">${message}</p>
            </div>
            <button onclick="this.closest('.modal-overlay').remove()" 
                    style="margin-top: 1rem; padding: 12px 30px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold;">
                OK
            </button>
        `;
        
        overlay.className = 'modal-overlay';
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        console.log('✅ Signup form found');
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🎯 SIGNUP STARTED');
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (!fullName || !email || !password || !confirmPassword) {
                showCustomAlert('Please fill out all fields!');
                return;
            }
            
            if (password !== confirmPassword) {
                showCustomAlert('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                showCustomAlert('Password must be at least 6 characters long!');
                return;
            }
            
            if (!email.includes('@') || !email.includes('.')) {
                showCustomAlert('Please enter a valid email address!');
                return;
            }
            
            const userData = {
                fullName: fullName,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            console.log('👤 Creating user:', userData);
            
            try {
                const storage = getStorage();
                
                // Get existing users
                let existingUsers = storage.getItem('jdmUsers') || [];
                console.log('📋 Existing users:', existingUsers.length);
                
                // Check if user exists
                const userExists = existingUsers.find(user => user.email === email);
                if (userExists) {
                    showCustomAlert('An account with this email already exists!');
                    return;
                }
                
                // Add new user
                existingUsers.push(userData);
                
                // CRITICAL: Save with delays to ensure persistence
                console.log('💾 Saving user data...');
                
                // Save users array
                const usersSaved = storage.setItem('jdmUsers', existingUsers);
                
                // Small delay to ensure first save completes
                setTimeout(() => {
                    // Save current user
                    const userSaved = storage.setItem('jdmCurrentUser', userData);
                    
                    // Small delay before saving login status
                    setTimeout(() => {
                        const loginSaved = storage.setItem('jdmLoggedIn', 'true');
                        
                        console.log('💾 All saves completed:', {
                            users: usersSaved,
                            currentUser: userSaved,
                            login: loginSaved
                        });
                        
                        // Verify everything was saved
                        setTimeout(() => {
                            const verifyUsers = storage.getItem('jdmUsers');
                            const verifyCurrent = storage.getItem('jdmCurrentUser');
                            const verifyLogin = storage.getItem('jdmLoggedIn');
                            
                            console.log('🔍 Final verification:', {
                                users: verifyUsers ? verifyUsers.length + ' users' : 'FAILED',
                                currentUser: verifyCurrent ? verifyCurrent.email : 'FAILED',
                                login: verifyLogin
                            });
                            
                            if (verifyCurrent && verifyCurrent.email === email && verifyLogin === 'true') {
                                console.log('🎉 SIGNUP COMPLETE - Redirecting to index.html');
                                
                                // Force save one more time before redirect
                                storage.setItem('jdmLoggedIn', 'true');
                                storage.setItem('jdmCurrentUser', userData);
                                
                                showSuccessAlert(`Welcome to JDM Classic, ${fullName}! Redirecting...`);
                                
                                // Use replace instead of href to prevent navigation issues
                                setTimeout(() => {
                                    window.location.replace('index.html');
                                }, 2000);
                                
                            } else {
                                console.error('❌ SIGNUP FAILED - Data not persisted');
                                showCustomAlert('Account creation failed. Please try again.');
                            }
                        }, 100);
                    }, 100);
                }, 100);
                
            } catch (error) {
                console.error('❌ SIGNUP ERROR:', error);
                showCustomAlert('An unexpected error occurred. Please try again.');
            }
        });
    }
    
    // Check if already logged in
    setTimeout(() => {
        try {
            const storage = getStorage();
            const currentUser = storage.getItem('jdmCurrentUser');
            const isLoggedIn = storage.getItem('jdmLoggedIn') === 'true';
            
            if (isLoggedIn && currentUser) {
                console.log('ℹ️ User already logged in, redirecting:', currentUser.email);
                showSuccessAlert(`Welcome back, ${currentUser.fullName}! Redirecting...`);
                setTimeout(() => {
                    window.location.replace('index.html');
                }, 2000);
            }
        } catch (error) {
            console.log('User not logged in');
        }
    }, 500);
});