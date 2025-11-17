// Login modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('loginModal');
    const openLogin = document.getElementById('openLogin');
    const loginForm = document.getElementById('loginForm');
  
    // Auto-show modal if not logged in
    if (loginModal && storage.getItem('jdmLoggedIn') !== 'true') {
      setTimeout(() => {
        loginModal.style.display = 'flex';
        document.body.classList.add('modal-active');
      }, 1000);
    }
  
    // Open login modal
    if (openLogin) {
      openLogin.addEventListener('click', function(e) {
        e.preventDefault();
        if (storage.getItem('jdmLoggedIn') !== 'true') {
          loginModal.style.display = 'flex';
          document.body.classList.add('modal-active');
        }
      });
    }
  
    // Handle login form submission
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        const users = storage.getItem('jdmUsers') || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          loginModal.style.display = 'none';
          document.body.classList.remove('modal-active');
          storage.setItem('jdmCurrentUser', user);
          storage.setItem('jdmLoggedIn', 'true');
          showSuccessAlert('Login successful! Welcome back, ' + user.fullName + '!');
          
          // Refresh page to update UI
          setTimeout(() => window.location.reload(), 1500);
        } else {
          showCustomAlert('Invalid email or password! Please try again or sign up.');
        }
      });
    }
  
    // Hide modal if already logged in
    if (loginModal && storage.getItem('jdmLoggedIn') === 'true') {
      loginModal.style.display = 'none';
      document.body.classList.remove('modal-active');
    }
  });

  // Update navigation when login is successful
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth navigation
    if (typeof updateAuthNavigation === 'function') {
      updateAuthNavigation();
    }
    
    // Also update when login happens (for modal login)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      const originalSubmit = loginForm.onsubmit;
      loginForm.onsubmit = function(e) {
        if (originalSubmit) originalSubmit.call(this, e);
        // Update navigation after successful login
        setTimeout(() => {
          if (typeof updateAuthNavigation === 'function') {
            updateAuthNavigation();
          }
        }, 100);
      };
    }
  });

  // Add modal close functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
        document.body.classList.remove('modal-active');
    }
});

// Add ESC key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-active');
        });
    }
});