// Signup page functionality - TESTED VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Signup page loaded');
    
    const signupForm = document.getElementById('signupForm');
    
    // Test storage immediately
    console.log('🧪 Storage test:', typeof storage !== 'undefined' ? 'OK' : 'MISSING');
    
    if (signupForm) {
        console.log('✅ Signup form found');
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Signup form submitted');
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            console.log('📋 Form data captured');
            
            // Validation
            if (password !== confirmPassword) {
                console.log('❌ Password mismatch');
                showCustomAlert('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                console.log('❌ Password too short');
                showCustomAlert('Password must be at least 6 characters long!');
                return;
            }
            
            const userData = {
                fullName: fullName,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            console.log('👤 User data prepared:', userData);
            
            // Get existing users
            const existingUsers = storage.getItem('jdmUsers') || [];
            console.log('📊 Existing users:', existingUsers.length);
            
            // Check if user exists
            const userExists = existingUsers.find(user => user.email === email);
            if (userExists) {
                console.log('❌ User already exists');
                showCustomAlert('An account with this email already exists!');
                return;
            }
            
            // Add new user
            existingUsers.push(userData);
            console.log('📈 Updated users list:', existingUsers.length, 'users');
            
            try {
                // Save everything
                console.log('💾 Saving users list...');
                storage.setItem('jdmUsers', existingUsers);
                
                console.log('💾 Setting current user...');
                storage.setItem('jdmCurrentUser', userData);
                
                console.log('💾 Setting login status...');
                storage.setItem('jdmLoggedIn', 'true');
                
                // Verify saves
                setTimeout(() => {
                    const verifyUsers = storage.getItem('jdmUsers');
                    const verifyCurrent = storage.getItem('jdmCurrentUser');
                    const verifyLogin = storage.getItem('jdmLoggedIn');
                    
                    console.log('🔍 Verification:');
                    console.log(' - Users:', verifyUsers ? verifyUsers.length + ' users' : 'MISSING');
                    console.log(' - Current User:', verifyCurrent ? verifyCurrent.email : 'MISSING');
                    console.log(' - Login Status:', verifyLogin);
                    
                    if (verifyCurrent && verifyCurrent.email === email) {
                        console.log('✅ Signup SUCCESSFUL!');
                        showSuccessAlert('Account created successfully! Welcome to JDM Classic.');
                        
                        // Redirect to homepage
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 2000);
                    } else {
                        console.log('❌ Signup verification failed');
                        showCustomAlert('Account created but verification failed. Please try logging in.');
                    }
                }, 100);
                
            } catch (error) {
                console.error('💥 Storage error:', error);
                showCustomAlert('Error creating account. Please try again.');
            }
        });
    } else {
        console.error('❌ Signup form not found!');
    }
    
    // Check if already logged in
    const currentUser = storage.getItem('jdmCurrentUser');
    const isLoggedIn = storage.getItem('jdmLoggedIn') === 'true';
    
    console.log('🔐 Login status check:', { isLoggedIn, currentUser: currentUser ? currentUser.email : 'None' });
    
    if (isLoggedIn && currentUser) {
        console.log('🔄 Already logged in, redirecting...');
        showSuccessAlert('You are already logged in! Redirecting to homepage...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
    
    // Debug storage
    console.log('🐛 Storage debug:');
    if (typeof storage.debugStorage === 'function') {
        storage.debugStorage();
    }
});