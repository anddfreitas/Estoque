// UI Utilities

// Toggle sidebar
function setupSidebar() {
    const toggleBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// Setup tabs
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    if (tabBtns.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Get tab ID
                const tabId = this.dataset.tab;
                
                // Remove active class from all buttons and panes
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                
                // Add active class to current button and pane
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Check URL for tab parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam) {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabParam}"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Create transaction badge
function createTransactionBadge(type) {
    const badge = document.createElement('span');
    badge.className = type === 'entry' ? 'badge badge-entry' : 'badge badge-sale';
    
    const icon = document.createElement('i');
    icon.className = type === 'entry' ? 'fas fa-arrow-down' : 'fas fa-arrow-up';
    
    badge.appendChild(icon);
    badge.appendChild(document.createTextNode(type === 'entry' ? 'Entrada' : 'Saída'));
    
    return badge;
}

// Initialize UI
function initUI() {
    setupSidebar();
    setupTabs();
}

// Run on page load
document.addEventListener('DOMContentLoaded', initUI);

// UI Utilities

// Toggle sidebar
function setupSidebar() {
    const toggleBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// Setup tabs
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    if (tabBtns.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Get tab ID
                const tabId = this.dataset.tab;
                
                // Remove active class from all buttons and panes
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                
                // Add active class to current button and pane
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Check URL for tab parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam) {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabParam}"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Create transaction badge
function createTransactionBadge(type) {
    const badge = document.createElement('span');
    badge.className = type === 'entry' ? 'badge badge-entry' : 'badge badge-sale';
    
    const icon = document.createElement('i');
    icon.className = type === 'entry' ? 'fas fa-arrow-down' : 'fas fa-arrow-up';
    
    badge.appendChild(icon);
    badge.appendChild(document.createTextNode(type === 'entry' ? 'Entrada' : 'Saída'));
    
    return badge;
}

// Initialize UI
function initUI() {
    setupSidebar();
    setupTabs();
}

// Run on page load
document.addEventListener('DOMContentLoaded', initUI);