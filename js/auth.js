// Authentication functions
function showCustomAlert(message) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.display = 'flex';
    overlay.style.zIndex = '3000';
    
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.innerHTML = `
      <div class="modal-header">
        <h2>JDM Classic</h2>
      </div>
      <div style="text-align: center; padding: 1rem;">
        <p>${message}</p>
        <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()" style="margin-top: 1rem; width: auto; padding: 0.75rem 2rem;">OK</button>
      </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }
  
  function showSuccessAlert(message) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.display = 'flex';
    overlay.style.zIndex = '3000';
    
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.innerHTML = `
      <div class="modal-header">
        <h2>JDM Classic</h2>
      </div>
      <div style="text-align: center; padding: 1rem;">
        <p>${message}</p>
        <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()" style="margin-top: 1rem; width: auto; padding: 0.75rem 2rem;">OK</button>
      </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }
  
  function isLoggedIn() {
    return storage.getItem('jdmLoggedIn') === 'true';
  }
  
  function getCurrentUser() {
    return storage.getItem('jdmCurrentUser');
  }

  function updateAuthNavigation() {
    const authLink = document.getElementById('authLink');
    if (!authLink) return;
    
    if (isLoggedIn()) {
      const user = getCurrentUser();
      authLink.textContent = `Logout (${user.fullName.split(' ')[0]})`;
      authLink.href = '#';
      authLink.onclick = handleLogout;
    } else {
      authLink.textContent = 'Login';
      authLink.href = '#';
      authLink.onclick = function(e) {
        e.preventDefault();
        // This will be handled by login-modal.js
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
          loginModal.style.display = 'flex';
          document.body.classList.add('modal-active');
        } else {
          window.location.href = 'login.html';
        }
      };
    }
  }
  
  function handleLogout(e) {
    e.preventDefault();
    storage.removeItem('jdmCurrentUser');
    storage.setItem('jdmLoggedIn', 'false');
    showCustomAlert('You have been logged out successfully.');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }

// ===== PURCHASE HISTORY MANAGEMENT =====

// Get user's purchases
function getUserPurchases() {
  const user = getCurrentUser();
  if (!user) return [];
  
  const purchases = storage.getItem('jdmPurchases') || {};
  return purchases[user.email] || [];
}

// Remove a purchase by ID
function removePurchase(purchaseId) {
  const user = getCurrentUser();
  if (!user) return false;
  
  let purchases = storage.getItem('jdmPurchases') || {};
  if (purchases[user.email]) {
    purchases[user.email] = purchases[user.email].filter(
      purchase => purchase.id !== purchaseId
    );
    
    storage.setItem('jdmPurchases', purchases);
    return true;
  }
  return false;
}

// Confirm deletion
function confirmDeletePurchase(purchaseId, carName) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';
  overlay.style.zIndex = '3000';
  
  const modal = document.createElement('div');
  modal.className = 'modal-content';
  modal.innerHTML = `
    <div class="modal-header">
      <h2>Confirm Delete</h2>
    </div>
    <div style="text-align: center; padding: 1rem;">
      <p>Are you sure you want to remove <strong>${carName}</strong> from your purchase history?</p>
      <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="btn-primary" id="confirmDeleteBtn" style="background: #ff3b3b;">Delete</button>
      </div>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Add event listener to the delete button
  document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
    deletePurchase(purchaseId, this);
  });
}

// Delete purchase function
function deletePurchase(purchaseId, button) {
  if (removePurchase(purchaseId)) {
    showSuccessAlert('Purchase removed from history!');
    button.closest('.modal-overlay').remove();
    // Refresh the purchase history display
    if (typeof displayPurchaseHistory === 'function') {
      displayPurchaseHistory();
    }
  } else {
    showCustomAlert('Failed to remove purchase.');
  }
}

// Make functions globally available
window.confirmDeletePurchase = confirmDeletePurchase;
window.deletePurchase = deletePurchase;
window.removePurchase = removePurchase;
window.getUserPurchases = getUserPurchases;

function getUserProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return {};
    
    const profiles = storage.getItem('jdmUserProfiles') || {};
    return profiles[currentUser.email] || createDefaultProfile(currentUser);
}

function createDefaultProfile(user) {
    return {
        personalInfo: {
            fullName: user.fullName,
            email: user.email,
            phone: '',
            address: ''
        },
        preferences: {
            favoriteBrands: [],
            newsletter: 'monthly',
            eventNotifications: true
        },
        notifications: {
            email: {
                purchase: true,
                shipping: true,
                promotions: false,
                events: true
            },
            push: {
                new_cars: true,
                price_drops: false,
                maintenance: false
            }
        }
    };
}

function saveUserProfile(profileData) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    let profiles = storage.getItem('jdmUserProfiles') || {};
    profiles[currentUser.email] = profileData;
    storage.setItem('jdmUserProfiles', profiles);
    return true;
}

// Update user greeting in navigation
function updateUserGreeting() {
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting && isLoggedIn()) {
        const user = getCurrentUser();
        userGreeting.textContent = `Hello, ${user.fullName.split(' ')[0]}`;
        userGreeting.style.display = 'block';
    } else if (userGreeting) {
        userGreeting.style.display = 'none';
    }
}

// Update navigation for all pages
function updateGlobalNavigation() {
    updateAuthNavigation();
    updateUserGreeting();
    
    // Update cart count if cart system is loaded
    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }
}

// Make functions globally available
window.updateUserGreeting = updateUserGreeting;
window.updateGlobalNavigation = updateGlobalNavigation;

function getCurrentUser() {
    try {
        return storage.getItem('jdmCurrentUser');
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

function isLoggedIn() {
    try {
        return storage.getItem('jdmLoggedIn') === 'true' && getCurrentUser() !== null;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}