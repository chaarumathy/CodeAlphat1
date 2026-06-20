// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {
    
    const productDetail = document.getElementById("productDetail");
    
    const updateCartCount = () => {
        const cartCountItems = document.getElementById("cartCountItems");
        if (cartCountItems) {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            cartCountItems.textContent = cart.length;
        }
    };
    
    updateCartCount();

    if (!productDetail) return;

    // Get slug from URL
    const getQueryParam = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };
    
    const slug = getQueryParam("slug");
    
    if (typeof products === 'undefined') {
        productDetail.innerHTML = '<p style="text-align:center; padding:50px;">Products data not loaded. Please try again later.</p>';
        return;
    }
    
    const product = products.find((p) => p.slug === slug);
    
    const generateStarRating = (rating) => {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < Math.floor(rating)) {
                stars += '<i class="fa-solid fa-star" style="color: #fbbf24;"></i>';
            } else if (i < rating) {
                stars += '<i class="fa-solid fa-star-half-alt" style="color: #fbbf24;"></i>';
            } else {
                stars += '<i class="fa-regular fa-star" style="color: #fbbf24;"></i>';
            }
        }
        return stars;
    };
    
    // Create thumbnails HTML
    const createThumbnails = (images) => {
        if (!images || images.length === 0) return '';
        return images.map((img, i) => 
            `<img src="${img}" class="thumbnail-img ${i === 0 ? 'active' : ''}" data-index="${i}" alt="Product thumbnail ${i+1}">`
        ).join('');
    };
    
    // Add to cart func
    const addToCartFunction = (productItem, color, size, quantity) => {
        // Get existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const finalPrice = productItem.discount ? 
            productItem.price * (1 - productItem.discount / 100) : 
            productItem.price;
        
        const cartItem = {
            id: productItem.id,
            name: productItem.name,
            price: finalPrice,
            originalPrice: productItem.price,
            discount: productItem.discount || 0,
            quantity: quantity,
            color: color,
            size: size,
            image: productItem.images && productItem.images[0] ? productItem.images[0] : null,
            slug: productItem.slug,
            addedAt: new Date().toISOString()
        };
        
        // Check if item already exists in cart (same id, color, size)
        const existingItemIndex = cart.findIndex(item => 
            item.id === cartItem.id && 
            item.size === cartItem.size && 
            item.color === cartItem.color
        );
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push(cartItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCartCount();
        
        return cart;
    };
    
    // Render product details
    const renderProductDetail = (product) => {
        if (!product) {
            productDetail.innerHTML = '<p style="text-align:center; padding:50px;">Product not found.</p>';
            return;
        }
        
        const colorsHTML = product.colors && product.colors.length > 0 
            ? product.colors.map((color, i) => `
                <div class="color-dot ${i === 0 ? 'selected' : ''}" style="background: ${color};" data-color="${color}"></div>
            `).join('')
            : '<p class="no-option">No color options available</p>';
        
        const sizesHTML = product.sizes && product.sizes.length > 0
            ? product.sizes.map((size, i) => `
                <span class="size-option ${i === 0 ? 'selected' : ''}" data-size="${size}">${size}</span>
            `).join('')
            : '<p class="no-option">No size options available</p>';
        
        const hasDiscount = product.discount && product.discount > 0;
        const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
        const originalPrice = product.listPrice || product.price;
        
        productDetail.innerHTML = `
            <div class="product-detail-container">
                <div class="image-gallery">
                    <div class="main-image">
                        <img id="mainImage" src="${product.images[0]}" alt="${product.name || 'Product'}">
                    </div>
                    <div class="thumbnails">
                        ${createThumbnails(product.images)}
                    </div>
                </div>
                
                <div class="product-info-section">
                    <span class="brand">${product.brand || 'NatiMart'}</span>
                    <h1 class="product-title">${product.name || 'Product Name'}</h1>
                    
                    <div class="rating">
                        <div class="stars">${generateStarRating(product.avgRating || 0)}</div>
                        <span class="rating-count">(${product.numReviews || 0} reviews)</span>
                    </div>
                    
                    <div class="price-section">
                        ${hasDiscount ? `
                            <span class="original-price">$${originalPrice.toFixed(2)}</span>
                            <span class="discounted-price">$${discountedPrice.toFixed(2)}</span>
                            <span class="discount-badge-large">-${product.discount}%</span>
                        ` : `
                            <span class="current-price">$${product.price.toFixed(2)}</span>
                        `}
                    </div>
                    
                    <div class="description-section">
                        <h3>Product Description</h3>
                        <p>${product.description || 'No description available for this product.'}</p>
                    </div>
                    
                    <div class="color-section">
                        <h3>Color: <span id="selectedColor">${product.colors && product.colors[0] ? product.colors[0].charAt(0).toUpperCase() + product.colors[0].slice(1) : 'N/A'}</span></h3>
                        <div class="color-selector" id="colorSelector">
                            ${colorsHTML}
                        </div>
                    </div>
                    
                    <div class="size-section">
                        <h3>Size: <span id="selectedSize">${product.sizes && product.sizes[0] ? product.sizes[0] : 'N/A'}</span></h3>
                        <div class="size-selector" id="sizeSelector">
                            ${sizesHTML}
                        </div>
                    </div>
                    
                    <div class="quantity-section">
                        <h3>Quantity:</h3>
                        <div class="quantity-selector">
                            <button class="qty-btn" id="decreaseQty">-</button>
                            <input type="number" id="quantity" value="1" min="1" max="${product.countInStock || 99}">
                            <button class="qty-btn" id="increaseQty">+</button>
                        </div>
                        <span class="stock-status">${(product.countInStock || 0) > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}</span>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="add-to-cart-btn" id="addToCartBtn" ${(product.countInStock || 0) === 0 ? 'disabled' : ''}>
                            <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                        </button>
                        <button class="buy-now-btn" id="buyNowBtn" ${(product.countInStock || 0) === 0 ? 'disabled' : ''}>
                            Buy Now
                        </button>
                    </div>
                    
                    <div class="product-meta">
                        <div class="meta-item">
                            <i class="fa-solid fa-truck"></i>
                            <span>Free shipping on orders over $100</span>
                        </div>
                        <div class="meta-item">
                            <i class="fa-solid fa-rotate-left"></i>
                            <span>10-day easy returns Policy</span>
                        </div>
                        <div class="meta-item">
                            <i class="fa-solid fa-shield"></i>
                            <span>Secure checkout with encryption</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="related-products-section">
                <h2>Related Products</h2>
                <div class="carousel-container">
                    <div class="products-carousel" id="relatedCarousel"></div>
                    <div class="carousel-nav left" onclick="scrollRelatedCarousel(-200)">
                        <i class="fas fa-chevron-left"></i>
                    </div>
                    <div class="carousel-nav right" onclick="scrollRelatedCarousel(200)">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
            </div>
        `;
        
        attachEventListeners();
        
        // Render related products
        renderRelatedProducts();
    };
    
    const renderRelatedProducts = () => {
        const relatedCarousel = document.getElementById("relatedCarousel");
        if (!relatedCarousel) return;
        
        // Filter related products (same category, exclude current product)
        const relatedProducts = products.filter((p) => 
            p.category === product.category && 
            p.slug !== product.slug &&
            p.isPublished !== false
        );
        
        if (relatedProducts.length === 0) {
            relatedCarousel.innerHTML = '<p style="text-align:center; padding:20px;">No related products found.</p>';
            return;
        }
        
        relatedCarousel.innerHTML = "";
        
        relatedProducts.forEach((relatedProduct) => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.style.cursor = "pointer";
            
            let stars = "";
            for (let i = 0; i < 5; i++) {
                if (i < (relatedProduct.avgRating || 0)) {
                    stars += '<i class="fas fa-star" style="color: #fbbf24;"></i>';
                } else {
                    stars += '<i class="far fa-star" style="color: #fbbf24;"></i>';
                }
            }
            
            card.innerHTML = `
                ${relatedProduct.discount ? `<div class="discount-badge">${relatedProduct.discount}% off</div>` : ""}
                <div class="product-image-container">
                    <img src="${relatedProduct.images && relatedProduct.images[0] ? relatedProduct.images[0] : 'https://via.placeholder.com/300'}" 
                         alt="${relatedProduct.name}" 
                         class="product-image">
                </div>
                <h3 class="product-title">${relatedProduct.name ? relatedProduct.name.slice(0, 30) : 'Product'}...</h3>
                <div class="product-rating">${stars}</div>
                <div class="product-price">$${(relatedProduct.price || 0).toFixed(2)}</div>
            `;
            
            card.addEventListener("click", () => {
                window.location.href = `product.html?slug=${relatedProduct.slug}`;
            });
            
            relatedCarousel.appendChild(card);
        });
    };
    
    window.scrollRelatedCarousel = (amount) => {
        const relatedCarousel = document.getElementById("relatedCarousel");
        if (relatedCarousel) {
            relatedCarousel.scrollBy({ left: amount, behavior: "smooth" });
        }
    };
    
    const attachEventListeners = () => {
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('.thumbnail-img');
        
        if (mainImage && thumbnails.length) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    thumbnails.forEach((t) => t.classList.remove('active'));
                    thumb.classList.add('active');
                    mainImage.src = thumb.src;
                });
            });
        }
        
        const colorDots = document.querySelectorAll('.color-dot');
        const selectedColorSpan = document.getElementById('selectedColor');
        
        colorDots.forEach(dot => {
            dot.addEventListener('click', () => {
                colorDots.forEach(d => d.classList.remove('selected'));
                dot.classList.add('selected');
                const colorName = dot.getAttribute('data-color') || dot.style.backgroundColor;
                if (selectedColorSpan) {
                    selectedColorSpan.textContent = colorName || 'Selected';
                }
            });
        });
        
        const sizeOptions = document.querySelectorAll('.size-option');
        const selectedSizeSpan = document.getElementById('selectedSize');
        
        sizeOptions.forEach(option => {
            option.addEventListener('click', () => {
                sizeOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                if (selectedSizeSpan) {
                    selectedSizeSpan.textContent = option.getAttribute('data-size');
                }
            });
        });
        
        const quantityInput = document.getElementById('quantity');
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const maxStock = product.countInStock || 99;
        
        if (decreaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', () => {
                let currentVal = parseInt(quantityInput.value);
                if (currentVal > 1) {
                    quantityInput.value = currentVal - 1;
                }
            });
        }
        
        if (increaseBtn && quantityInput) {
            increaseBtn.addEventListener('click', () => {
                let currentVal = parseInt(quantityInput.value);
                if (currentVal < maxStock) {
                    quantityInput.value = currentVal + 1;
                }
            });
        }
        
        if (quantityInput) {
            quantityInput.addEventListener('change', () => {
                let val = parseInt(quantityInput.value);
                if (isNaN(val) || val < 1) quantityInput.value = 1;
                if (val > maxStock) quantityInput.value = maxStock;
            });
        }
        
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            const newAddToCartBtn = addToCartBtn.cloneNode(true);
            addToCartBtn.parentNode.replaceChild(newAddToCartBtn, addToCartBtn);
            
            newAddToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const selectedColorElement = document.querySelector('.color-dot.selected');
                const selectedColor = selectedColorElement ? selectedColorElement.getAttribute('data-color') : null;
                
                const selectedSizeElement = document.querySelector('.size-option.selected');
                const selectedSize = selectedSizeElement ? selectedSizeElement.getAttribute('data-size') : null;
                
                const quantityInputElem = document.getElementById('quantity');
                const quantity = quantityInputElem ? parseInt(quantityInputElem.value) : 1;
                
                // Validate selections
                if (!selectedColor && product.colors && product.colors.length > 0) {
                    alert("Please select a color before adding to cart!");
                    return;
                }
                
                if (!selectedSize && product.sizes && product.sizes.length > 0) {
                    alert("Please select a size before adding to cart!");
                    return;
                }
                
                addToCartFunction(product, selectedColor, selectedSize, quantity);
                
                alert(`${product.name} added to cart!`);
            });
        }
        
        // Buy Now button
        const buyNowBtn = document.getElementById('buyNowBtn');
        if (buyNowBtn) {
            // Remove any existing listeners to avoid duplicates
            const newBuyNowBtn = buyNowBtn.cloneNode(true);
            buyNowBtn.parentNode.replaceChild(newBuyNowBtn, buyNowBtn);
            
            newBuyNowBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const selectedColorElement = document.querySelector('.color-dot.selected');
                const selectedColor = selectedColorElement ? selectedColorElement.getAttribute('data-color') : null;
                
                const selectedSizeElement = document.querySelector('.size-option.selected');
                const selectedSize = selectedSizeElement ? selectedSizeElement.getAttribute('data-size') : null;
                
                const quantityInputElem = document.getElementById('quantity');
                const quantity = quantityInputElem ? parseInt(quantityInputElem.value) : 1;
                
                if (!selectedColor && product.colors && product.colors.length > 0) {
                    alert("Please select a color before proceeding!");
                    return;
                }
                
                if (!selectedSize && product.sizes && product.sizes.length > 0) {
                    alert("Please select a size before proceeding!");
                    return;
                }
                
                addToCartFunction(product, selectedColor, selectedSize, quantity);
                
                // Redirect to checkout page
                window.location.href = 'checkout.html';
            });
        }
    };
    
    renderProductDetail(product);
});