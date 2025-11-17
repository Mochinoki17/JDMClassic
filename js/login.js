// Login page specific functionality - JSON STORAGE VERSION
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
  
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const users = storage.getItem('jdmUsers') || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          storage.setItem('jdmCurrentUser', user);
          storage.setItem('jdmLoggedIn', 'true');
          showSuccessAlert('Login successful! Welcome back, ' + user.fullName + '!');
        } else {
          showCustomAlert('Invalid email or password! Please try again or sign up.');
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