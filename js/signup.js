// Signup page functionality
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
  
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
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
        
        const existingUsers = storage.getItem('jdmUsers') || [];
        const userExists = existingUsers.find(user => user.email === email);
        
        if (userExists) {
          showCustomAlert('An account with this email already exists!');
          return;
        }
        
        existingUsers.push(userData);
        storage.setItem('jdmUsers', existingUsers);
        storage.setItem('jdmCurrentUser', userData);
        storage.setItem('jdmLoggedIn', 'true');
        
        showSuccessAlert('Account created successfully! Welcome to JDM Classic.');
      });
    }
  
    // Redirect if already logged in
    if (storage.getItem('jdmLoggedIn') === 'true') {
      showSuccessAlert('You are already logged in! Redirecting to homepage...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }

    // Update navigation after login/signup
    if (typeof updateAuthNavigation === 'function') {
      updateAuthNavigation();
    }   
  });