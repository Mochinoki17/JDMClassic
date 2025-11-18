// app-core.js - COMBINED UTILITY + AUTH + STORAGE FUNCTIONS

console.log('🚀 Loading JDM Classic Core System...');

// ===== STORAGE SYSTEM =====
class JSONStorage {
    constructor() {
        console.log('📁 JSON Storage System Ready');
        if (!window.jsonStorageData) {
            window.jsonStorageData = {};
            console.log('🆕 JSON Storage initialized');
        }
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        try {
            const keys = Object.keys(localStorage).filter(key => key.startsWith('json_'));
            keys.forEach(key => {
                try {
                    const originalKey = key.replace('json_', '');
                    const value = JSON.parse(localStorage.getItem(key));
                    window.jsonStorageData[originalKey] = value;
                } catch (e) {
                    console.log('Failed to load from localStorage:', key);
                }
            });
            console.log('📥 Loaded from localStorage backup:', keys.length, 'items');
        } catch (e) {
            console.log('📦 LocalStorage backup unavailable');
        }
    }

    setItem(key, value) {
        console.log(`💾 JSON SAVE: ${key}`, value);
        window.jsonStorageData[key] = value;
        try {
            localStorage.setItem(`json_${key}`, JSON.stringify(value));
        } catch (e) {
            console.log('📦 LocalStorage backup failed');
        }
        return true;
    }

    getItem(key) {
        console.log(`🔍 JSON GET: ${key}`);
        const value = window.jsonStorageData[key] !== undefined ? window.jsonStorageData[key] : null;
        console.log(`📖 ${key} =`, value);
        return value;
    }

    removeItem(key) {
        console.log(`🗑️ JSON REMOVE: ${key}`);
        delete window.jsonStorageData[key];
        try {
            localStorage.removeItem(`json_${key}`);
        } catch (e) {}
    }

    clear() {
        console.log('🔥 JSON CLEAR ALL');
        window.jsonStorageData = {};
        try {
            const keys = Object.keys(localStorage).filter(key => key.startsWith('json_'));
            keys.forEach(key => localStorage.removeItem(key));
        } catch (e) {}
    }
}

// Initialize storage globally
const storage = new JSONStorage();
window.storage = storage;

// ===== ALERT FUNCTIONS =====
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

// ===== AUTHENTICATION FUNCTIONS =====
function isLoggedIn() {
    try {
        return storage.getItem('jdmLoggedIn') === 'true' && getCurrentUser() !== null;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}

function getCurrentUser() {
    try {
        return storage.getItem('jdmCurrentUser');
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

function updateAuthNavigation() {
    const authLink = document.getElementById('authLink');
    if (!authLink) return;
    
    if (isLoggedIn()) {
        const user = getCurrentUser();
        if (user && user.fullName) {
            authLink.textContent = `Logout (${user.fullName.split(' ')[0]})`;
            authLink.href = '#';
            authLink.onclick = handleLogout;
        }
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
    if (e) e.preventDefault();
    storage.removeItem('jdmCurrentUser');
    storage.setItem('jdmLoggedIn', 'false');
    showCustomAlert('You have been logged out successfully.');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ===== PROFILE FUNCTIONS =====
function getUserProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return createDefaultProfile({ fullName: '', email: '' });
    
    const profiles = storage.getItem('jdmUserProfiles') || {};
    return profiles[currentUser.email] || createDefaultProfile(currentUser);
}

function createDefaultProfile(user) {
    return {
        personalInfo: {
            fullName: user.fullName || '',
            email: user.email || '',
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
    return storage.setItem('jdmUserProfiles', profiles);
}

// ===== PURCHASE FUNCTIONS =====
function getUserPurchases() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const purchases = storage.getItem('jdmPurchases') || {};
    return purchases[user.email] || [];
}

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return '₱0';
    }
    return '₱' + amount.toLocaleString('en-PH');
}

function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function isInViewport(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function smoothScrollTo(element) {
    if (!element) return;
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function isMobile() {
    return window.innerWidth <= 768;
}

function setButtonLoading(button, isLoading) {
    if (!button) return;
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || 'Submit';
    }
}

function removeButtonLoading(button, originalText) {
    if (!button) return;
    button.disabled = false;
    button.innerHTML = originalText;
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Invalid Date';
    }
}

// ===== MAKE ALL FUNCTIONS GLOBALLY AVAILABLE =====
window.storage = storage;
window.showCustomAlert = showCustomAlert;
window.showSuccessAlert = showSuccessAlert;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.updateAuthNavigation = updateAuthNavigation;
window.handleLogout = handleLogout;
window.getUserProfile = getUserProfile;
window.saveUserProfile = saveUserProfile;
window.getUserPurchases = getUserPurchases;
window.formatCurrency = formatCurrency;
window.isValidEmail = isValidEmail;
window.debounce = debounce;
window.getQueryParam = getQueryParam;
window.isInViewport = isInViewport;
window.smoothScrollTo = smoothScrollTo;
window.generateId = generateId;
window.deepClone = deepClone;
window.isMobile = isMobile;
window.setButtonLoading = setButtonLoading;
window.removeButtonLoading = removeButtonLoading;
window.formatDate = formatDate;

console.log('✅ JDM Classic Core System Ready - All functions loaded');