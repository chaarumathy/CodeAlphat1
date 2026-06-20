import { getProfile } from "./user.js";

document.addEventListener("DOMContentLoaded", () => {
    initDarkMode();
    initMobileMenu();
    initMobileMegaMenu();
    initUserAuth();
});

//  DARK MODE FUNCTIONALITY 
function initDarkMode() {
    const darkToggle = document.getElementById("dark-toggle");
    const mobileDarkToggle = document.getElementById("mobile-dark-toggle");
    const body = document.body;

    if (!darkToggle && !mobileDarkToggle) return;

    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        if (darkToggle) darkToggle.textContent = "🌙";
        if (mobileDarkToggle) mobileDarkToggle.textContent = "🌙";
    } else {
        if (darkToggle) darkToggle.textContent = "☀️";
        if (mobileDarkToggle) mobileDarkToggle.textContent = "☀️";
    }

    function updateDarkModeIcons(isDarkMode) {
        const icon = isDarkMode ? "🌙" : "☀️";
        if (darkToggle) darkToggle.textContent = icon;
        if (mobileDarkToggle) mobileDarkToggle.textContent = icon;
    }

    if (darkToggle) {
        darkToggle.addEventListener("click", () => {
            body.classList.toggle("dark-mode");
            const isDarkMode = body.classList.contains("dark-mode");
            localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
            updateDarkModeIcons(isDarkMode);
        });
    }

    if (mobileDarkToggle) {
        mobileDarkToggle.addEventListener("click", () => {
            body.classList.toggle("dark-mode");
            const isDarkMode = body.classList.contains("dark-mode");
            localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
            updateDarkModeIcons(isDarkMode);
        });
    }
}

//  MOBILE MENU FUNCTIONALITY 
function initMobileMenu() {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const closeBtn = document.getElementById("close-btn");
    const menuOverlay = document.getElementById("menu_overlay");

    if (!menuBtn || !mobileMenu || !closeBtn || !menuOverlay) return;

    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.add("active");
        menuOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    closeBtn.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        menuOverlay.classList.remove("active");
        document.body.style.overflow = "";
    });

    menuOverlay.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        menuOverlay.classList.remove("active");
        document.body.style.overflow = "";
    });
}

//  MOBILE MEGA MENU FUNCTIONALITY 
function initMobileMegaMenu() {
    const shopChevron = document.getElementById("shop-chevron");
    const mobileMegaMenu = document.getElementById("mobile-mega-menu");

    if (!shopChevron || !mobileMegaMenu) return;

    shopChevron.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        mobileMegaMenu.classList.toggle("active");
        shopChevron.classList.toggle("fa-chevron-down");
        shopChevron.classList.toggle("fa-chevron-up");
    });
}

//  USER AUTHENTICATION 
async function initUserAuth() {
    try {
        const token = localStorage.getItem("token");
        const loginBtn = document.getElementById("loginBtn");
        const profileDropdown = document.getElementById("profileDropdown");
        const profileSection = document.getElementById("profileSection");
        const dropdownMenu = document.getElementById("dropdownMenu");

        if (!loginBtn && !profileDropdown) {
            console.log("Auth elements not found on this page, skipping auth UI");
            return;
        }

        if (!token) {
            if (loginBtn) showLoginButton(loginBtn, profileDropdown);
            return;
        }

        const user = await getProfile();
        
        if (user?.user?.name) {
            if (loginBtn && profileDropdown && profileSection && dropdownMenu) {
                showUserProfile(user.user, loginBtn, profileDropdown, profileSection, dropdownMenu);
            } else if (loginBtn) {
                showLoginButton(loginBtn, profileDropdown);
            }
        } else {
            if (loginBtn) showLoginButton(loginBtn, profileDropdown);
        }
        
    } catch (error) {
        console.error("initUserAuth error:", error);
        const loginBtn = document.getElementById("loginBtn");
        const profileDropdown = document.getElementById("profileDropdown");
        if (loginBtn) showLoginButton(loginBtn, profileDropdown);
    }
}

function showLoginButton(loginBtn, profileDropdown) {
    if (loginBtn) {
        loginBtn.style.display = "flex";
        loginBtn.style.alignItems = "center";
        loginBtn.style.gap = "8px";
    }
    if (profileDropdown) {
        profileDropdown.style.display = "none";
    }
}
function showUserProfile(user, loginBtn, profileDropdown, profileSection, dropdownMenu) {
    if (!loginBtn || !profileDropdown || !profileSection || !dropdownMenu) {
        console.warn("Profile elements missing, cannot show user profile");
        return;
    }
    
    if (loginBtn) {
        loginBtn.style.display = "none";
    }
    
    if (profileDropdown) {
        profileDropdown.style.display = "block";
    }
    
    if (profileSection) {
        const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "U";
        profileSection.textContent = firstLetter;
        profileSection.title = user.name;
    }
    
    if (dropdownMenu) {
        dropdownMenu.innerHTML = `
            <div class="user-info">
                <strong>${user.name}</strong>
                <small>${user.email}</small>
            </div>
            <hr>
            <a href="profile.html">My Profile</a>
            <a href="orders.html">My Orders</a>
            <a href="wishlist.html">Wishlist</a>
            <button class="logout-btn" id="logoutBtnNav">Logout</button>
        `;
        
        const logoutBtn = document.getElementById("logoutBtnNav");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("token");
                localStorage.removeItem("currentUser");
                alert("Logged out successfully!");
                window.location.reload();
            });
        }
    }
    
    if (profileSection) {
        // Remove existing listeners by cloning
        const newProfileSection = profileSection.cloneNode(true);
        if (profileSection.parentNode) {
            profileSection.parentNode.replaceChild(newProfileSection, profileSection);
        }
        
        newProfileSection.addEventListener("click", (e) => {
            e.stopPropagation();
            if (dropdownMenu) {
                dropdownMenu.classList.toggle("show");
            }
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
        if (dropdownMenu) {
            dropdownMenu.classList.remove("show");
        }
    });
}

//  EXPORTS 
export { initUserAuth, initDarkMode, initMobileMenu, initMobileMegaMenu };