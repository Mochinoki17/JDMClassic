// User profile functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        showCustomAlert('Please log in to access your profile.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // Initialize profile navigation
    initProfileNavigation();
    
    // Load profile data
    loadProfileData();
    
    // Setup form handlers
    setupFormHandlers();
    
    // Setup action buttons
    setupActionButtons();
});

function initProfileNavigation() {
    const navLinks = document.querySelectorAll('.profile-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            const sections = document.querySelectorAll('.profile-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

function loadProfileData() {
    const user = getCurrentUser();
    const profile = getUserProfile();
    
    // Update user info in sidebar
    document.getElementById('userName').textContent = user.fullName;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userAvatar').textContent = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('profileWelcome').textContent = `Welcome, ${user.fullName}! Manage your account settings and preferences`;
    
    // Load personal info
    document.getElementById('profileFullName').value = profile.personalInfo.fullName;
    document.getElementById('profileEmail').value = profile.personalInfo.email;
    document.getElementById('profilePhone').value = profile.personalInfo.phone || '';
    document.getElementById('profileAddress').value = profile.personalInfo.address || '';
    
    // Load preferences
    const brandCheckboxes = document.querySelectorAll('input[name="brands"]');
    brandCheckboxes.forEach(checkbox => {
        checkbox.checked = profile.preferences.favoriteBrands.includes(checkbox.value);
    });
    
    document.getElementById('newsletter').value = profile.preferences.newsletter;
    document.getElementById('eventNotifications').checked = profile.preferences.eventNotifications;
    
    // Load notifications
    const emailNotifications = document.querySelectorAll('input[name="emailNotifications"]');
    emailNotifications.forEach(checkbox => {
        checkbox.checked = profile.notifications.email[checkbox.value] || false;
    });
    
    const pushNotifications = document.querySelectorAll('input[name="pushNotifications"]');
    pushNotifications.forEach(checkbox => {
        checkbox.checked = profile.notifications.push[checkbox.value] || false;
    });
}

function setupFormHandlers() {
    // Personal info form
    const personalForm = document.getElementById('personalInfoForm');
    if (personalForm) {
        personalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePersonalInfo();
        });
    }
    
    // Preferences form
    const preferencesForm = document.getElementById('preferencesForm');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePreferences();
        });
    }
    
    // Security form
    const securityForm = document.getElementById('securityForm');
    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updatePassword();
        });
    }
    
    // Notifications form
    const notificationsForm = document.getElementById('notificationsForm');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveNotifications();
        });
    }
}

function setupActionButtons() {
    // Export data button
    const exportBtn = document.getElementById('exportData');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportUserData);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Delete account button
    const deleteBtn = document.getElementById('deleteAccount');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', confirmDeleteAccount);
    }
}

function savePersonalInfo() {
    const profile = getUserProfile();
    
    profile.personalInfo.fullName = document.getElementById('profileFullName').value;
    profile.personalInfo.email = document.getElementById('profileEmail').value;
    profile.personalInfo.phone = document.getElementById('profilePhone').value;
    profile.personalInfo.address = document.getElementById('profileAddress').value;
    
    if (saveUserProfile(profile)) {
        showSuccessAlert('Personal information updated successfully!');
        
        // Update current user data if email or name changed
        const user = getCurrentUser();
        user.fullName = profile.personalInfo.fullName;
        user.email = profile.personalInfo.email;
        storage.setItem('jdmCurrentUser', user);
        
        // Update UI
        document.getElementById('userName').textContent = user.fullName;
        document.getElementById('userAvatar').textContent = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    } else {
        showCustomAlert('Failed to update personal information.');
    }
}

function savePreferences() {
    const profile = getUserProfile();
    
    // Get selected brands
    profile.preferences.favoriteBrands = Array.from(document.querySelectorAll('input[name="brands"]:checked'))
        .map(checkbox => checkbox.value);
    
    profile.preferences.newsletter = document.getElementById('newsletter').value;
    profile.preferences.eventNotifications = document.getElementById('eventNotifications').checked;
    
    if (saveUserProfile(profile)) {
        showSuccessAlert('Preferences updated successfully!');
    } else {
        showCustomAlert('Failed to update preferences.');
    }
}

function updatePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        showCustomAlert('Please fill out all password fields.');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showCustomAlert('New passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        showCustomAlert('New password must be at least 6 characters long.');
        return;
    }
    
    // Verify current password
    const user = getCurrentUser();
    const users = storage.getItem('jdmUsers') || [];
    const userIndex = users.findIndex(u => u.email === user.email && u.password === currentPassword);
    
    if (userIndex === -1) {
        showCustomAlert('Current password is incorrect.');
        return;
    }
    
    // Update password
    users[userIndex].password = newPassword;
    user.password = newPassword;
    
    storage.setItem('jdmUsers', users);
    storage.setItem('jdmCurrentUser', user);
    
    // Clear form
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
    
    showSuccessAlert('Password updated successfully!');
}

function saveNotifications() {
    const profile = getUserProfile();
    
    // Email notifications
    const emailNotifications = document.querySelectorAll('input[name="emailNotifications"]');
    emailNotifications.forEach(checkbox => {
        profile.notifications.email[checkbox.value] = checkbox.checked;
    });
    
    // Push notifications
    const pushNotifications = document.querySelectorAll('input[name="pushNotifications"]');
    pushNotifications.forEach(checkbox => {
        profile.notifications.push[checkbox.value] = checkbox.checked;
    });
    
    if (saveUserProfile(profile)) {
        showSuccessAlert('Notification settings updated successfully!');
    } else {
        showCustomAlert('Failed to update notification settings.');
    }
}

function exportUserData() {
    const user = getCurrentUser();
    const profile = getUserProfile();
    const purchases = getUserPurchases();
    
    const userData = {
        userInfo: {
            fullName: user.fullName,
            email: user.email,
            accountCreated: user.createdAt
        },
        profile: profile,
        purchaseHistory: purchases,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jdm-classic-data-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showSuccessAlert('Your data has been exported successfully!');
}

function confirmDeleteAccount() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.display = 'flex';
    overlay.style.zIndex = '3000';
    
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.innerHTML = `
        <div class="modal-header">
            <h2>Delete Account</h2>
        </div>
        <div style="text-align: center; padding: 1rem;">
            <p style="color: #ff6b6b; font-weight: bold;">Warning: This action cannot be undone!</p>
            <p>All your data including profile, preferences, and purchase history will be permanently deleted.</p>
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
                <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn-primary" id="confirmDeleteAccountBtn" style="background: #ff3b3b;">Delete Account</button>
            </div>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('confirmDeleteAccountBtn').addEventListener('click', deleteAccount);
}

function deleteAccount() {
    const user = getCurrentUser();
    
    // Remove user from users list
    let users = storage.getItem('jdmUsers') || [];
    users = users.filter(u => u.email !== user.email);
    storage.setItem('jdmUsers', users);
    
    // Remove user profile
    let profiles = storage.getItem('jdmUserProfiles') || {};
    delete profiles[user.email];
    storage.setItem('jdmUserProfiles', profiles);
    
    // Remove user purchases
    let purchases = storage.getItem('jdmPurchases') || {};
    delete purchases[user.email];
    storage.setItem('jdmPurchases', purchases);
    
    // Clear current session
    storage.removeItem('jdmCurrentUser');
    storage.setItem('jdmLoggedIn', 'false');
    
    showSuccessAlert('Your account has been deleted successfully.');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}