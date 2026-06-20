const API_URL = 'http://localhost:4848/api/v3';

function renderAuthModal() {
    if (document.getElementById("authModal")) return;
    
    const modal = document.createElement("div");
    modal.id = "authModal";
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn" id="closeModal">&times;</span>
            <div class="tab-buttons">
                <button class="tab-btn active" data-tab="login">Login</button>
                <button class="tab-btn" data-tab="register">Register</button>
            </div>
            <form class="form-tab active" id="loginForm" data-form="login">
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
            <form class="form-tab" id="registerForm" data-form="register">
                <input type="text" placeholder="Full Name" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    initAuthModal();
}

function initAuthModal() {
    const modal = document.getElementById("authModal");
    if (!modal) return;
    
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const closeBtn = document.getElementById("closeModal");
    
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("show");
            document.body.style.overflow = "auto";
        });
    }
    
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
            document.body.style.overflow = "auto";
        }
    });
    
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
            modal.classList.remove("show");
            document.body.style.overflow = "auto";
        }
    });
    
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            tabBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            
            const tabType = btn.getAttribute("data-tab");
            
            const allForms = document.querySelectorAll(".form-tab");
            allForms.forEach((form) => {
                form.classList.remove("active");
            });
            
            if (tabType === "login") {
                if (loginForm) loginForm.classList.add("active");
            } else if (tabType === "register") {
                if (registerForm) registerForm.classList.add("active");
            }
        });
    });

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            
            if (!email || !password) {
                alert("Please fill in all fields");
                return;
            }
            
            await loginUser({ email, password });
        });
    }
    
    // Register form submission
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = registerForm.querySelector('input[type="text"]').value;
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;
            
            if (!name || !email || !password) {
                alert("Please fill in all fields");
                return;
            }
            
            if (password.length < 6) {
                alert("Password must be at least 6 characters");
                return;
            }
            
            await registerUser({ name, email, password });
        });
    }
}

function openAuthModal() {
    let modal = document.getElementById("authModal");
    if (modal) {
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
    } else {
        renderAuthModal();
        setTimeout(() => {
            const newModal = document.getElementById("authModal");
            if (newModal) {
                newModal.classList.add("show");
                document.body.style.overflow = "hidden";
            }
        }, 100);
    }
}

const registerUser = async (userData) => {
    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        const data = await res.json();
        
        if (data.success) {
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                alert(data.message || "Registration successful!");
                window.location.reload();
            } else {
                alert(data.message || "Registration failed");
            }
        } else {
            alert(data.message || "Registration failed");
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("Network error. Please try again.");
    }
};

const loginUser = async (userData) => {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        const data = await res.json();
        
        if (data.success) {
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                alert(data.message || "Login successful!");
                window.location.reload();
            } else {
                alert(data.message || "Login failed");
            }
        } else {
            alert(data.message || "Invalid credentials");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Network error. Please try again.");
    }
};

function isUserLoggedIn() {
    return localStorage.getItem("token") !== null;
}

function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    alert("Logged out successfully!");
    window.location.reload();
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

window.openAuthModal = openAuthModal;
window.logoutUser = logoutUser;
window.isUserLoggedIn = isUserLoggedIn;
window.getCurrentUser = getCurrentUser;
