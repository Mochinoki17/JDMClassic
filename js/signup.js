// signup.js - FOOLPROOF VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Signup page loaded - FOOLPROOF VERSION');
    
    // Test storage immediately
    console.log('🧪 Storage test:', storage ? 'READY' : 'MISSING');
    console.log('📊 Current storage data:', storage.debug());
    
    const signupForm = document.getElementById('signupForm');
    
    if (!signupForm) {
        console.error('❌ SIGNUP FORM NOT FOUND!');
        return;
    }
    
    console.log('✅ Signup form found, setting up listener...');
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('🎯 SIGNUP FORM SUBMITTED');
        
        // Get form values
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        console.log('📝 Form data:', { fullName, email, password: '***' });
        
        // Basic validation
        if (!fullName || !email || !password) {
            alert('Please fill in all fields!');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters!');
            return;
        }
        
        // Create user object
        const userData = {
            fullName: fullName,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        console.log('👤 User data created:', userData);
        
        // Get existing users
        const existingUsers = storage.getItem('jdmUsers') || [];
        console.log('📋 Existing users count:', existingUsers.length);
        
        // Check for duplicate email
        if (existingUsers.find(user => user.email === email)) {
            alert('An account with this email already exists!');
            return;
        }
        
        // Add new user
        existingUsers.push(userData);
        console.log('📈 Updated users list:', existingUsers);
        
        // STEP 1: Save users list
        console.log('💾 STEP 1: Saving users list...');
        storage.setItem('jdmUsers', existingUsers);
        
        // STEP 2: Save current user
        console.log('💾 STEP 2: Saving current user...');
        storage.setItem('jdmCurrentUser', userData);
        
        // STEP 3: Set login status
        console.log('💾 STEP 3: Setting login status...');
        storage.setItem('jdmLoggedIn', 'true');
        
        // Immediate verification
        console.log('🔍 IMMEDIATE VERIFICATION:');
        const verify1 = storage.getItem('jdmUsers');
        const verify2 = storage.getItem('jdmCurrentUser');
        const verify3 = storage.getItem('jdmLoggedIn');
        
        console.log('✅ jdmUsers:', verify1 ? verify1.length + ' users' : 'MISSING');
        console.log('✅ jdmCurrentUser:', verify2 ? verify2.email : 'MISSING');
        console.log('✅ jdmLoggedIn:', verify3);
        
        if (verify2 && verify2.email === email) {
            console.log('🎉 SIGNUP SUCCESSFUL!');
            alert('🎉 Account created successfully! Welcome to JDM Classic!');
            
            // Show all storage data
            console.log('📊 FINAL STORAGE STATE:');
            storage.debug();
            
            // Redirect to homepage
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            console.error('💥 SIGNUP FAILED - Storage verification failed');
            alert('Account creation failed. Please try again.');
        }
    });
    
    // Check if already logged in
    const currentUser = storage.getItem('jdmCurrentUser');
    const isLoggedIn = storage.getItem('jdmLoggedIn') === 'true';
    
    console.log('🔐 Current login status:', { isLoggedIn, user: currentUser });
    
    if (isLoggedIn && currentUser) {
        console.log('🔄 Already logged in as:', currentUser.email);
        alert(`You are already logged in as ${currentUser.fullName}! Redirecting...`);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
});