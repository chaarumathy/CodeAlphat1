
import { fetchProducts } from "/js/products.js";

window.renderAuthModal = function() {
    const modal = document.getElementById("authModal");
    if (modal) {
        modal.classList.add("show");
    } else {
        console.error("Auth modal not found");
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        if (typeof renderAuthModal === 'function') {
            renderAuthModal();
        }
    });
} else {
    if (typeof renderAuthModal === 'function') {
        renderAuthModal();
    }
}

const carousel = document.getElementById("carousel");
const filterButtons = document.querySelectorAll(".filter-button");

let products = [];

const getProducts = async () => {
    try {
        if (carousel) {
            carousel.innerHTML = '<p style="padding: 20px; color: #555;">Loading products from database...</p>';
        }
        
        const fetchedProducts = await fetchProducts();
        
        if (fetchedProducts && fetchedProducts.length > 0) {
            products = fetchedProducts;
            console.log(` Loaded ${products.length} products from MongoDB database`);
            
            window.products = products;
            
            // Render all carousels
            renderProducts("best-seller");
            renderCarouselProducts("womenCarousel", "Women");
            renderCarouselProducts("menCarousel", "Men");
        } else {
            console.warn("⚠️ No products found in database");
            if (carousel) {
                carousel.innerHTML = '<p style="padding: 20px; color: #555;">No products available in database.</p>';
            }
        }
        
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        if (carousel) {
            carousel.innerHTML = '<p style="padding: 20px; color: #555;">Error loading products. Please try again later.</p>';
        }
    }
};

function renderProducts(filterTag) {
    if (!carousel) return;
    carousel.innerHTML = "";
    
    if (!products || products.length === 0) {
        carousel.innerHTML = `<p style="padding: 20px; color: #555;">Loading products...</p>`;
        return;
    }
    
    let filterProducts = [];
    if (!filterTag || filterTag === "") {
        filterProducts = products;
    } else {
        filterProducts = products.filter((p) => p.tags && p.tags.includes(filterTag));
    }
    
    if (filterProducts.length === 0) {
        carousel.innerHTML = `<p style="padding: 20px; color: #555;">No Products found.</p>`;
        return;
    }
    
    filterProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        let stars = "";
        for (let i = 0; i < 5; i++) {
            if (i < (product.avgRating || 0)) {
                stars += `<i class="fas fa-star" style="color:#fbbf24;"></i>`;
            } else {
                stars += `<i class="far fa-star" style="color:#fbbf24;"></i>`;
            }
        }
        productCard.innerHTML = `
            ${product.discount ? `<div class="discount-badge">${product.discount}% off</div>` : ""}
            <div class="product-image-container">
                <img src="${product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300'}" alt="${product.name}" class="product-image">
            </div>
            <h3 class="product-title">${product.name ? product.name.slice(0, 30) : 'Product'}...</h3>
            <div class="product-rating">${stars}</div>
            <div class="product-price">$${product.price ? product.price.toFixed(2) : '0.00'}</div>
        `;
        carousel.appendChild(productCard);
    });
}

window.scrollCarousel = function(amount) {
    if (carousel) {
        carousel.scrollBy({ left: amount, behavior: "smooth" });
    }
};

if (filterButtons && filterButtons.length > 0) {
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            const filterTag = button.dataset.filter;
            renderProducts(filterTag);
        });
    });
}

// renderProducts("best-seller");
getProducts().then(() => renderProducts("best-seller"));

//  MEN & WOMEN CAROUSELS 
function renderCarouselProducts(containerId, gender) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    
    if (!products || products.length === 0) {
        container.innerHTML = '<p style="padding: 20px; color: #555;">Loading products...</p>';
        return;
    }
    
    const filtered = products.filter((p) => p.gender === gender);
    
    if (filtered.length === 0) {
        container.innerHTML = `<p style="padding: 20px; color: #555;">No ${gender} products found.</p>`;
        return;
    }
    
    filtered.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        let stars = "";
        for (let i = 0; i < 5; i++) {
            if (i < (product.avgRating || 0)) {
                stars += `<i class="fas fa-star" style="color:#fbbf24;"></i>`;
            } else {
                stars += `<i class="far fa-star" style="color:#fbbf24;"></i>`;
            }
        }
        card.innerHTML = `
            ${product.discount ? `<div class="discount-badge">${product.discount}% off</div>` : ""}
            <div class="product-image-container">
                <img src="${product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300'}" alt="${product.name}" class="product-image">
            </div>
            <h3 class="product-title">${product.name ? product.name.slice(0, 30) : 'Product'}...</h3>
            <div class="product-rating">${stars}</div>
            <div class="product-price">$${product.price ? product.price.toFixed(2) : '0.00'}</div>
        `;
        container.appendChild(card);
    });
}

window.menWomenScrollCarousel = function(id, offset) {
    const carouselEl = document.getElementById(id);
    if (carouselEl) {
        carouselEl.scrollBy({ left: offset, behavior: "smooth" });
    }
};

getProducts();

//  SHOP PAGE SCRIPT 
document.addEventListener("DOMContentLoaded", function() {

    const productGrid = document.getElementById("productGrid");
    const productCount = document.getElementById("productCount");
    const searchInput = document.getElementById("searchInput");
    const genderFilters = document.getElementById("genderFilters");
    const categoryFilters = document.querySelector(".categoryFilters");
    const brandFilters = document.getElementById("brandFilters");
    const colorFilters = document.getElementById("colorFilters");
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");
    const sortOptions = document.getElementById("sortOptions");
    const resetFiltersBtn = document.getElementById("resetFiltersBtn");
    const openSidebarBtn = document.getElementById("openSidebar");
    const closeSidebarBtn = document.getElementById("closeSidebar");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebar_overlay");

    if (!productGrid) return;

    let allProducts = [];
    
    if (typeof products !== 'undefined' && products.length > 0) {
        allProducts = products.filter(p => p.isPublished !== false);
        console.log(` Loaded ${allProducts.length} products for shop page`);
    } else if (window.products && window.products.length > 0) {
        allProducts = window.products.filter(p => p.isPublished !== false);
        products = window.products;
        console.log(` Loaded ${allProducts.length} products from window.products`);
    } else {
        console.warn("⚠️ Products data not found!");
        allProducts = [
            { id: 1, name: "Premium Cotton T-Shirt", slug: "premium-tshirt", description: "Soft 100% cotton", discount: 0, price: 29.99, listPrice: 39.99, images: ["https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=300"], gender: "Men", category: "T-shirts", brand: "NatiMart", tags: ["best-seller"], isPublished: true, avgRating: 4.5, numReviews: 128, colors: ["blue", "black", "white"], sizes: ["S", "M", "L", "XL"] },
            { id: 2, name: "Women's Summer Floral Dress", slug: "floral-dress", description: "Lightweight flowy dress", discount: 15, price: 59.99, listPrice: 89.99, images: ["https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=300"], gender: "Women", category: "dresses", brand: "Bloom", tags: ["trending"], isPublished: true, avgRating: 4.8, numReviews: 89, colors: ["pink", "yellow", "blue"], sizes: ["XS", "S", "M", "L"] },
        
        ];
        products = allProducts;
    }

    // ----- Filter State -----
    const filters = {
        searchQuery: "",
        gender: new Set(),
        category: new Set(),
        brand: new Set(),
        color: new Set(),
        maxPrice: 500,
        sort: "default"
    };

    // ----- Helper Functions -----
    function createCheckboxFilters(container, items, type) {
        if (!container) return;
        container.innerHTML = "";
        if (!items || items.length === 0) {
            container.innerHTML = "<p style='color:#999;'>No options available</p>";
            return;
        }
        items.forEach(item => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="checkbox" data-filter-type="${type}" value="${item}"> ${item}`;
            container.appendChild(label);
        });
    }

    function createColorSwatches(container, colors, type) {
        if (!container) return;
        container.innerHTML = "";
        if (!colors || colors.length === 0) {
            container.innerHTML = "<p style='color:#999;'>No colors available</p>";
            return;
        }
        colors.forEach(color => {
            const swatch = document.createElement("div");
            swatch.className = "color-swatch";
            swatch.style.backgroundColor = color;
            swatch.dataset.filterType = type;
            swatch.dataset.value = color;
            container.appendChild(swatch);
        });
    }

    function createColorOptions(colors) {
        if (!colors || colors.length === 0) return "";
        return colors.map((color, idx) => `
            <button class="color-option ${idx === 0 ? 'selected' : ''}"
                    style="background-color: ${color};"
                    data-color="${color}"></button>
        `).join("");
    }

    function createSizeOptions(sizes) {
        if (!sizes || sizes.length === 0) return "";
        return `
            <div class="size-options-container">
                <div class="option-label">Sizes:</div>
                <div class="size-selector">
                    ${sizes.map((size, idx) => `
                        <button class="size-option ${idx === 0 ? 'selected' : ''}">${size}</button>
                    `).join("")}
                </div>
            </div>
        `;
    }

    function updateCartCountDisplay() {
        const cartCountItems = document.getElementById("cartCountItems");
        if (cartCountItems) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCountItems.textContent = totalItems;
        }
    }

    function addToCartFunction(product, color, size, quantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const finalPrice = product.discount ? 
            product.price * (1 - product.discount / 100) : 
            product.price;
        
        const cartItem = {
            id: product.id,
            name: product.name,
            price: finalPrice,
            originalPrice: product.price,
            discount: product.discount || 0,
            quantity: quantity || 1,
            color: color,
            size: size,
            image: product.images && product.images[0] ? product.images[0] : null,
            slug: product.slug
        };
        
        const existingItemIndex = cart.findIndex(item => 
            item.id === cartItem.id && 
            item.size === cartItem.size && 
            item.color === cartItem.color
        );
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += cartItem.quantity;
        } else {
            cart.push(cartItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCountDisplay();
        return cart;
    }

    function renderProducts(productsToRender) {
        if (!productGrid) return;
        productGrid.innerHTML = "";
        
        if (productsToRender.length === 0) {
            productGrid.innerHTML = `<div style="text-align:center; padding:3rem; color:#666;">No products found matching your criteria.</div>`;
            if (productCount) productCount.textContent = "0 Product(s) found";
            return;
        }

        productsToRender.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";

            let stars = "";
            const rating = product.avgRating || 0;
            for (let i = 0; i < 5; i++) {
                stars += i < rating
                    ? '<i class="fas fa-star" style="color:#fbbf24;"></i>'
                    : '<i class="far fa-star" style="color:#fbbf24;"></i>';
            }

            card.innerHTML = `
                <div class="product-image-container">
                    <img class="product-image" src="${product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300'}" alt="${product.name || 'Product'}">
                    <button class="favorite-btn" aria-label="Add to favorites">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    ${product.discount ? `<div class="discount-badge">${product.discount}% OFF</div>` : ""}
                </div>
                <div class="product-details">
                    <div class="meta-info">
                        <p class="brand">${product.brand || "NatiMart"}</p>
                        <div class="rating">${stars}<span>(${product.numReviews || 0})</span></div>
                    </div>
                    <h4 class="product-name">
                        <a href="product.html?slug=${product.slug || product.id}">${product.name && product.name.length > 40 ? product.name.slice(0,40)+"..." : (product.name || 'Product')}</a>
                    </h4>
                    <div class="colors">
                        <div class="option-label">Colors:</div>
                        <div class="color-selector">${createColorOptions(product.colors)}</div>
                    </div>
                    ${createSizeOptions(product.sizes)}
                    <div class="product-actions">
                        <p class="price">$${product.price ? product.price.toFixed(2) : '0.00'}</p>
                        <button class="add-to-cart-btn" data-product-id="${product.id}">
                            <i class="fa-solid fa-cart-shopping"></i> Add
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });

        attachProductCardEvents();

        if (productCount) {
            productCount.textContent = `${productsToRender.length} Product(s) found`;
        }
    }

    function attachProductCardEvents() {
        if (!productGrid) return;
        
        const colorButtons = document.querySelectorAll(".color-option");
        colorButtons.forEach((btn) => {
            btn.removeEventListener("click", handleColorClick);
            btn.addEventListener("click", handleColorClick);
        });
        
        const sizeButtons = document.querySelectorAll(".size-option");
        sizeButtons.forEach((btn) => {
            btn.removeEventListener("click", handleSizeClick);
            btn.addEventListener("click", handleSizeClick);
        });
        
        const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
        addToCartButtons.forEach((btn) => {
            btn.removeEventListener("click", handleAddToCart);
            btn.addEventListener("click", handleAddToCart);
        });
        
        const favoriteBtns = document.querySelectorAll(".favorite-btn");
        favoriteBtns.forEach((btn) => {
            btn.removeEventListener("click", handleFavoriteClick);
            btn.addEventListener("click", handleFavoriteClick);
        });
    }
    
    function handleColorClick(e) {
        const btn = e.currentTarget;
        const container = btn.closest(".color-selector");
        if (container) {
            container.querySelectorAll(".color-option").forEach(opt => opt.classList.remove("selected"));
            btn.classList.add("selected");
        }
    }
    
    function handleSizeClick(e) {
        const btn = e.currentTarget;
        const container = btn.closest(".size-selector");
        if (container) {
            container.querySelectorAll(".size-option").forEach(opt => opt.classList.remove("selected"));
            btn.classList.add("selected");
        }
    }
    
    function handleAddToCart(e) {
        const btn = e.currentTarget;
        const productCard = btn.closest(".product-card");
        
        const productName = productCard.querySelector(".product-name a")?.textContent || "";
        const productPrice = parseFloat(productCard.querySelector(".price")?.textContent.replace('$', '') || 0);
        
        const productData = allProducts.find(p => p.name === productName || p.price === productPrice);
        
        if (!productData) {
            alert("Product data not found!");
            return;
        }
        
        const selectedColorBtn = productCard.querySelector(".color-option.selected");
        const selectedSizeBtn = productCard.querySelector(".size-option.selected");
        
        const hasColorOptions = productCard.querySelectorAll(".color-option").length > 0;
        const hasSizeOptions = productCard.querySelectorAll(".size-option").length > 0;
        
        if (hasColorOptions && !selectedColorBtn) {
            alert("Please select a color before adding to cart!");
            return;
        }
        
        if (hasSizeOptions && !selectedSizeBtn) {
            alert("Please select a size before adding to cart!");
            return;
        }
        
        const color = selectedColorBtn ? selectedColorBtn.getAttribute("data-color") : null;
        const size = selectedSizeBtn ? selectedSizeBtn.textContent : null;
        const quantity = 1;
        
        addToCartFunction(productData, color, size, quantity);
        alert(`${productData.name} added to cart!`);
    }
    
    function handleFavoriteClick(e) {
        const btn = e.currentTarget;
        const icon = btn.querySelector("i");
        icon.classList.toggle("fa-regular");
        icon.classList.toggle("fa-solid");
    }

    // ----- Apply Filters & Sort -----
    function applyFiltersAndSort() {
        let filtered = [...allProducts];

        if (filters.searchQuery) {
            filtered = filtered.filter(p => 
                p.name && p.name.toLowerCase().includes(filters.searchQuery) ||
                p.brand && p.brand.toLowerCase().includes(filters.searchQuery) ||
                p.category && p.category.toLowerCase().includes(filters.searchQuery)
            );
        }
        
        if (filters.gender.size) {
            filtered = filtered.filter(p => filters.gender.has(p.gender));
        }
        
        if (filters.category.size) {
            filtered = filtered.filter(p => filters.category.has(p.category));
        }
        
        if (filters.brand.size) {
            filtered = filtered.filter(p => filters.brand.has(p.brand));
        }
        
        if (filters.color.size) {
            filtered = filtered.filter(p => p.colors && p.colors.some(c => filters.color.has(c)));
        }
        
        filtered = filtered.filter(p => (p.price || 0) <= filters.maxPrice);

        switch (filters.sort) {
            case "price-asc": 
                filtered.sort((a, b) => (a.price || 0) - (b.price || 0)); 
                break;
            case "price-desc": 
                filtered.sort((a, b) => (b.price || 0) - (a.price || 0)); 
                break;
            case "name-asc": 
                filtered.sort((a, b) => (a.name || '').localeCompare(b.name || '')); 
                break;
            case "name-desc": 
                filtered.sort((a, b) => (b.name || '').localeCompare(a.name || '')); 
                break;
        }

        renderProducts(filtered);
        updateURLWithFilters();
    }

    function updateURLWithFilters() {
        const params = new URLSearchParams();
        if (filters.searchQuery) params.set("search", filters.searchQuery);
        if (filters.gender.size) params.set("gender", [...filters.gender].join(","));
        if (filters.category.size) params.set("category", [...filters.category].join(","));
        if (filters.brand.size) params.set("brand", [...filters.brand].join(","));
        if (filters.color.size) params.set("color", [...filters.color].join(","));
        if (priceRange && filters.maxPrice < (priceRange.max || 500)) params.set("price", filters.maxPrice);
        if (filters.sort !== "default") params.set("sort", filters.sort);
        
        const newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
        history.pushState(null, "", newUrl);
    }

    function readFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);
        filters.searchQuery = params.get("search") || "";
        filters.gender = new Set(params.get("gender")?.split(",") || []);
        filters.category = new Set(params.get("category")?.split(",") || []);
        filters.brand = new Set(params.get("brand")?.split(",") || []);
        filters.color = new Set(params.get("color")?.split(",") || []);
        filters.maxPrice = Number(params.get("price")) || (priceRange ? priceRange.max : 500);
        filters.sort = params.get("sort") || "default";
    }

    function updateUIFromFilters() {
        if (searchInput) searchInput.value = filters.searchQuery;
        if (priceRange) priceRange.value = filters.maxPrice;
        if (priceValue) priceValue.textContent = `$${filters.maxPrice}`;
        if (sortOptions) sortOptions.value = filters.sort;

        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            const type = cb.dataset.filterType;
            if (type && filters[type]) {
                cb.checked = filters[type].has(cb.value);
            }
        });

        document.querySelectorAll(".color-swatch").forEach(sw => {
            const type = sw.dataset.filterType;
            const val = sw.dataset.value;
            if (type && filters[type] && filters[type].has(val)) {
                sw.classList.add("selected");
            } else {
                sw.classList.remove("selected");
            }
        });
    }

    function setupFilters() {
        if (!allProducts.length) return;
        
        const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
        const genders = [...new Set(allProducts.map(p => p.gender).filter(Boolean))];
        const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))];
        const colors = [...new Set(allProducts.flatMap(p => p.colors || []))];

        if (genderFilters) createCheckboxFilters(genderFilters, genders, "gender");
        if (categoryFilters) createCheckboxFilters(categoryFilters, categories, "category");
        if (brandFilters) createCheckboxFilters(brandFilters, brands, "brand");
        if (colorFilters) createColorSwatches(colorFilters, colors, "color");

        const maxProductPrice = Math.ceil(Math.max(...allProducts.map(p => p.price || 0), 500));
        if (priceRange) {
            priceRange.max = maxProductPrice;
            priceRange.value = filters.maxPrice;
        }
        if (priceValue) priceValue.textContent = `$${filters.maxPrice}`;
    }

    function handleCheckboxChange(e) {
        if (e.target.type === "checkbox") {
            const { value, dataset, checked } = e.target;
            const type = dataset.filterType;
            if (checked) {
                filters[type].add(value);
            } else {
                filters[type].delete(value);
            }
            applyFiltersAndSort();
        }
    }

    function addEventListeners() {
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                filters.searchQuery = e.target.value.toLowerCase();
                applyFiltersAndSort();
            });
        }
        
        if (genderFilters) genderFilters.addEventListener("change", handleCheckboxChange);
        if (categoryFilters) categoryFilters.addEventListener("change", handleCheckboxChange);
        if (brandFilters) brandFilters.addEventListener("change", handleCheckboxChange);
        
        if (colorFilters) {
            colorFilters.addEventListener("click", (e) => {
                const swatch = e.target.closest(".color-swatch");
                if (swatch) {
                    swatch.classList.toggle("selected");
                    const { value, filterType } = swatch.dataset;
                    if (swatch.classList.contains("selected")) {
                        filters[filterType].add(value);
                    } else {
                        filters[filterType].delete(value);
                    }
                    applyFiltersAndSort();
                }
            });
        }
        
        if (priceRange) {
            priceRange.addEventListener("input", (e) => {
                filters.maxPrice = Number(e.target.value);
                if (priceValue) priceValue.textContent = `$${filters.maxPrice}`;
                applyFiltersAndSort();
            });
        }
        
        if (sortOptions) {
            sortOptions.addEventListener("change", (e) => {
                filters.sort = e.target.value;
                applyFiltersAndSort();
            });
        }
        
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener("click", () => {
                filters.searchQuery = "";
                filters.gender.clear();
                filters.category.clear();
                filters.brand.clear();
                filters.color.clear();
                filters.maxPrice = priceRange ? priceRange.max : 500;
                filters.sort = "default";
                
                if (searchInput) searchInput.value = "";
                if (priceRange) priceRange.value = filters.maxPrice;
                if (priceValue) priceValue.textContent = `$${filters.maxPrice}`;
                if (sortOptions) sortOptions.value = "default";
                
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("selected"));
                applyFiltersAndSort();
            });
        }
    }

    function initSidebarToggle() {
        if (openSidebarBtn && closeSidebarBtn && sidebar && sidebarOverlay) {
            const newOpenBtn = openSidebarBtn.cloneNode(true);
            const newCloseBtn = closeSidebarBtn.cloneNode(true);
            if (openSidebarBtn.parentNode) openSidebarBtn.parentNode.replaceChild(newOpenBtn, openSidebarBtn);
            if (closeSidebarBtn.parentNode) closeSidebarBtn.parentNode.replaceChild(newCloseBtn, closeSidebarBtn);
            
            newOpenBtn.addEventListener("click", () => {
                sidebar.classList.add("show");
                sidebarOverlay.classList.add("active");
                document.body.style.overflow = "hidden";
            });
            
            newCloseBtn.addEventListener("click", () => {
                sidebar.classList.remove("show");
                sidebarOverlay.classList.remove("active");
                document.body.style.overflow = "";
            });
            
            sidebarOverlay.addEventListener("click", () => {
                sidebar.classList.remove("show");
                sidebarOverlay.classList.remove("active");
                document.body.style.overflow = "";
            });
        }
    }

    // Initialize shop page
    updateCartCountDisplay();
    readFiltersFromURL();
    setupFilters();
    addEventListeners();
    updateUIFromFilters();
    applyFiltersAndSort();
    initSidebarToggle();
    
});