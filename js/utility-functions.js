// Utility functions - UPDATED FOR GITHUB STORAGE

// Format currency
function formatCurrency(amount) {
    return '₱' + amount.toLocaleString();
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number (basic)
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Debounce function for search inputs
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

// Get query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Set query parameters
function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url);
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Deep clone object
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Check if user is on mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Add loading state to button
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || 'Submit';
    }
}

// Remove loading state from button
function removeButtonLoading(button, originalText) {
    button.disabled = false;
    button.innerHTML = originalText;
}

// Make functions globally available
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