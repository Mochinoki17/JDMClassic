// signup.js - ULTRA-SIMPLE WORKING VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Signup page loaded');
    
    // Test storage immediately
    console.log('🧪 Storage test:', storage ? 'READY' : 'FAILED');
    
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🎯 SIGNUP STARTED');
            
            // Get form data
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters!');
                return;
            }
            
            // Create user
            const userData = {
                fullName: fullName,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            console.log('👤 Creating user:', userData);
            
            // Get existing users
            let existingUsers = storage.getItem('jdmUsers');
            if (!existingUsers) {
                existingUsers = [];
                console.log('📝 No existing users, creating new array');
            }
            
            // Check for duplicates
            if (existingUsers.find(user => user.email === email)) {
                alert('Email already exists!');
                return;
            }
            
            // Add user
            existingUsers.push(userData);
            console.log('📊 Users count:', existingUsers.length);
            
            // SAVE EVERYTHING
            console.log('💾 Saving users list...');
            storage.setItem('jdmUsers', existingUsers);
            
            console.log('💾 Setting current user...');
            storage.setItem('jdmCurrentUser', userData);
            
            console.log('💾 Setting login status...');
            storage.setItem('jdmLoggedIn', 'true');
            
            // VERIFY
            console.log('🔍 Verifying save...');
            const verifiedUser = storage.getItem('jdmCurrentUser');
            const verifiedLogin = storage.getItem('jdmLoggedIn');
            
            if (verifiedUser && verifiedUser.email === email) {
                console.log('🎉 SUCCESS! User created and logged in');
                alert('✅ Account created successfully! Welcome to JDM Classic!');
                
                // Show success and redirect
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                console.error('❌ FAILED: Storage verification failed');
                alert('Account creation failed. Please try again.');
            }
        });
    }
});