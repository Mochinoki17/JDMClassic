// utility-functions.js - UPDATED WITH AUTH INTEGRATION

// ===== STORAGE & AUTH INTEGRATION =====
function getStorage() {
    return window.storage || {
        getItem: (key) => {
            try {
                const data = window.jsonStorageData || {};
                return data[key] !== undefined ? data[key] : null;
            } catch (e) {
                console.error('Storage error:', e);
                return null;
            }
        },
        setItem: (key, value) => {
            try {
                if (!window.jsonStorageData) window.jsonStorageData = {};
                window.jsonStorageData[key] = value;
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        }
    };
}

// Alert functions used across all files
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
            <h2>Success!</h2>
        </div>
        <div style="text-align: center; padding: 1rem;">
            <p style="color: #28a745;">${message}</p>
            <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()" style="margin-top: 1rem; width: auto; padding: 0.75rem 2rem;">OK</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

// Auth functions used across all files
function isLoggedIn() {
    try {
        const storage = getStorage();
        return storage.getItem('jdmLoggedIn') === 'true' && getCurrentUser() !== null;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}

function getCurrentUser() {
    try {
        const storage = getStorage();
        return storage.getItem('jdmCurrentUser');
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

// ===== CORE UTILITY FUNCTIONS =====

// Format currency with error handling
function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        console.warn('Invalid amount provided to formatCurrency:', amount);
        return '₱0';
    }
    return '₱' + amount.toLocaleString('en-PH');
}

// Validate email format
function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// Validate phone number (Philippines format)
function isValidPhone(phone) {
    if (typeof phone !== 'string') return false;
    // Philippine phone numbers: +63XXXXXXXXX or 09XXXXXXXXX
    const phoneRegex = /^(?:\+63|0)9\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Debounce function for performance optimization
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Get query parameters from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Set query parameters in URL without page reload
function setQueryParam(param, value) {
    const url = new URL(window.location);
    if (value === null || value === '') {
        url.searchParams.delete(param);
    } else {
        url.searchParams.set(param, value);
    }
    window.history.replaceState({}, '', url);
}

// Check if element is in viewport
function isInViewport(element, offset = 0) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -offset &&
        rect.left >= -offset &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
    );
}

// Smooth scroll to element with offset support
function smoothScrollTo(element, offset = 0) {
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Deep clone object
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Check if user is on mobile device
function isMobile() {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Add loading state to button
function setButtonLoading(button, isLoading, loadingText = 'Loading...') {
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.setAttribute('data-original-text', button.innerHTML);
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || button.innerHTML;
        button.classList.remove('loading');
    }
}

// Remove loading state from button
function removeButtonLoading(button, originalText = null) {
    if (!button) return;
    
    button.disabled = false;
    if (originalText) {
        button.innerHTML = originalText;
    } else {
        const original = button.getAttribute('data-original-text');
        if (original) button.innerHTML = original;
    }
    button.classList.remove('loading');
}

// Format date (used in cart-system.js)
function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ===== PROFILE FUNCTIONS (for user-profile.js) =====
function getUserProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return {};
    
    const storage = getStorage();
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
    
    const storage = getStorage();
    let profiles = storage.getItem('jdmUserProfiles') || {};
    profiles[currentUser.email] = profileData;
    return storage.setItem('jdmUserProfiles', profiles);
}

// ===== PURCHASE FUNCTIONS (for cart-system.js) =====
function getUserPurchases() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const storage = getStorage();
    const purchases = storage.getItem('jdmPurchases') || {};
    return purchases[user.email] || [];
}

// ===== NAVIGATION FUNCTIONS =====
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
    const storage = getStorage();
    storage.removeItem('jdmCurrentUser');
    storage.setItem('jdmLoggedIn', 'false');
    showCustomAlert('You have been logged out successfully.');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Make ALL functions globally available
window.formatCurrency = formatCurrency;
window.isValidEmail = isValidEmail;
window.isValidPhone = isValidPhone;
window.debounce = debounce;
window.getQueryParam = getQueryParam;
window.setQueryParam = setQueryParam;
window.isInViewport = isInViewport;
window.smoothScrollTo = smoothScrollTo;
window.generateId = generateId;
window.deepClone = deepClone;
window.isMobile = isMobile;
window.setButtonLoading = setButtonLoading;
window.removeButtonLoading = removeButtonLoading;
window.formatDate = formatDate;

// Auth functions
window.showCustomAlert = showCustomAlert;
window.showSuccessAlert = showSuccessAlert;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.getUserProfile = getUserProfile;
window.saveUserProfile = saveUserProfile;
window.getUserPurchases = getUserPurchases;
window.updateAuthNavigation = updateAuthNavigation;
window.handleLogout = handleLogout;

console.log('🚀 Utility functions loaded with auth integration');