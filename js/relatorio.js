// Relatório Page

// Update transaction tables
function updateTransactionTables() {
    const transactions = getTransactions();
    
    // Filter transactions by type
    const entries = transactions.filter(t => t.type === 'entry');
    const sales = transactions.filter(t => t.type === 'sale');
    
    // Sort by date (newest first)
    const sortByDate = (a, b) => new Date(b.date) - new Date(a.date);
    
    const sortedAll = [...transactions].sort(sortByDate);
    const sortedEntries = [...entries].sort(sortByDate);
    const sortedSales = [...sales].sort(sortByDate);
    
    // Update tables
    updateTransactionTable('all-transactions', sortedAll, true);
    updateTransactionTable('entries-transactions', sortedEntries, false);
    updateTransactionTable('sales-transactions', sortedSales, false);
}

// Update a specific transaction table
function updateTransactionTable(tableId, transactions, showType) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (transactions.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = showType ? 5 : 4;
        cell.textContent = 'Nenhuma transação encontrada.';
        cell.className = 'empty-table';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // Product name
        const nameCell = document.createElement('td');
        nameCell.textContent = transaction.productName;
        row.appendChild(nameCell);
        
        // Transaction type (if needed)
        if (showType) {
            const typeCell = document.createElement('td');
            typeCell.appendChild(createTransactionBadge(transaction.type));
            row.appendChild(typeCell);
        }
        
        // Quantity
        const quantityCell = document.createElement('td');
        quantityCell.textContent = transaction.quantity;
        row.appendChild(quantityCell);
        
        // Value
        const valueCell = document.createElement('td');
        valueCell.textContent = formatCurrency(transaction.quantity * transaction.price);
        row.appendChild(valueCell);
        
        // Date
        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(transaction.date);
        row.appendChild(dateCell);
        
        tbody.appendChild(row);
    });
}

// Initialize relatório page
function initRelatorio() {
    updateTransactionTables();
}

// Run on page load
document.addEventListener('DOMContentLoaded', initRelatorio);