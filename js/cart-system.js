// Cart System functionality - UPDATED FOR GITHUB STORAGE
let cart = [];
let cartInitialized = false;

/* ===== AFTERMARKET PARTS DATA ===== */
const aftermarketParts = {
    'Nissan Skyline GT-R R32': [
        { id: 'r32_exhaust', name: 'HKS Hi-Power Exhaust', price: 75000, category: 'Exhaust', image: 'images/parts/hks-exhaust.jpg' },
        { id: 'r32_coilovers', name: 'Tein Flex Z Coilovers', price: 45000, category: 'Suspension', image: 'images/parts/tein-coilovers.jpg' },
        { id: 'r32_wheels', name: 'Rays TE37 Wheels', price: 120000, category: 'Wheels', image: 'images/parts/te37-wheels.jpg' },
        { id: 'r32_ecu', name: 'Mines ECU Tune', price: 35000, category: 'Performance', image: 'images/parts/ecu-tune.jpg' },
        { id: 'r32_brakes', name: 'Brembo Big Brake Kit', price: 90000, category: 'Brakes', image: 'images/parts/brembo-brakes.jpg' }
    ],
    'Mazda RX-7 FD': [
        { id: 'rx7_exhaust', name: 'Apex-i N1 Exhaust', price: 68000, category: 'Exhaust', image: 'images/parts/apexi-exhaust.jpg' },
        { id: 'rx7_bodykit', name: 'RE Amemiya Body Kit', price: 150000, category: 'Exterior', image: 'images/parts/reamemiya-bodykit.jpg' },
        { id: 'rx7_seats', name: 'Bride Low Max Seats', price: 80000, category: 'Interior', image: 'images/parts/bride-seats.jpg' },
        { id: 'rx7_turbo', name: 'Garrett GTX3076 Turbo', price: 110000, category: 'Performance', image: 'images/parts/garrett-turbo.jpg' },
        { id: 'rx7_suspension', name: 'Ohlins Road & Track', price: 95000, category: 'Suspension', image: 'images/parts/ohlins-suspension.jpg' }
    ],
    'Toyota Supra MK4': [
        { id: 'supra_turbo', name: 'Precision 6266 Turbo', price: 125000, category: 'Performance', image: 'images/parts/precision-turbo.jpg' },
        { id: 'supra_exhaust', name: 'Blitz Nur Spec Exhaust', price: 85000, category: 'Exhaust', image: 'images/parts/blitz-exhaust.jpg' },
        { id: 'supra_intercooler', name: 'GReddy FMIC', price: 55000, category: 'Cooling', image: 'images/parts/greddy-intercooler.jpg' },
        { id: 'supra_wheels', name: 'Volk Racing TE37', price: 140000, category: 'Wheels', image: 'images/parts/volk-te37.jpg' },
        { id: 'supra_bodykit', name: 'TRD Body Kit', price: 180000, category: 'Exterior', image: 'images/parts/trd-bodykit.jpg' }
    ],
    'Mitsubishi Lancer Evolution IX': [
        { id: 'evo_exhaust', name: 'HKS Hi-Power Exhaust', price: 60000, category: 'Exhaust', image: 'images/parts/hks-evo-exhaust.jpg' },
        { id: 'evo_intercooler', name: 'ETS Front Mount Intercooler', price: 45000, category: 'Cooling', image: 'images/parts/ets-intercooler.jpg' },
        { id: 'evo_suspension', name: 'KW Variant 3 Coilovers', price: 75000, category: 'Suspension', image: 'images/parts/kw-coilovers.jpg' },
        { id: 'evo_wheels', name: 'Enkei RPF1 Wheels', price: 80000, category: 'Wheels', image: 'images/parts/enkei-rpf1.jpg' },
        { id: 'evo_ecu', name: 'Cobb Accessport Tune', price: 30000, category: 'Performance', image: 'images/parts/cobb-accessport.jpg' }
    ]
};

// Initialize cart system - UPDATED
function initCartSystem() {
    if (cartInitialized) {
        console.log('Cart system already initialized, skipping...');
        return;
    }
    
    console.log('Initializing cart system...');
    cartInitialized = true;

    ensurePartsModalExists();
    
    loadCart();
    updateCartUI();
    
    // Add event listeners to Add to Cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn') || 
            e.target.closest('.add-to-cart-btn')) {
            
            const button = e.target.classList.contains('add-to-cart-btn') ? 
                          e.target : e.target.closest('.add-to-cart-btn');
            
            const car = button.getAttribute('data-car');
            const price = parseInt(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image');
            
            console.log('Adding to cart with parts option:', car, price, image);
            
            // Check if this car has available parts
            if (aftermarketParts[car]) {
                openPartsCustomization(car, price, image);
            } else {
                // If no parts available, add directly to cart
                addToCart(car, price, image);
            }
            
            // Prevent default and stop propagation
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        console.log('Checkout button found, adding listener');
        checkoutBtn.replaceWith(checkoutBtn.cloneNode(true));
        document.getElementById('checkoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Checkout button clicked');
            openCheckoutModal();
        });
    }

    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        console.log('Checkout form found, adding listener');
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Checkout form submitted');
            completePurchase(e);
        });
    }

    // Update navigation user info
    updateNavigationUserInfo();
    
    // Load purchase history
    loadPurchaseHistory();
    
    console.log('Cart system initialized. Cart items:', cart.length);
}

// Update navigation with user info
function updateNavigationUserInfo() {
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting && isLoggedIn()) {
        const user = getCurrentUser();
        userGreeting.textContent = `Hello, ${user.fullName.split(' ')[0]}`;
        userGreeting.style.display = 'block';
    } else if (userGreeting) {
        userGreeting.style.display = 'none';
    }
}

// Add item to cart
function addToCart(car, price, image) {
    console.log('addToCart called with:', car, price, image);
    
    const existingItem = cart.find(item => item.car === car);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Increased quantity for existing item');
    } else {
        const newItem = {
            id: Date.now() + Math.random(),
            car: car,
            price: price,
            image: image,
            quantity: 1
        };
        cart.push(newItem);
        console.log('Added new item to cart:', newItem);
    }
    
    saveCart();
    updateNavigationCartCount();
    updateCartUI();
    showSuccessAlert(`${car} added to cart!`);
}

// Remove item from cart 
function removeFromCart(itemId) {
    console.log('removeFromCart called with ID:', itemId);
    console.log('Cart before removal:', cart);
    
    itemId = Number(itemId);
    
    cart = cart.filter(item => item.id !== itemId);
    
    console.log('Cart after removal:', cart);
    
    saveCart();
    updateNavigationCartCount();
    updateCartUI();
    showSuccessAlert('Item removed from cart!');
}

// Update quantity
function updateQuantity(itemId, change) {
    console.log('updateQuantity called with ID:', itemId, 'change:', change);
    
    itemId = Number(itemId);
    
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        console.log('New quantity for item:', item.quantity);
        
        if (item.quantity < 1) {
            console.log('Quantity below 1, removing item');
            removeFromCart(itemId);
        } else {
            saveCart();
            updateNavigationCartCount();
            updateCartUI();
        }
    } else {
        console.error('Item not found in cart:', itemId);
    }
}

// Update cart UI
function updateCartUI() {
    console.log('updateCartUI called. Cart items:', cart.length);
    
    // Update cart count in navigation
    const cartCounts = document.querySelectorAll('#cartCount');
    cartCounts.forEach(cartCount => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
        console.log('Cart count updated:', totalItems);
    });

    // Only update cart page elements if we're on the cart page
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCart = document.getElementById('emptyCart');
    const cartContainer = document.getElementById('cartContainer');
    const cartItemsList = document.getElementById('cartItemsList');

    if (cartItemsContainer && emptyCart && cartSummary && cartContainer) {
        if (cart.length === 0) {
            console.log('Cart is empty, showing empty state');
            emptyCart.style.display = 'flex';
            cartItemsContainer.style.display = 'none';
            cartSummary.style.display = 'none';
            cartContainer.classList.add('empty-cart-layout');
        } else {
            console.log('Cart has items, showing cart contents');
            emptyCart.style.display = 'none';
            cartItemsContainer.style.display = 'block';
            cartSummary.style.display = 'block';
            cartContainer.classList.remove('empty-cart-layout');
            
            if (cartItemsList) {
                cartItemsList.innerHTML = '';
            } else {
                cartItemsContainer.innerHTML = '<h3>Your Selected Items</h3><div id="cartItemsList"></div>';
            }
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item-page';
                
                let partsInfo = '';
                if (item.isCustomized && item.parts && item.parts.length > 0) {
                    partsInfo = `
                        <div class="cart-item-parts">
                            <strong>Custom Parts:</strong>
                            <ul>
                                ${item.parts.map(part => 
                                    `<li>${part.name} - ₱${part.price.toLocaleString()}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    `;
                }
                
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.car}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.car}</div>
                        <div class="cart-item-price">₱${item.price.toLocaleString()}</div>
                        ${partsInfo}
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <div class="cart-item-total">₱${(item.price * item.quantity).toLocaleString()}</div>
                    <button class="remove-from-cart" onclick="removeFromCart(${item.id})">&times;</button>
                `;
                
                const cartItemsList = document.getElementById('cartItemsList');
                if (cartItemsList) {
                    cartItemsList.appendChild(cartItem);
                } else {
                    cartItemsContainer.appendChild(cartItem);
                }
            });

            updateCartSummary();
        }
    }
}

// Update navigation cart count on ALL pages
function updateNavigationCartCount() {
    const cartCounts = document.querySelectorAll('#cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounts.forEach(cartCount => {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    });
    
    console.log('Navigation cart count updated:', totalItems);
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5000 : 0;
    const total = subtotal + shipping;

    if (document.getElementById('summarySubtotal')) {
        document.getElementById('summarySubtotal').textContent = `₱${subtotal.toLocaleString()}`;
    }
    if (document.getElementById('summaryShipping')) {
        document.getElementById('summaryShipping').textContent = `₱${shipping.toLocaleString()}`;
    }
    if (document.getElementById('summaryTotal')) {
        document.getElementById('summaryTotal').textContent = `₱${total.toLocaleString()}`;
    }
}

// Save cart to storage - UPDATED
function saveCart() {
    try {
        const uniqueCart = [];
        const seenItems = new Set();
        
        cart.forEach(item => {
            const itemKey = `${item.car}-${item.price}`;
            if (!seenItems.has(itemKey)) {
                seenItems.add(itemKey);
                uniqueCart.push(item);
            }
        });
        
        cart = uniqueCart;
        storage.setItem('jdmCart', cart);
        console.log('Cart saved to storage:', cart);
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

// Load cart from storage - UPDATED
function loadCart() {
    try {
        const savedCart = storage.getItem('jdmCart');
        if (savedCart) {
            const uniqueCart = [];
            const seenItems = new Set();
            
            savedCart.forEach(item => {
                const itemKey = `${item.car}-${item.price}`;
                if (!seenItems.has(itemKey)) {
                    seenItems.add(itemKey);
                    uniqueCart.push(item);
                }
            });
            
            cart = uniqueCart;
            console.log('Cart loaded from storage:', cart);
        } else {
            cart = [];
            console.log('No cart found in storage, initializing empty cart');
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
}

// [Rest of cart-system.js remains the same, only storage calls updated...]

// Complete purchase - UPDATED
function completePurchase(e) {
    if (e) e.preventDefault();
    
    console.log('completePurchase called');
    
    if (!isLoggedIn()) {
        showCustomAlert('Please log in to complete your purchase.');
        closeCheckoutModal();
        return false;
    }
    
    if (cart.length === 0) {
        showCustomAlert('Your cart is empty!');
        return false;
    }
    
    // Validate form
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zipCode = document.getElementById('zipCode').value;
    
    if (!fullName || !email || !phone || !address || !city || !zipCode) {
        showCustomAlert('Please fill out all required shipping information.');
        return false;
    }
    
    const user = getCurrentUser();
    const purchases = storage.getItem('jdmPurchases') || {};
    
    if (!purchases[user.email]) {
        purchases[user.email] = [];
    }
    
    // Create purchase records for each cart item
    cart.forEach(item => {
        const purchase = {
            id: Date.now() + Math.random(),
            car: item.car,
            basePrice: item.basePrice || item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            date: new Date().toISOString(),
            parts: item.parts || [],
            shippingInfo: {
                name: fullName,
                email: email,
                phone: phone,
                address: address,
                city: city,
                zipCode: zipCode
            },
            paymentMethod: document.querySelector('input[name="payment"]:checked')?.value || 'credit_card'
        };
        purchases[user.email].push(purchase);
    });
    
    storage.setItem('jdmPurchases', purchases);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    
    showSuccessAlert('Purchase completed successfully! You will receive a confirmation email shortly.');
    closeCheckoutModal();
    
    // Reload purchase history if we're on a page that shows it
    loadPurchaseHistory();
    
    // Redirect to member page
    setTimeout(() => {
        window.location.href = 'member.html';
    }, 2000);
    
    return false;
}
// Open checkout modal - UPDATED
function openCheckoutModal() {
    console.log('openCheckoutModal called');
    
    const modal = document.getElementById('checkoutModal');
    if (!modal) {
        console.error('Checkout modal not found!');
        showCustomAlert('Checkout system error. Please refresh the page.');
        return;
    }
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        showCustomAlert('Please log in to checkout.');
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'flex';
            document.body.classList.add('modal-active');
        }
        return;
    }
    
    // Check if cart has items
    if (cart.length === 0) {
        showCustomAlert('Your cart is empty!');
        return;
    }
    
    console.log('Opening checkout modal');
    
    // Update checkout summary
    updateCheckoutSummary();
    
    // Pre-fill user info if logged in
    if (isLoggedIn()) {
        const user = getCurrentUser();
        if (document.getElementById('fullName')) {
            document.getElementById('fullName').value = user.fullName || '';
        }
        if (document.getElementById('email')) {
            document.getElementById('email').value = user.email || '';
        }
        
        const profile = getUserProfile();
        if (profile.personalInfo.phone && document.getElementById('phone')) {
            document.getElementById('phone').value = profile.personalInfo.phone;
        }
        if (profile.personalInfo.address && document.getElementById('address')) {
            document.getElementById('address').value = profile.personalInfo.address;
        }
    }
    
    // SHOW MODAL WITHOUT BLUR
    modal.style.display = 'flex';
    modal.style.backdropFilter = 'none';
    modal.style.webkitBackdropFilter = 'none';
    modal.style.filter = 'none';
    
    // Remove blur from modal content
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.filter = 'none';
        modalContent.style.backdropFilter = 'none';
    }
    
    console.log('Checkout modal should be visible now - NO BLUR');
}

// Update checkout summary
function updateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!checkoutItems || !checkoutTotal) return;
    
    checkoutItems.innerHTML = '';
    let grandTotal = 0;
    const shipping = 5000;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <div class="checkout-item-details">
                <img src="${item.image}" alt="${item.car}" class="checkout-item-image">
                <div>
                    <div class="checkout-item-name">${item.car}</div>
                    <div class="checkout-item-quantity">Quantity: ${item.quantity}</div>
                </div>
            </div>
            <div class="checkout-item-total">₱${itemTotal.toLocaleString()}</div>
        `;
        checkoutItems.appendChild(itemElement);
    });
    
    // Add shipping
    const shippingElement = document.createElement('div');
    shippingElement.className = 'checkout-item';
    shippingElement.innerHTML = `
        <div class="checkout-item-details">
            <div class="checkout-item-name">Shipping</div>
        </div>
        <div class="checkout-item-total">₱${shipping.toLocaleString()}</div>
    `;
    checkoutItems.appendChild(shippingElement);
    
    grandTotal += shipping;
    checkoutTotal.textContent = `₱${grandTotal.toLocaleString()}`;
}

// Close checkout modal
function closeCheckoutModal() {
    console.log('closeCheckoutModal called');
    
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-active');
        console.log('Checkout modal closed');
    }
}

// Clear entire cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
    showSuccessAlert('Cart cleared successfully!');
}

// Get cart total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Get cart items (for external use)
function getCartItems() {
    return [...cart]; // Return a copy to prevent direct modification
}

// Check if cart is empty
function isCartEmpty() {
    return cart.length === 0;
}

// Get cart item by ID
function getCartItemById(itemId) {
    return cart.find(item => item.id === itemId);
}

// Update cart item
function updateCartItem(itemId, updates) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cart[itemIndex] = { ...cart[itemIndex], ...updates };
        saveCart();
        updateCartUI();
        return true;
    }
    return false;
}

// Calculate cart total with shipping
function calculateCartTotal() {
    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 5000 : 0;
    return {
        subtotal: subtotal,
        shipping: shipping,
        total: subtotal + shipping
    };
}

// Export cart data (for debugging or external use)
function exportCartData() {
    return {
        items: cart,
        summary: calculateCartTotal(),
        timestamp: new Date().toISOString()
    };
}

// Import cart data (for debugging or external use)
function importCartData(cartData) {
    if (cartData && cartData.items) {
        cart = cartData.items;
        saveCart();
        updateCartUI();
        return true;
    }
    return false;
}

// Reset cart (for testing)
function resetCart() {
    cart = [];
    saveCart();
    updateCartUI();
    console.log('Cart reset');
}

// Function to open parts customization modal - FIXED
function openPartsCustomization(carName, carPrice, carImage) {
    console.log('Opening parts customization for:', carName);
    
    const modal = document.getElementById('partsCustomizationModal');
    if (!modal) {
        console.error('Parts customization modal not found!');
        return;
    }
    
    // Set car details
    document.getElementById('customizationCarName').textContent = carName;
    document.getElementById('customizationBasePrice').textContent = `₱${carPrice.toLocaleString()}`;
    document.getElementById('customizationCarImage').src = carImage;
    document.getElementById('customizationCarImage').alt = carName;
    
    // Store current car being customized
    modal.setAttribute('data-car', carName);
    modal.setAttribute('data-price', carPrice);
    modal.setAttribute('data-image', carImage);
    
    // Load parts for this car
    loadPartsForCar(carName);
    
    // Show modal
    modal.style.display = 'flex';
    document.body.classList.add('modal-active');
    
    // Force scroll to top
    setTimeout(() => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }, 100);
}

// Helper function to ensure modal scrolling works
function ensureModalScroll() {
    const partsModal = document.getElementById('partsCustomizationModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    [partsModal, checkoutModal].forEach(modal => {
        if (modal) {
            const content = modal.querySelector('.modal-content');
            if (content) {
                // Ensure scrolling is enabled
                content.style.overflowY = 'auto';
                content.style.maxHeight = '85vh';
            }
        }
    });
}

// Call this on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(ensureModalScroll, 500);
});

// Create parts customization modal if it doesn't exist
function createPartsCustomizationModal() {
    if (document.getElementById('partsCustomizationModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'partsCustomizationModal';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h2>Customize Your JDM Classic</h2>
                <button class="close-modal" onclick="closePartsCustomization()">&times;</button>
            </div>
            
            <div class="customization-container">
                <div class="customization-left">
                    <div class="car-preview">
                        <img id="customizationCarImage" src="" alt="" class="car-image-large">
                        <h3 id="customizationCarName">Car Name</h3>
                        <div class="base-price">Base Price: <span id="customizationBasePrice">₱0</span></div>
                    </div>
                </div>
                
                <div class="customization-right">
                    <h3>Available Aftermarket Parts</h3>
                    <div class="parts-categories" id="partsCategories">
                        <!-- Categories will be populated here -->
                    </div>
                    <div class="parts-grid-customization" id="partsGridCustomization">
                        <!-- Parts will be populated here -->
                    </div>
                    
                    <div class="selected-parts-summary">
                        <h4>Selected Parts</h4>
                        <div class="selected-parts-list" id="selectedPartsList">
                            <!-- Selected parts will be listed here -->
                        </div>
                        <div class="customization-total">
                            <div class="summary-item">
                                <span>Base Vehicle:</span>
                                <span id="summaryBasePriceCustom">₱0</span>
                            </div>
                            <div class="summary-item">
                                <span>Parts Total:</span>
                                <span id="summaryPartsTotal">₱0</span>
                            </div>
                            <div class="summary-total">
                                <span>Grand Total:</span>
                                <span id="summaryGrandTotal">₱0</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="customization-actions">
                        <button type="button" class="btn-secondary" onclick="closePartsCustomization()">Cancel</button>
                        <button type="button" class="btn-primary" onclick="addCustomizedToCart()">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Ensure the parts customization modal exists
function ensurePartsModalExists() {
    createPartsCustomizationModal();
}

// Load parts for specific car - FIXED WITH INLINE STYLES
function loadPartsForCar(carName) {
    const partsGrid = document.getElementById('partsGridCustomization');
    const categoriesContainer = document.getElementById('partsCategories');
    const selectedPartsList = document.getElementById('selectedPartsList');
    
    if (!partsGrid || !categoriesContainer) return;
    
    // Clear previous content
    partsGrid.innerHTML = '';
    selectedPartsList.innerHTML = '';
    categoriesContainer.innerHTML = '';
    
    const parts = aftermarketParts[carName] || [];
    
    // Get unique categories
    const categories = [...new Set(parts.map(part => part.category))];
    
    // Create category filter buttons
    categoriesContainer.innerHTML = `
        <button class="category-btn active" data-category="all">All Parts</button>
        ${categories.map(category => 
            `<button class="category-btn" data-category="${category}">${category}</button>`
        ).join('')}
    `;
    
    // Add event listeners to category filters
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active state
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter parts
            const allParts = document.querySelectorAll('.part-card-customization');
            allParts.forEach(part => {
                if (category === 'all' || part.getAttribute('data-category') === category) {
                    part.style.display = 'block';
                } else {
                    part.style.display = 'none';
                }
            });
        });
    });
    
    // Create part cards with INLINE STYLES - FIXED
    parts.forEach(part => {
        const partCard = document.createElement('div');
        partCard.className = 'part-card-customization';
        partCard.setAttribute('data-category', part.category);
        partCard.setAttribute('data-part-id', part.id);
        
        // Add inline styles for consistent sizing
        partCard.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            height: 320px;
            width: 220px;
        `;
        
        partCard.innerHTML = `
            <div class="part-image" style="width: 100%; height: 150px; margin-bottom: 10px; border-radius: 4px; overflow: hidden; background: #f5f5f5; display: flex; align-items: center; justify-content: center;">
                <img src="${part.image}" alt="${part.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='images/parts/placeholder.jpg'">
            </div>
            <div class="part-info" style="flex: 1; margin-bottom: 10px; display: flex; flex-direction: column;">
                <h4 class="part-name" style="font-size: 1em; font-weight: bold; margin: 0 0 5px 0; color: #333; line-height: 1.2;">${part.name}</h4>
                <p class="part-category" style="font-size: 0.8em; color: #666; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 0.5px;">${part.category}</p>
                <p class="part-price" style="font-size: 1em; font-weight: bold; color: #28a745; margin: 0; margin-top: auto;">₱${part.price.toLocaleString()}</p>
            </div>
            <button class="part-select-btn" data-part-id="${part.id}" style="background: #007bff; color: white; border: none; padding: 10px 16px; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 10px; height: 40px; transition: background 0.3s ease;">
                Select
            </button>
        `;

        partsGrid.appendChild(partCard);
    });
    
    // Add grid layout to parts grid
    partsGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 20px;
        max-height: 500px;
        overflow-y: auto;
        padding: 10px;
    `;
    
    // Add event listeners to ALL part select buttons - FIXED
    setTimeout(() => {
        document.querySelectorAll('.part-select-btn').forEach(button => {
            // Remove any existing listeners first
            button.replaceWith(button.cloneNode(true));
        });
        
        // Add fresh event listeners
        document.querySelectorAll('.part-select-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const partId = this.getAttribute('data-part-id');
                console.log('Part button clicked:', partId);
                togglePartSelection(partId);
            });
        });
    }, 100);
    
    // Reset totals
    updateCustomizationTotals();
}

// Toggle part selection - FIXED WITH INLINE STYLES FOR SELECTED PARTS
function togglePartSelection(partId) {
    console.log('togglePartSelection called with:', partId);
    
    const modal = document.getElementById('partsCustomizationModal');
    if (!modal) {
        console.error('Parts customization modal not found');
        return;
    }
    
    const carName = modal.getAttribute('data-car');
    const parts = aftermarketParts[carName] || [];
    const part = parts.find(p => p.id === partId);
    
    if (!part) {
        console.error('Part not found:', partId);
        return;
    }
    
    const selectedPartsList = document.getElementById('selectedPartsList');
    const partButton = document.querySelector(`.part-select-btn[data-part-id="${partId}"]`);
    const partCard = partButton ? partButton.closest('.part-card-customization') : null;
    
    if (!partButton || !partCard) {
        console.error('Part button or card not found for part:', partId);
        return;
    }
    
    // Check if part is already selected
    const existingPart = selectedPartsList.querySelector(`[data-part-id="${partId}"]`);
    
    if (existingPart) {
        // Remove part with animation
        existingPart.style.transform = 'translateX(100%)';
        existingPart.style.opacity = '0';
        
        setTimeout(() => {
            existingPart.remove();
            partButton.classList.remove('selected');
            partCard.classList.remove('selected');
            
            // Update button text and style
            partButton.textContent = 'Select';
            partButton.style.background = '#007bff';
            
            // Add subtle deselection animation
            partCard.style.transform = 'scale(0.98)';
            setTimeout(() => {
                partCard.style.transform = '';
            }, 150);
            
            // UPDATE TOTALS AFTER REMOVAL
            updateCustomizationTotals();
        }, 300);
        
    } else {
        // Add part with animation
        const partElement = document.createElement('div');
        partElement.className = 'selected-part-item';
        partElement.setAttribute('data-part-id', partId);
        partElement.style.cssText = `
            display: flex;
            align-items: center;
            padding: 10px 12px;
            background: #f8f9fa;
            border-radius: 4px;
            margin: 5px 0;
            transition: all 0.3s ease;
            min-height: 50px;
            transform: translateX(-100%);
            opacity: 0;
        `;
        
        partElement.innerHTML = `
            <img src="${part.image}" alt="${part.name}" style="width: 40px; height: 40px; border-radius: 4px; margin-right: 10px; object-fit: cover;" onerror="this.src='images/parts/placeholder.jpg'">
            <span class="selected-part-name" style="flex: 1; font-weight: 500; margin: 0 10px;">${part.name}</span>
            <span class="selected-part-price" style="color: #28a745; font-weight: 500; margin-right: 10px;">₱${part.price.toLocaleString()}</span>
            <button class="remove-part-btn" data-part-id="${partId}" style="background: #dc3545; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px;">&times;</button>
        `;
        selectedPartsList.appendChild(partElement);
        
        // Add event listener to remove button
        const removeBtn = partElement.querySelector('.remove-part-btn');
        removeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            togglePartSelection(partId);
        });
        
        // Animate the new item in
        setTimeout(() => {
            partElement.style.transform = 'translateX(0)';
            partElement.style.opacity = '1';
        }, 10);
        
        partButton.classList.add('selected');
        partCard.classList.add('selected');
        
        // Update button text and style
        partButton.textContent = 'Selected';
        partButton.style.background = '#28a745';
        
        // Add selection animation
        partCard.style.transform = 'scale(1.02)';
        setTimeout(() => {
            partCard.style.transform = '';
        }, 200);
        
        // UPDATE TOTALS AFTER ADDITION
        updateCustomizationTotals();
    }
}

// Update customization totals
function updateCustomizationTotals() {
    const modal = document.getElementById('partsCustomizationModal');
    const basePrice = parseInt(modal.getAttribute('data-price'));
    const selectedPartsList = document.getElementById('selectedPartsList');
    const carName = modal.getAttribute('data-car');
    const parts = aftermarketParts[carName] || [];
    
    let partsTotal = 0;
    const selectedPartElements = selectedPartsList.querySelectorAll('.selected-part-item');
    
    selectedPartElements.forEach(element => {
        const partId = element.getAttribute('data-part-id');
        const part = parts.find(p => p.id === partId);
        if (part) {
            partsTotal += part.price;
        }
    });
    
    const grandTotal = basePrice + partsTotal;
    
    document.getElementById('summaryBasePriceCustom').textContent = `₱${basePrice.toLocaleString()}`;
    document.getElementById('summaryPartsTotal').textContent = `₱${partsTotal.toLocaleString()}`;
    document.getElementById('summaryGrandTotal').textContent = `₱${grandTotal.toLocaleString()}`;
}

// Add customized car to cart
function addCustomizedToCart() {
    const modal = document.getElementById('partsCustomizationModal');
    const carName = modal.getAttribute('data-car');
    const basePrice = parseInt(modal.getAttribute('data-price'));
    const carImage = modal.getAttribute('data-image');
    const selectedPartsList = document.getElementById('selectedPartsList');
    const parts = aftermarketParts[carName] || [];
    
    // Get selected parts
    const selectedParts = [];
    const selectedPartElements = selectedPartsList.querySelectorAll('.selected-part-item');
    
    selectedPartElements.forEach(element => {
        const partId = element.getAttribute('data-part-id');
        const part = parts.find(p => p.id === partId);
        if (part) {
            selectedParts.push(part);
        }
    });
    
    // Calculate total price
    const partsTotal = selectedParts.reduce((sum, part) => sum + part.price, 0);
    const totalPrice = basePrice + partsTotal;
    
    // Create cart item with parts information
    const cartItem = {
        id: Date.now() + Math.random(),
        car: carName,
        price: totalPrice,
        image: carImage,
        quantity: 1,
        basePrice: basePrice,
        parts: selectedParts,
        partsTotal: partsTotal,
        isCustomized: true
    };
    
    // Add to cart
    cart.push(cartItem);
    saveCart();
    updateNavigationCartCount();
    updateCartUI();
    
    showSuccessAlert(`Customized ${carName} added to cart!`);
    closePartsCustomization();
}

// Close parts customization modal
function closePartsCustomization() {
    const modal = document.getElementById('partsCustomizationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-active');
    }
}

// Load and display purchase history - UPDATED
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
    const purchases = storage.getItem('jdmPurchases') || {};
    const userPurchases = purchases[user.email] || [];
    
    console.log('Found purchases for user:', userPurchases.length);
    
    if (userPurchases.length === 0) {
        historyContainer.innerHTML = `
            <div class="no-history">
                <i class="fas fa-history"></i>
                <h3>No Purchase History</h3>
                <p>You haven't made any purchases yet.</p>
                <p>Start shopping to see your history here!</p>
            </div>
        `;
    } else {
        // Sort purchases by date (newest first)
        userPurchases.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        historyContainer.innerHTML = `
            <div class="history-container">
                ${userPurchases.map(purchase => `
                    <div class="history-item">
                        <div class="history-item-header">
                            <div class="history-car-name">${purchase.car}</div>
                            <div class="history-date">${formatDate(purchase.date)}</div>
                        </div>
                        <div class="history-details">
                            <div>Quantity: ${purchase.quantity}</div>
                            <div>Base Price: ₱${purchase.basePrice.toLocaleString()}</div>
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
                                <small>Shipped to: ${purchase.shippingInfo.address}, ${purchase.shippingInfo.city}</small>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Show the history section
    historySection.style.display = 'block';
    console.log('Purchase history loaded and displayed');
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize when page loads - FIXED
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing cart system...');
    
    // Small delay to ensure all other scripts are loaded
    setTimeout(() => {
        initCartSystem();
        
        // Update global navigation
        if (typeof updateGlobalNavigation === 'function') {
            updateGlobalNavigation();
        }
    }, 100);
});

// Also add click outside to close
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeCheckoutModal();
            
            // Also close login modal if needed
            const loginModal = document.getElementById('loginModal');
            if (loginModal && loginModal.style.display === 'flex') {
                loginModal.style.display = 'none';
                document.body.classList.remove('modal-active');
            }
        }
    });
    
    // ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCheckoutModal();
            
            const loginModal = document.getElementById('loginModal');
            if (loginModal && loginModal.style.display === 'flex') {
                loginModal.style.display = 'none';
                document.body.classList.remove('modal-active');
            }
        }
    });
});

// Debug function to test checkout
function debugCheckout() {
    console.log('=== CHECKOUT DEBUG ===');
    console.log('Cart items:', cart.length);
    console.log('Checkout modal exists:', !!document.getElementById('checkoutModal'));
    console.log('Proceed button exists:', !!document.getElementById('checkoutBtn'));
    console.log('User logged in:', isLoggedIn());
    console.log('Cart initialized:', cartInitialized);
    console.log('=====================');
}

// Call debug on load for troubleshooting
setTimeout(debugCheckout, 500);

// Make functions globally available
window.openPartsCustomization = openPartsCustomization;
window.closePartsCustomization = closePartsCustomization;
window.togglePartSelection = togglePartSelection;
window.addCustomizedToCart = addCustomizedToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.completePurchase = completePurchase;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
window.getCartItemCount = getCartItemCount;
window.getCartItems = getCartItems;
window.isCartEmpty = isCartEmpty;
window.getCartItemById = getCartItemById;
window.updateCartItem = updateCartItem;
window.calculateCartTotal = calculateCartTotal;
window.exportCartData = exportCartData;
window.importCartData = importCartData;
window.resetCart = resetCart;
window.loadPurchaseHistory = loadPurchaseHistory;
window.formatDate = formatDate;