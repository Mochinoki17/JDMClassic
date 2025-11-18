// Authentication functions - UPDATED FOR JSON STORAGE
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
function getUserPurchases() {
  const user = getCurrentUser();
  if (!user) return [];
  
  const purchases = storage.getItem('jdmPurchases') || {};
  return purchases[user.email] || [];
}

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
  
  document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
    deletePurchase(purchaseId, this);
  });
}

function deletePurchase(purchaseId, button) {
  if (removePurchase(purchaseId)) {
    showSuccessAlert('Purchase removed from history!');
    button.closest('.modal-overlay').remove();
    if (typeof displayPurchaseHistory === 'function') {
      displayPurchaseHistory();
    }
  } else {
    showCustomAlert('Failed to remove purchase.');
  }
}

// FIX: Added loadPurchaseHistory function integrated with getUserPurchases()
// This ensures the purchase history displays correctly on the page
function loadPurchaseHistory() {
    console.log('Loading purchase history...');
    
    const historySection = document.getElementById('purchaseHistory');
    const historyContainer = document.getElementById('historyContainer');
    
    if (!historySection || !historyContainer) {
        console.log('Purchase history elements not found on this page');
        return;
    }
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        console.log('User not logged in, hiding history section');
        historySection.style.display = 'none';
        return;
    }
    
    const user = getCurrentUser();
    console.log('Loading purchases for user:', user.email);
    
    // Use getUserPurchases() for consistency
    const userPurchases = getUserPurchases();
    
    console.log('Found purchases for user:', userPurchases.length);
    console.log('User purchases data:', userPurchases);
    
    if (userPurchases.length === 0) {
        historyContainer.innerHTML = `
            <div class="no-history">
                <i class="fas fa-history"></i>
                <h3>No Purchase History</h3>
                <p>You haven't made any purchases yet.</p>
                <p>Start shopping to see your history here!</p>
            </div>
        `;
        historySection.style.display = 'block'; // Show section with empty state
    } else {
        // Sort purchases by date (newest first)
        userPurchases.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        historyContainer.innerHTML = `
            <div class="history-container">
                ${userPurchases.map(purchase => `
                    <div class="history-item">
                        <div class="history-item-header">
                            <div class="history-car-name">${purchase.car}</div>
                            <div class="history-date">${formatDate ? formatDate(purchase.date) : new Date(purchase.date).toLocaleDateString()}</div>
                        </div>
                        <div class="history-details">
                            <div>Quantity: ${purchase.quantity}</div>
                            <div>Base Price: ₱${(purchase.basePrice || purchase.price).toLocaleString()}</div>
                            ${purchase.parts && purchase.parts.length > 0 ? `
                                <div class="history-parts">
                                    <div class="history-parts-title">Custom Parts:</div>
                                    ${purchase.parts.map(part => `
                                        <div class="history-part-item">
                                            <span>${part.name}</span>
                                            <span>₱${part.price.toLocaleString()}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            <div class="history-price">Total: ₱${purchase.total.toLocaleString()}</div>
                            <div class="history-shipping">
                                <small>Shipped to: ${purchase.shippingInfo ? `${purchase.shippingInfo.address}, ${purchase.shippingInfo.city}` : 'N/A'}</small>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        historySection.style.display = 'block';
    }
    
    console.log('Purchase history loaded and displayed');
}

// FIX: Alias displayPurchaseHistory to loadPurchaseHistory for compatibility
// This ensures deletePurchase() can call it without errors
function displayPurchaseHistory() {
    loadPurchaseHistory();
}

// Make functions globally available
window.confirmDeletePurchase = confirmDeletePurchase;
window.deletePurchase = deletePurchase;
window.removePurchase = removePurchase;
window.getUserPurchases = getUserPurchases;
window.loadPurchaseHistory = loadPurchaseHistory; // FIX: Made globally available
window.displayPurchaseHistory = displayPurchaseHistory; // FIX: Alias for compatibility

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

function updateGlobalNavigation() {
    updateAuthNavigation();
    updateUserGreeting();
    
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