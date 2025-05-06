// Authentication Module

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('estoquese-auth') === 'true';
}

// Redirect if not logged in (for protected pages)
function requireAuth() {
    if (!isLoggedIn() && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

// Redirect if already logged in (for login page)
function redirectIfLoggedIn() {
    if (isLoggedIn() && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('estoquese-auth');
    window.location.href = 'index.html';
}

// Login form handler
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'admin' && password === 'admin') {
                localStorage.setItem('estoquese-auth', 'true');
                window.location.href = 'dashboard.html';
            } else {
                errorMessage.textContent = 'Usuário ou senha incorretos.';
            }
        });
    }
}

// Logout button handler
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Initialize auth
function initAuth() {
    // Check current page
    if (window.location.pathname.includes('index.html')) {
        redirectIfLoggedIn();
        setupLoginForm();
    } else {
        requireAuth();
        setupLogoutButton();
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', initAuth);