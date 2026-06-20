const API_URL = 'http://localhost:4848/api/v3';

export async function getProfile() {
    try {
        const token = localStorage.getItem("token");
        
        if (!token) {
            return null;
        }
        
        const response = await fetch(`${API_URL}/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("token");
                return null;
            }
            return null;
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error("Get profile error:", error);
        return null;
    }
}

export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success && data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("currentUser", JSON.stringify(data.user));
            return { success: true, user: data.user };
        }
        
        return { success: false, message: data.message };
        
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Network error" };
    }
}

export async function registerUser(name, email, password) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (data.success && data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("currentUser", JSON.stringify(data.user));
            return { success: true, user: data.user };
        }
        
        return { success: false, message: data.message };
        
    } catch (error) {
        console.error("Register error:", error);
        return { success: false, message: "Network error" };
    }
}