// signup.js - SIMPLE WORKING VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Signup page loaded');
    
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Signup started');
            
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
            
            const userData = {
                fullName: fullName,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            // Get existing users
            const existingUsers = storage.getItem('jdmUsers') || [];
            
            // Check if user exists
            if (existingUsers.find(user => user.email === email)) {
                alert('Email already exists!');
                return;
            }
            
            // Add new user
            existingUsers.push(userData);
            
            // Save everything
            storage.setItem('jdmUsers', existingUsers);
            storage.setItem('jdmCurrentUser', userData);
            storage.setItem('jdmLoggedIn', 'true');
            
            console.log('✅ Signup COMPLETE');
            alert('Account created successfully! Redirecting...');
            
            // Redirect
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    // Redirect if already logged in
    if (storage.getItem('jdmLoggedIn') === 'true') {
        alert('Already logged in! Redirecting...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
});