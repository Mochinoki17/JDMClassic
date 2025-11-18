// Login page specific functionality - JSON STORAGE VERSION - FIXED
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
  
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            
            console.log('🔐 Login attempt:', email);
            
            // Get users from storage
            const users = storage.getItem('jdmUsers') || [];
            console.log('📋 Total users in storage:', users.length);
            console.log('📋 Users list:', users);
            
            // Find user with matching email and password
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                console.log('✅ Login successful:', user);
                storage.setItem('jdmCurrentUser', user);
                storage.setItem('jdmLoggedIn', 'true');
                
                showSuccessAlert('Login successful! Welcome back, ' + user.fullName + '!');
                
                // Redirect after success
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                console.log('❌ Login failed - user not found or wrong password');
                showCustomAlert('Invalid email or password! Please try again or sign up.');
            }
        });
    }
  
    // Redirect if already logged in
    if (storage.getItem('jdmLoggedIn') === 'true') {
        const currentUser = storage.getItem('jdmCurrentUser');
        if (currentUser) {
            showSuccessAlert('You are already logged in! Redirecting to homepage...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    // Add alert functions if they don't exist (for login page)
    if (typeof showCustomAlert === 'undefined') {
        window.showCustomAlert = function(message) {
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
        };
    }

    if (typeof showSuccessAlert === 'undefined') {
        window.showSuccessAlert = function(message) {
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
        };
    }

    if (typeof updateAuthNavigation === 'function') {
        updateAuthNavigation();
    }
});