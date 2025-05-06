// Cadastro Page

// Populate existing products dropdown
function populateProductsDropdown() {
    const select = document.getElementById('existing-product');
    if (!select) return;
    
    const products = getProducts();
    
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
    const form = document.getElementById('add-existing-form');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    
    if (submitBtn) {
        submitBtn.disabled = products.length === 0;
    }
}

// Setup new product form
function setupNewProductForm() {
    const form = document.getElementById('new-product-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('product-name').value;
        const quantity = parseInt(document.getElementById('product-quantity').value);
        const price = parseFloat(document.getElementById('product-price').value);
        
        try {
            addProduct({
                name,
                quantity,
                price
            });
            
            alert(`Produto "${name}" adicionado com sucesso!`);
            
            // Reset form
            form.reset();
            
            // Update products dropdown
            populateProductsDropdown();
        } catch (error) {
            alert(`Erro ao adicionar produto: ${error.message}`);
        }
    });
}

// Setup add existing product form
function setupAddExistingForm() {
    const form = document.getElementById('add-existing-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = document.getElementById('existing-product').value;
        const quantity = parseInt(document.getElementById('add-quantity').value);
        
        if (!productId) {
            alert('Selecione um produto.');
            return;
        }
        
        try {
            const product = getProduct(productId);
            updateProductQuantity(productId, quantity);
            
            alert(`${quantity} unidades de "${product.name}" foram adicionadas ao estoque.`);
            
            // Reset form
            form.reset();
            document.getElementById('existing-product').value = '';
            
            // Update products dropdown
            populateProductsDropdown();
        } catch (error) {
            alert(`Erro ao atualizar estoque: ${error.message}`);
        }
    });
}

// Initialize cadastro page
function initCadastro() {
    populateProductsDropdown();
    setupNewProductForm();
    setupAddExistingForm();
}

// Run on page load
document.addEventListener('DOMContentLoaded', initCadastro);