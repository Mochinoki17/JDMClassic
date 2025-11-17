// Signup page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Signup page loaded - checking storage system...');
    
    const signupForm = document.getElementById('signupForm');
    
    // Test storage system
    console.log('Storage system test:', typeof storage);
    console.log('Storage setItem test:', typeof storage.setItem);
    
    if (signupForm) {
        console.log('Signup form found, adding event listener');
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Signup form submitted');
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            console.log('Form data:', { fullName, email, password, confirmPassword });
            
            if (password !== confirmPassword) {
                console.log('Password mismatch error');
                showCustomAlert('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                console.log('Password too short error');
                showCustomAlert('Password must be at least 6 characters long!');
                return;
            }
            
            const userData = {
                fullName: fullName,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            console.log('User data to save:', userData);
            
            // Get existing users
            const existingUsers = storage.getItem('jdmUsers') || [];
            console.log('Existing users:', existingUsers);
            
            const userExists = existingUsers.find(user => user.email === email);
            
            if (userExists) {
                console.log('User already exists error');
                showCustomAlert('An account with this email already exists!');
                return;
            }
            
            // Add new user
            existingUsers.push(userData);
            console.log('Updated users list:', existingUsers);
            
            // Save to storage with error handling
            try {
                console.log('Saving users to storage...');
                storage.setItem('jdmUsers', existingUsers);
                console.log('Users saved successfully');
                
                console.log('Setting current user...');
                storage.setItem('jdmCurrentUser', userData);
                console.log('Current user set');
                
                console.log('Setting login status...');
                storage.setItem('jdmLoggedIn', 'true');
                console.log('Login status set');
                
                // Verify the data was saved
                const verifyUsers = storage.getItem('jdmUsers');
                const verifyCurrent = storage.getItem('jdmCurrentUser');
                const verifyLogin = storage.getItem('jdmLoggedIn');
                
                console.log('Verification - Users:', verifyUsers);
                console.log('Verification - Current User:', verifyCurrent);
                console.log('Verification - Login Status:', verifyLogin);
                
                if (verifyCurrent && verifyCurrent.email === email) {
                    console.log('Signup successful!');
                    showSuccessAlert('Account created successfully! Welcome to JDM Classic.');
                    
                    // Redirect after successful signup
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    console.log('Signup verification failed');
                    showCustomAlert('Account created but there was an issue. Please try logging in.');
                }
                
            } catch (error) {
                console.error('Storage error during signup:', error);
                showCustomAlert('Error creating account. Please try again.');
            }
        });
    } else {
        console.error('Signup form not found!');
    }
    
    // Redirect if already logged in
    const isLoggedIn = storage.getItem('jdmLoggedIn') === 'true';
    const currentUser = storage.getItem('jdmCurrentUser');
    
    console.log('Login check - Logged in:', isLoggedIn, 'Current user:', currentUser);
    
    if (isLoggedIn && currentUser) {
        console.log('User already logged in, redirecting...');
        showSuccessAlert('You are already logged in! Redirecting to homepage...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    // Update navigation after login/signup
    if (typeof updateAuthNavigation === 'function') {
        console.log('Updating auth navigation...');
        updateAuthNavigation();
    } else {
        console.warn('updateAuthNavigation function not found');
    }
});