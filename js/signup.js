// Signup page functionality - JSON STORAGE VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Signup page loaded - JSON STORAGE');
    
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        console.log('✅ Signup form found');
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🎯 SIGNUP STARTED');
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                showCustomAlert('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                showCustomAlert('Password must be at least 6 characters long!');
                return;
            }
            
            const userData = {
                fullName: fullName,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            console.log('👤 Creating user:', userData);
            
            const existingUsers = storage.getItem('jdmUsers') || [];
            console.log('📋 Existing users:', existingUsers.length);
            
            const userExists = existingUsers.find(user => user.email === email);
            
            if (userExists) {
                showCustomAlert('An account with this email already exists!');
                return;
            }
            
            existingUsers.push(userData);
            console.log('📈 New users count:', existingUsers.length);
            
            // Save to JSON storage
            console.log('💾 Saving to JSON storage...');
            storage.setItem('jdmUsers', existingUsers);
            storage.setItem('jdmCurrentUser', userData);
            storage.setItem('jdmLoggedIn', 'true');
            
            // Verify
            console.log('🔍 Verifying save...');
            const savedUsers = storage.getItem('jdmUsers');
            const savedUser = storage.getItem('jdmCurrentUser');
            const savedLogin = storage.getItem('jdmLoggedIn');
            
            console.log('✅ Verification:');
            console.log(' - Users:', savedUsers ? savedUsers.length + ' users' : 'FAILED');
            console.log(' - Current User:', savedUser ? savedUser.email : 'FAILED');
            console.log(' - Login Status:', savedLogin);
            
            if (savedUser && savedUser.email === email) {
                console.log('🎉 JSON STORAGE SUCCESS!');
                showSuccessAlert('Account created successfully with JSON storage! Welcome to JDM Classic.');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                console.error('❌ JSON STORAGE FAILED');
                showCustomAlert('Account creation failed. Please try again.');
            }
        });
    }
    
    // Redirect if already logged in
    if (storage.getItem('jdmLoggedIn') === 'true') {
        showSuccessAlert('You are already logged in! Redirecting to homepage...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    if (typeof updateAuthNavigation === 'function') {
        updateAuthNavigation();
    }   
});