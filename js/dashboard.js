// Dashboard Page - Namespace para evitar conflitos
(function() {
    // Variáveis para os gráficos - agora encapsuladas no escopo da função
    let overviewChart = null;
    let dailyChart = null;

    // Períodos selecionados para entradas e saídas
    let selectedPeriods = {
        entries: 1,
        sales: 1
    };

    // Update stats
    function updateStats() {
        const products = getProducts();
        const transactions = getTransactions();
        
        // Calculate stats
        const totalProducts = products.reduce((sum, product) => sum + product.quantity, 0);
        const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
        
        const sales = transactions.filter(t => t.type === 'sale');
        const totalSales = sales.reduce((sum, sale) => sum + sale.quantity, 0);
        const totalSalesValue = sales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);
        
        // Get recent transactions (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentEntries = transactions.filter(t => 
            t.type === 'entry' && new Date(t.date) >= thirtyDaysAgo
        ).length;
        
        const recentSales = transactions.filter(t => 
            t.type === 'sale' && new Date(t.date) >= thirtyDaysAgo
        ).length;
        
        // Update DOM
        document.getElementById('total-products').textContent = totalProducts;
        document.getElementById('total-value').textContent = `Valor total: ${formatCurrency(totalValue)}`;
        
        document.getElementById('total-sales').textContent = totalSales;
        document.getElementById('total-sales-value').textContent = `Valor total: ${formatCurrency(totalSalesValue)}`;
        
        document.getElementById('recent-entries').textContent = recentEntries;
        document.getElementById('recent-sales').textContent = recentSales;
    }

    // Filtrar transações por período
    function filterTransactionsByPeriod(transactions, type, days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return transactions
            .filter(t => t.type === type && new Date(t.date) >= cutoffDate)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5); // Mostrar apenas as 5 mais recentes
    }

    // Update transaction tables
    function updateTransactionTables() {
        const transactions = getTransactions();
        
        // Get recent transactions (combined) - apenas 5 mais recentes
        const recentTransactions = transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        // Filtrar por período selecionado
        const lastEntries = filterTransactionsByPeriod(transactions, 'entry', selectedPeriods.entries);
        const lastSales = filterTransactionsByPeriod(transactions, 'sale', selectedPeriods.sales);
        
        // Update tables
        updateTransactionTable('recent-transactions', recentTransactions, true);
        updateTransactionTable('recent-entries-table', lastEntries, false);
        updateTransactionTable('recent-sales-table', lastSales, false);
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

    // Create overview chart (monthly) com estilo moderno
    function createOverviewChart() {
        const transactions = getTransactions();
        const ctx = document.getElementById('overview-chart');
        
        if (!ctx) return;
        
        // Destroy previous chart if it exists
        if (overviewChart) {
            overviewChart.destroy();
        }
        
        // Process data for the chart
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        }).reverse();
        
        const entriesData = Array(6).fill(0);
        const salesData = Array(6).fill(0);
        
        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            const monthYear = transactionDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            const index = last6Months.indexOf(monthYear);
            
            if (index !== -1) {
                const value = transaction.quantity * transaction.price;
                if (transaction.type === 'entry') {
                    entriesData[index] += value;
                } else {
                    salesData[index] += value;
                }
            }
        });
        
        // Create the chart com estilo moderno
        overviewChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: last6Months,
                datasets: [
                    {
                        label: 'Entradas (R$)',
                        data: entriesData,
                        backgroundColor: 'rgba(0, 200, 83, 0.7)',
                        borderColor: 'rgba(0, 200, 83, 1)',
                        borderWidth: 0,
                        borderRadius: 6,
                        barPercentage: 0.6,
                        categoryPercentage: 0.7
                    },
                    {
                        label: 'Saídas (R$)',
                        data: salesData,
                        backgroundColor: 'rgba(0, 176, 255, 0.7)',
                        borderColor: 'rgba(0, 176, 255, 1)',
                        borderWidth: 0,
                        borderRadius: 6,
                        barPercentage: 0.6,
                        categoryPercentage: 0.7
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 13
                        },
                        bodyFont: {
                            size: 12
                        },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += formatCurrency(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            },
                            padding: 10
                        }
                    }
                }
            }
        });
    }

    // Create daily comparison chart com estilo moderno
    function createDailyChart() {
        const transactions = getTransactions();
        const ctx = document.getElementById('daily-chart');
        
        if (!ctx) return;
        
        // Destroy previous chart if it exists
        if (dailyChart) {
            dailyChart.destroy();
        }
        
        // Get last 14 days
        const last14Days = Array.from({ length: 14 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }).reverse();
        
        // Format for display
        const displayLabels = last14Days.map(day => {
            const date = new Date(day);
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        });
        
        // Initialize data arrays
        const entriesData = Array(14).fill(0);
        const salesData = Array(14).fill(0);
        
        // Process transactions
        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
            const index = last14Days.indexOf(transactionDate);
            
            if (index !== -1) {
                const value = transaction.quantity * transaction.price;
                if (transaction.type === 'entry') {
                    entriesData[index] += value;
                } else {
                    salesData[index] += value;
                }
            }
        });
        
        // Create the chart com estilo moderno
        dailyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: displayLabels,
                datasets: [
                    {
                        label: 'Entradas (R$)',
                        data: entriesData,
                        borderColor: 'rgba(0, 200, 83, 1)',
                        backgroundColor: 'rgba(0, 200, 83, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: 'rgba(0, 200, 83, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Saídas (R$)',
                        data: salesData,
                        borderColor: 'rgba(0, 176, 255, 1)',
                        backgroundColor: 'rgba(0, 176, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: 'rgba(0, 176, 255, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 13
                        },
                        bodyFont: {
                            size: 12
                        },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += formatCurrency(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            },
                            padding: 10
                        }
                    }
                }
            }
        });
    }

    // Setup period selectors
    function setupPeriodSelectors() {
        const periodButtons = document.querySelectorAll('.period-btn');
        
        periodButtons.forEach(button => {
            button.addEventListener('click', function() {
                const period = parseInt(this.dataset.period);
                const target = this.dataset.target;
                
                // Update selected period
                selectedPeriods[target] = period;
                
                // Update active state
                document.querySelectorAll(`.period-btn[data-target="${target}"]`).forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update tables
                updateTransactionTables();
            });
        });
    }

    // Setup chart tabs
    function setupChartTabs() {
        const chartTabs = document.querySelectorAll('.chart-tab');
        
        chartTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const chartId = this.dataset.chart;
                
                // Update active state for tabs
                document.querySelectorAll('.chart-tab').forEach(t => {
                    t.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update active state for chart containers
                document.querySelectorAll('.chart-container').forEach(c => {
                    c.classList.remove('active');
                });
                document.getElementById(`${chartId}-chart-container`).classList.add('active');
            });
        });
    }

    // Initialize dashboard
    function initDashboard() {
        updateStats();
        updateTransactionTables();
        createOverviewChart();
        createDailyChart();
        setupPeriodSelectors();
        setupChartTabs();
    }

    // Run on page load
    document.addEventListener('DOMContentLoaded', initDashboard);
})(); // Função auto-executável (IIFE) para encapsular o código