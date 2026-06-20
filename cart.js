document.addEventListener("DOMContentLoaded", function() {
    
    // Get DOM elements
    const cartContainer = document.getElementById("cartContainer");
    const cartTotal = document.getElementById("cartTotal");
    const cartCountItems = document.getElementById("cartCountItems");
    const cartCount = document.getElementById("cart-count");
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        if (cartCountItems) {
            cartCountItems.textContent = totalItems;
        }
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    };
    
    // save cart to localStorage
    const saveCart = () => {
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    };
    
    // Function to render cart items
    const renderCart = () => {
        if (!cartContainer) return;
        
        cartContainer.innerHTML = "";
        let total = 0;
        
        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <p>Your cart is empty</p>
                    <a href="shop.html" class="shop-now-btn">Shop Now</a>
                </div>
            `;
            if (cartTotal) cartTotal.textContent = "";
            return;
        }
        
        cart.forEach((item, index) => {
            const itemPrice = item.price || 0;
            const itemQuantity = item.quantity || 1;
            const itemTotal = itemPrice * itemQuantity;
            total += itemTotal;
            
            const div = document.createElement("div");
            div.classList.add("cart-item");
            
            // Get image source safely
            const imageSrc = item.image || (item.images && item.images[0]);
            
            div.innerHTML = `
                <div class="cart-item-image">
                    <img src="${imageSrc}" alt="${item.name || 'Product'}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name || 'Product'}</h4>
                    <p class="item-price">1 item $${itemPrice.toFixed(2)} each</p>
                    <div class="item-attributes">
                        ${item.color ? `<span class="item-color">Color: ${item.color}</span>` : ''}
                        ${item.size ? `<span class="item-size">Size: ${item.size}</span>` : ''}
                    </div>
                    <div class="quantity-controls">
                        <label>Quantity:</label>
                        <button class="decrease-btn" data-index="${index}">-</button>
                        <span class="quantity-value">${itemQuantity}</span>
                        <button class="increase-btn" data-index="${index}">+</button>
                    </div>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
                <div class="cart-item-total">
                    <p>subTotal: $${itemTotal.toFixed(2)}</p>
                </div>
            `;
            
            cartContainer.appendChild(div);
        });
        
        if (cartTotal) {
            cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        }
        
        attachButtonEventListeners();
    };
    
    const attachButtonEventListeners = () => {
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.removeEventListener('click', handleIncrease);
            btn.addEventListener('click', handleIncrease);
        });
        
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.removeEventListener('click', handleDecrease);
            btn.addEventListener('click', handleDecrease);
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.removeEventListener('click', handleRemove);
            btn.addEventListener('click', handleRemove);
        });
    };
    
    const handleIncrease = (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (!isNaN(index) && cart[index]) {
            cart[index].quantity = (cart[index].quantity || 1) + 1;
            saveCart();
            renderCart();
        }
    };
    
    const handleDecrease = (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (!isNaN(index) && cart[index]) {
            const currentQty = cart[index].quantity || 1;
            if (currentQty > 1) {
                cart[index].quantity = currentQty - 1;
                saveCart();
                renderCart();
            }
        }
    };
    
    const handleRemove = (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (!isNaN(index) && cart[index]) {
            cart.splice(index, 1);
            saveCart();
            renderCart();
        }
    };
    
    const setupCheckoutButton = () => {
        const checkoutBtn = document.querySelector('.checkout-btn:last-child');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    alert('Your cart is empty. Please add items before checkout.');
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }
        
        const continueShoppingBtn = document.querySelector('.checkout-btn:first-child a');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'shop.html';
            });
        }
    };
    
    if (cartContainer) {
        renderCart();
        updateCartCount();
        setupCheckoutButton();
    }
});