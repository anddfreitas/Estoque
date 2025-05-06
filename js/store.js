// Data Store Module

// Store keys
const PRODUCTS_KEY = 'estoquese-products';
const TRANSACTIONS_KEY = 'estoquese-transactions';

// Sample products data
const sampleProducts = [
    {
        id: '1',
        name: 'Notebook Dell Inspiron',
        quantity: 15,
        price: 3499.99
    },
    {
        id: '2',
        name: 'Monitor LG 24"',
        quantity: 25,
        price: 899.99
    },
    {
        id: '3',
        name: 'Teclado Mecânico Logitech',
        quantity: 30,
        price: 349.99
    },
    {
        id: '4',
        name: 'Mouse Gamer Razer',
        quantity: 20,
        price: 249.99
    },
    {
        id: '5',
        name: 'Headset Hyperx',
        quantity: 18,
        price: 399.99
    }
];

// Sample transactions
const sampleTransactions = [
    {
        id: '1',
        productId: '1',
        productName: 'Notebook Dell Inspiron',
        type: 'entry',
        quantity: 15,
        price: 3499.99,
        date: '2023-05-01T10:00:00'
    },
    {
        id: '2',
        productId: '2',
        productName: 'Monitor LG 24"',
        type: 'entry',
        quantity: 25,
        price: 899.99,
        date: '2023-05-02T11:30:00'
    },
    {
        id: '3',
        productId: '3',
        productName: 'Teclado Mecânico Logitech',
        type: 'entry',
        quantity: 30,
        price: 349.99,
        date: '2023-05-03T09:15:00'
    },
    {
        id: '4',
        productId: '4',
        productName: 'Mouse Gamer Razer',
        type: 'entry',
        quantity: 20,
        price: 249.99,
        date: '2023-05-04T14:20:00'
    },
    {
        id: '5',
        productId: '5',
        productName: 'Headset Hyperx',
        type: 'entry',
        quantity: 18,
        price: 399.99,
        date: '2023-05-05T16:45:00'
    },
    {
        id: '6',
        productId: '1',
        productName: 'Notebook Dell Inspiron',
        type: 'sale',
        quantity: 3,
        price: 3499.99,
        date: '2023-05-10T13:30:00'
    },
    {
        id: '7',
        productId: '2',
        productName: 'Monitor LG 24"',
        type: 'sale',
        quantity: 5,
        price: 899.99,
        date: '2023-05-11T10:15:00'
    },
    {
        id: '8',
        productId: '3',
        productName: 'Teclado Mecânico Logitech',
        type: 'sale',
        quantity: 8,
        price: 349.99,
        date: '2023-05-12T11:45:00'
    },
    {
        id: '9',
        productId: '4',
        productName: 'Mouse Gamer Razer',
        type: 'sale',
        quantity: 6,
        price: 249.99,
        date: '2023-05-13T15:20:00'
    },
    {
        id: '10',
        productId: '5',
        productName: 'Headset Hyperx',
        type: 'sale',
        quantity: 4,
        price: 399.99,
        date: '2023-05-14T09:30:00'
    }
];

// Initialize store with sample data if empty
function initializeStore() {
    // Check if products exist
    if (!localStorage.getItem(PRODUCTS_KEY)) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(sampleProducts));
    }

    // Check if transactions exist
    if (!localStorage.getItem(TRANSACTIONS_KEY)) {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(sampleTransactions));
    }
}

// Product operations
function getProducts() {
    const products = localStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
}

function getProduct(id) {
    const products = getProducts();
    return products.find(p => p.id === id) || null;
}

function addProduct(product) {
    const products = getProducts();
    
    // Generate ID if not provided
    if (!product.id) {
        product.id = Date.now().toString();
    }
    
    products.push(product);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

    // Add transaction record
    addTransaction({
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        type: 'entry',
        quantity: product.quantity,
        price: product.price,
        date: new Date().toISOString()
    });
    
    return product;
}

function updateProductQuantity(productId, quantity) {
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        throw new Error('Produto não encontrado');
    }

    const product = products[productIndex];
    products[productIndex] = {
        ...product,
        quantity: product.quantity + quantity
    };

    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

    // Add transaction record
    addTransaction({
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        type: 'entry',
        quantity: quantity,
        price: product.price,
        date: new Date().toISOString()
    });
    
    return products[productIndex];
}

// Transaction operations
function getTransactions() {
    const transactions = localStorage.getItem(TRANSACTIONS_KEY);
    return transactions ? JSON.parse(transactions) : [];
}

function addTransaction(transaction) {
    const transactions = getTransactions();
    
    // Generate ID if not provided
    if (!transaction.id) {
        transaction.id = Date.now().toString();
    }
    
    transactions.push(transaction);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    
    return transaction;
}

function registerSale(productId, quantity, date) {
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        throw new Error('Produto não encontrado');
    }

    const product = products[productIndex];

    if (product.quantity < quantity) {
        throw new Error('Quantidade insuficiente em estoque');
    }

    // Update product quantity
    products[productIndex] = {
        ...product,
        quantity: product.quantity - quantity
    };

    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

    // Add transaction record
    const transaction = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        type: 'sale',
        quantity: quantity,
        price: product.price,
        date: date || new Date().toISOString()
    };
    
    addTransaction(transaction);
    
    return transaction;
}

// Initialize store on page load
document.addEventListener('DOMContentLoaded', initializeStore);