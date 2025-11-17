// Member dashboard functionality - JSON STORAGE VERSION
document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const recentPurchasesSection = document.getElementById('recentPurchases');
    const recentPurchasesContainer = document.getElementById('recentPurchasesContainer');

    const currentUser = getCurrentUser();
    const isLoggedIn = storage.getItem('jdmLoggedIn') === 'true';

    // Check authentication
    if (!isLoggedIn || !currentUser) {
        setTimeout(() => {
            if (loginModal) {
                loginModal.style.display = 'flex';
                document.body.classList.add('modal-active');
            }
        }, 1000);
    } else {
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${currentUser.fullName}!`;
        }
        if (loginModal) {
            loginModal.style.display = 'none';
            document.body.classList.remove('modal-active');
        }
        
        displayRecentPurchases();
    }

    if (typeof updateAuthNavigation === 'function') {
        updateAuthNavigation();
    }

    // Login form handler
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
                if (welcomeMessage) {
                    welcomeMessage.textContent = `Welcome back, ${user.fullName}!`;
                }
                showSuccessAlert('Login successful! Welcome to your member dashboard.');
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                showCustomAlert('Invalid email or password! Please try again or sign up.');
            }
        });
    }

    function displayRecentPurchases() {
        const purchases = getUserPurchases();
        
        if (purchases.length === 0) {
            if (recentPurchasesSection) recentPurchasesSection.style.display = 'none';
            return;
        }
        
        if (recentPurchasesSection) recentPurchasesSection.style.display = 'block';
        
        const recentPurchases = purchases
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        
        if (recentPurchasesContainer) {
            recentPurchasesContainer.innerHTML = '';
            
            recentPurchases.forEach(purchase => {
                const purchaseItem = document.createElement('div');
                purchaseItem.className = 'history-item';
                purchaseItem.style.cursor = 'pointer';
                purchaseItem.onclick = () => window.location.href = 'purchase.html#purchaseHistory';
                
                const date = new Date(purchase.date).toLocaleDateString();
                
                purchaseItem.innerHTML = `
                    <div class="history-header">
                        <h3>${purchase.car}</h3>
                        <span class="history-date">${date}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <p><strong>Total: ₱${purchase.total.toLocaleString()}</strong></p>
                            <p>Quantity: ${purchase.quantity || 1}</p>
                        </div>
                        <span style="color: var(--accent);">→</span>
                    </div>
                `;
                
                recentPurchasesContainer.appendChild(purchaseItem);
            });
            
            if (purchases.length > 3) {
                const viewAllBtn = document.createElement('div');
                viewAllBtn.style.textAlign = 'center';
                viewAllBtn.style.marginTop = '1rem';
                viewAllBtn.innerHTML = `
                    <a href="purchase.html#purchaseHistory" class="btn-secondary">View All Purchases</a>
                `;
                recentPurchasesContainer.appendChild(viewAllBtn);
            }
        }
    }
});