// Vendas Page

// Populate products dropdown
function populateProductsDropdown() {
    const select = document.getElementById('sale-product');
    if (!select) return;
    
    const products = getProducts().filter(p => p.quantity > 0);
    
    // Clear existing options (except the first one)
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Add product options
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - Estoque: ${product.quantity}`;
        select.appendChild(option);
    });
    
    // Disable the form if no products
    const form = document.getElementById('sales-form');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    
    if (submitBtn) {
        submitBtn.disabled = products.length === 0;
    }
    
    // Set default date to today
    const dateInput = document.getElementById('sale-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
}

// Update quantity max value based on selected product
function setupProductSelection() {
    const select = document.getElementById('sale-product');
    const quantityInput = document.getElementById('sale-quantity');
    const stockInfo = document.getElementById('stock-info');
    
    if (!select || !quantityInput || !stockInfo) return;
    
    select.addEventListener('change', function() {
        const productId = this.value;
        
        if (!productId) {
            quantityInput.max = 1;
            stockInfo.textContent = 'Disponível em estoque: 0';
            return;
        }
        
        const product = getProduct(productId);
        if (product) {
            quantityInput.max = product.quantity;
            stockInfo.textContent = `Disponível em estoque: ${product.quantity}`;
            
            // Reset quantity if it's more than available
            if (parseInt(quantityInput.value) > product.quantity) {
                quantityInput.value = product.quantity;
            }
        }
    });
}

// Setup sales form
function setupSalesForm() {
    const form = document.getElementById('sales-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = document.getElementById('sale-product').value;
        const quantity = parseInt(document.getElementById('sale-quantity').value);
        const date = document.getElementById('sale-date').value;
        
        if (!productId) {
            alert('Selecione um produto.');
            return;
        }
        
        try {
            const product = getProduct(productId);
            
            if (quantity > product.quantity) {
                alert(`Quantidade insuficiente em estoque. Disponível: ${product.quantity}`);
                return;
            }
            
            registerSale(productId, quantity, new Date(date).toISOString());
            
            alert(`Venda de ${quantity} unidades de "${product.name}" registrada com sucesso!`);
            
            // Reset form
            form.reset();
            document.getElementById('sale-product').value = '';
            document.getElementById('stock-info').textContent = 'Disponível em estoque: 0';
            
            // Set default date to today
            const dateInput = document.getElementById('sale-date');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.value = today;
            }
            
            // Update products dropdown
            populateProductsDropdown();
        } catch (error) {
            alert(`Erro ao registrar venda: ${error.message}`);
        }
    });
}

// Initialize vendas page
function initVendas() {
    populateProductsDropdown();
    setupProductSelection();
    setupSalesForm();
}

// Run on page load
document.addEventListener('DOMContentLoaded', initVendas);