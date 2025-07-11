// Funcionalidade do painel administrativo

const AdminDashboard = {
    // Credenciais admin (numa app real, isto seria do lado do servidor)
    adminPassword: 'admin123',
    
    // Utilizador admin atual
    currentAdmin: null,
    
    // Inicializar painel admin
    init: function() {
        this.setupEventListeners();
        this.checkAdminAuth();
    },
    
    // Configurar event listeners
    setupEventListeners: function() {
        // Formulário de login admin
        const adminLoginForm = document.getElementById('adminLoginForm');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminLogin(e);
            });
        }
        
        // Logout admin
        const adminLogout = document.getElementById('adminLogout');
        if (adminLogout) {
            adminLogout.addEventListener('click', () => {
                this.logout();
            });
        }
        
        // Abas do painel
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.showTab(e.target.dataset.tab);
            });
        });
        
        // Botão adicionar produto
        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.showAddProductModal();
            });
        }
        
        // Formulário de produto
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProductSubmit(e);
            });
        }
        
        // Botões fechar modal
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModals();
            });
        });
        
        // Botão atualizar todo o stock
        const updateAllStockBtn = document.getElementById('updateAllStockBtn');
        if (updateAllStockBtn) {
            updateAllStockBtn.addEventListener('click', () => {
                this.updateAllStock();
            });
        }
        
        // Filtros de encomendas
        const orderStatusFilter = document.getElementById('orderStatusFilter');
        if (orderStatusFilter) {
            orderStatusFilter.addEventListener('change', (e) => {
                this.filterOrders(e.target.value);
            });
        }
        
        const orderDateFilter = document.getElementById('orderDateFilter');
        if (orderDateFilter) {
            orderDateFilter.addEventListener('change', (e) => {
                this.filterOrdersByDate(e.target.value);
            });
        }
    },
    
    // Verificar autenticação admin
    checkAdminAuth: function() {
        this.currentAdmin = Utils.storage.get('bakery_admin_user');
        this.updateAdminInterface();
    },
    
    // Lidar com login admin
    handleAdminLogin: function(e) {
        const formData = new FormData(e.target);
        const password = formData.get('password');
        
        if (password === this.adminPassword) {
            this.currentAdmin = {
                id: 'admin',
                name: 'Admin',
                loginTime: new Date().toISOString()
            };
            
            Utils.storage.set('bakery_admin_user', this.currentAdmin);
            this.updateAdminInterface();
            this.loadDashboardData();
            
            Utils.showToast('Login admin realizado com sucesso!', 'success');
        } else {
            Utils.showToast('Palavra-passe admin inválida', 'error');
        }
    },
    
    // Logout
    logout: function() {
        this.currentAdmin = null;
        Utils.storage.remove('bakery_admin_user');
        this.updateAdminInterface();
        Utils.showToast('Logout realizado com sucesso', 'info');
    },
    
    // Atualizar interface admin
    updateAdminInterface: function() {
        const adminLogin = document.getElementById('adminLogin');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (this.currentAdmin) {
            if (adminLogin) adminLogin.style.display = 'none';
            if (adminDashboard) adminDashboard.style.display = 'block';
        } else {
            if (adminLogin) adminLogin.style.display = 'flex';
            if (adminDashboard) adminDashboard.style.display = 'none';
        }
    },
    
    // Carregar dados do painel
    loadDashboardData: function() {
        this.updateStats();
        this.loadOrders();
        this.loadProducts();
        this.loadInventory();
        this.loadAnalytics();
    },
    
    // Atualizar estatísticas do painel
    updateStats: function() {
        const stats = OrderManager.getOrderStats();
        const today = new Date().toDateString();
        
        // Atualizar cartões de estatísticas
        const todayOrdersEl = document.getElementById('todayOrders');
        const totalRevenueEl = document.getElementById('totalRevenue');
        const lowStockItemsEl = document.getElementById('lowStockItems');
        const pendingOrdersEl = document.getElementById('pendingOrders');
        
        if (todayOrdersEl) todayOrdersEl.textContent = stats.todayOrders;
        if (totalRevenueEl) totalRevenueEl.textContent = Utils.formatPrice(stats.todayRevenue);
        if (pendingOrdersEl) pendingOrdersEl.textContent = stats.pendingOrders;
        
        // Calcular itens com pouco stock
        const lowStockCount = ProductCatalog.getProducts().filter(p => p.stock <= 5).length;
        if (lowStockItemsEl) lowStockItemsEl.textContent = lowStockCount;
    },
    
    // Mostrar aba
    showTab: function(tabName) {
        // Atualizar botões das abas
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) activeTab.classList.add('active');
        
        // Atualizar conteúdo das abas
        document.querySelectorAll('.dashboard-content').forEach(content => {
            content.style.display = 'none';
        });
        
        const tabContent = document.getElementById(`${tabName}Tab`);
        if (tabContent) {
            tabContent.style.display = 'block';
        }
        
        // Carregar dados específicos da aba
        switch (tabName) {
            case 'orders':
                this.loadOrders();
                break;
            case 'products':
                this.loadProducts();
                break;
            case 'inventory':
                this.loadInventory();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    },
    
    // Carregar encomendas
    loadOrders: function() {
        const ordersTable = document.getElementById('ordersTable');
        if (!ordersTable) return;
        
        const orders = OrderManager.getOrdersForDisplay();
        
        let tableHTML = `
            <div class="table-header">
                <div>ID Encomenda</div>
                <div>Cliente</div>
                <div>Itens</div>
                <div>Total</div>
                <div>Estado</div>
                <div>Ações</div>
            </div>
        `;
        
        orders.forEach(order => {
            const formattedOrder = OrderManager.formatOrderForDisplay(order);
            tableHTML += `
                <div class="table-row">
                    <div>#${formattedOrder.id}</div>
                    <div>${formattedOrder.customerInfo.name}</div>
                    <div>${Utils.truncateText(formattedOrder.itemsText, 30)}</div>
                    <div>${formattedOrder.formattedTotal} MT</div>
                    <div>
                        <select class="status-select" data-order-id="${formattedOrder.id}">
                            <option value="pending" ${formattedOrder.status === 'pending' ? 'selected' : ''}>Pendente</option>
                            <option value="confirmed" ${formattedOrder.status === 'confirmed' ? 'selected' : ''}>Confirmado</option>
                            <option value="preparing" ${formattedOrder.status === 'preparing' ? 'selected' : ''}>A Preparar</option>
                            <option value="ready" ${formattedOrder.status === 'ready' ? 'selected' : ''}>Pronto</option>
                            <option value="completed" ${formattedOrder.status === 'completed' ? 'selected' : ''}>Concluído</option>
                        </select>
                    </div>
                    <div class="table-actions">
                        <button class="btn btn-primary btn-sm view-order" data-order-id="${formattedOrder.id}">Ver</button>
                        <button class="btn btn-secondary btn-sm notify-customer" data-order-id="${formattedOrder.id}">Notificar</button>
                    </div>
                </div>
            `;
        });
        
        ordersTable.innerHTML = tableHTML;
        
        // Adicionar event listeners
        this.attachOrderEventListeners();
    },
    
    // Anexar event listeners das encomendas
    attachOrderEventListeners: function() {
        // Listeners de mudança de estado
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const orderId = parseInt(e.target.dataset.orderId);
                const newStatus = e.target.value;
                this.updateOrderStatus(orderId, newStatus);
            });
        });
        
        // Botões ver encomenda
        document.querySelectorAll('.view-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = parseInt(e.target.dataset.orderId);
                this.showOrderDetails(orderId);
            });
        });
        
        // Botões notificar cliente
        document.querySelectorAll('.notify-customer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = parseInt(e.target.dataset.orderId);
                this.notifyCustomer(orderId);
            });
        });
    },
    
    // Atualizar estado da encomenda
    updateOrderStatus: function(orderId, newStatus) {
        if (OrderManager.updateOrderStatus(orderId, newStatus)) {
            Utils.showToast('Estado da encomenda atualizado', 'success');
            this.updateStats();
        } else {
            Utils.showToast('Erro ao atualizar estado da encomenda', 'error');
        }
    },
    
    // Mostrar detalhes da encomenda
    showOrderDetails: function(orderId) {
        const order = OrderManager.getOrderById(orderId);
        if (!order) return;
        
        const modal = document.getElementById('orderModal');
        const modalTitle = document.getElementById('orderModalTitle');
        const modalBody = document.getElementById('orderModalBody');
        
        if (!modal || !modalTitle || !modalBody) return;
        
        modalTitle.textContent = `Encomenda #${order.id}`;
        
        const formattedOrder = OrderManager.formatOrderForDisplay(order);
        
        modalBody.innerHTML = `
            <div class="order-detail">
                <div class="order-info">
                    <h4>Informações do Cliente</h4>
                    <p><strong>Nome:</strong> ${order.customerInfo.name}</p>
                    <p><strong>Email:</strong> ${order.customerInfo.email}</p>
                    <p><strong>Telefone:</strong> ${order.customerInfo.phone}</p>
                    <p><strong>Morada:</strong> ${order.customerInfo.address}</p>
                </div>
                
                <div class="order-items">
                    <h4>Itens da Encomenda</h4>
                    <div class="items-list">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span class="item-name">${item.name}</span>
                                <span class="item-quantity">x${item.quantity}</span>
                                <span class="item-price">${Utils.formatPrice(item.price * item.quantity)} MT</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="order-summary">
                    <h4>Resumo da Encomenda</h4>
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>${Utils.formatPrice(order.subtotal)} MT</span>
                    </div>
                    <div class="summary-row">
                        <span>Imposto:</span>
                        <span>${Utils.formatPrice(order.tax)} MT</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>${Utils.formatPrice(order.total)} MT</span>
                    </div>
                </div>
                
                <div class="order-meta">
                    <p><strong>Data da Encomenda:</strong> ${formattedOrder.orderDate}</p>
                    <p><strong>Estado:</strong> ${formattedOrder.statusText}</p>
                    <p><strong>Tempo Estimado:</strong> ${order.estimatedTime} minutos</p>
                </div>
            </div>
        `;
        
        this.showModal(modal);
    },
    
    // Notificar cliente
    notifyCustomer: function(orderId) {
        const order = OrderManager.getOrderById(orderId);
        if (!order) return;
        
        const statusMessages = {
            'pending': 'foi recebida e está a ser processada',
            'confirmed': 'foi confirmada',
            'preparing': 'está a ser preparada',
            'ready': 'está pronta para recolha',
            'completed': 'foi concluída'
        };
        
        const message = `A sua encomenda #${orderId} ${statusMessages[order.status] || 'foi atualizada'}. Obrigado por escolher a Padaria Crosta Dourada!`;
        OrderManager.sendOrderNotification(orderId, message);
    },
    
    // Filtrar encomendas
    filterOrders: function(status) {
        const orders = status ? OrderManager.getOrdersByStatus(status) : OrderManager.getAllOrders();
        this.renderFilteredOrders(orders);
    },
    
    // Filtrar encomendas por data
    filterOrdersByDate: function(date) {
        const orders = OrderManager.getAllOrders().filter(order => {
            const orderDate = new Date(order.orderDate).toDateString();
            const filterDate = new Date(date).toDateString();
            return orderDate === filterDate;
        });
        this.renderFilteredOrders(orders);
    },
    
    // Renderizar encomendas filtradas
    renderFilteredOrders: function(orders) {
        const ordersTable = document.getElementById('ordersTable');
        if (!ordersTable) return;
        
        // Similar ao loadOrders mas com dados filtrados
        let tableHTML = `
            <div class="table-header">
                <div>ID Encomenda</div>
                <div>Cliente</div>
                <div>Itens</div>
                <div>Total</div>
                <div>Estado</div>
                <div>Ações</div>
            </div>
        `;
        
        orders.forEach(order => {
            const formattedOrder = OrderManager.formatOrderForDisplay(order);
            tableHTML += `
                <div class="table-row">
                    <div>#${formattedOrder.id}</div>
                    <div>${formattedOrder.customerInfo.name}</div>
                    <div>${Utils.truncateText(formattedOrder.itemsText, 30)}</div>
                    <div>${formattedOrder.formattedTotal} MT</div>
                    <div>
                        <select class="status-select" data-order-id="${formattedOrder.id}">
                            <option value="pending" ${formattedOrder.status === 'pending' ? 'selected' : ''}>Pendente</option>
                            <option value="confirmed" ${formattedOrder.status === 'confirmed' ? 'selected' : ''}>Confirmado</option>
                            <option value="preparing" ${formattedOrder.status === 'preparing' ? 'selected' : ''}>A Preparar</option>
                            <option value="ready" ${formattedOrder.status === 'ready' ? 'selected' : ''}>Pronto</option>
                            <option value="completed" ${formattedOrder.status === 'completed' ? 'selected' : ''}>Concluído</option>
                        </select>
                    </div>
                    <div class="table-actions">
                        <button class="btn btn-primary btn-sm view-order" data-order-id="${formattedOrder.id}">Ver</button>
                        <button class="btn btn-secondary btn-sm notify-customer" data-order-id="${formattedOrder.id}">Notificar</button>
                    </div>
                </div>
            `;
        });
        
        ordersTable.innerHTML = tableHTML;
        this.attachOrderEventListeners();
    },
    
    // Carregar produtos
    loadProducts: function() {
        const productsTable = document.getElementById('productsTable');
        if (!productsTable) return;
        
        const products = ProductCatalog.getProducts();
        
        let tableHTML = `
            <div class="table-header">
                <div>Produto</div>
                <div>Categoria</div>
                <div>Preço</div>
                <div>Stock</div>
                <div>Ações</div>
            </div>
        `;
        
        products.forEach(product => {
            const stockClass = product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : '';
            const availabilityText = product.available ? 'Disponível' : 'Indisponível';
            
            tableHTML += `
                <div class="table-row">
                    <div>
                        ${product.name}
                        ${!product.available ? '<span class="unavailable-badge">Indisponível</span>' : ''}
                    </div>
                    <div>${Utils.capitalize(product.category)}</div>
                    <div>${Utils.formatPrice(product.price)} MT</div>
                    <div class="stock-${stockClass}">${product.stock}</div>
                    <div class="table-actions">
                        <button class="btn btn-primary btn-sm edit-product" data-product-id="${product.id}">Editar</button>
                        <button class="btn btn-secondary btn-sm toggle-product" data-product-id="${product.id}">
                            ${product.available ? 'Desativar' : 'Ativar'}
                        </button>
                    </div>
                </div>
            `;
        });
        
        productsTable.innerHTML = tableHTML;
        
        // Adicionar event listeners
        this.attachProductEventListeners();
    },
    
    // Anexar event listeners dos produtos
    attachProductEventListeners: function() {
        // Botões editar produto
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.showEditProductModal(productId);
            });
        });
        
        // Toggle disponibilidade do produto
        document.querySelectorAll('.toggle-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.toggleProductAvailability(productId);
            });
        });
    },
    
    // Mostrar modal adicionar produto
    showAddProductModal: function() {
        const modal = document.getElementById('productModal');
        const modalTitle = document.getElementById('modalTitle');
        const productForm = document.getElementById('productForm');
        
        if (!modal || !modalTitle || !productForm) return;
        
        modalTitle.textContent = 'Adicionar Novo Produto';
        productForm.reset();
        productForm.dataset.mode = 'add';
        
        this.showModal(modal);
    },
    
    // Mostrar modal editar produto
    showEditProductModal: function(productId) {
        const product = ProductCatalog.getProductById(productId);
        if (!product) return;
        
        const modal = document.getElementById('productModal');
        const modalTitle = document.getElementById('modalTitle');
        const productForm = document.getElementById('productForm');
        
        if (!modal || !modalTitle || !productForm) return;
        
        modalTitle.textContent = 'Editar Produto';
        productForm.dataset.mode = 'edit';
        productForm.dataset.productId = productId;
        
        // Preencher formulário com dados do produto
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productIngredients').value = product.ingredients.join(', ');
        
        // Definir opções dietéticas
        const dietarySelect = document.getElementById('productDietary');
        Array.from(dietarySelect.options).forEach(option => {
            option.selected = product.dietary.includes(option.value);
        });
        
        this.showModal(modal);
    },
    
    // Lidar com submissão do formulário de produto
    handleProductSubmit: function(e) {
        const formData = new FormData(e.target);
        const form = e.target;
        
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            description: formData.get('description'),
            ingredients: formData.get('ingredients').split(',').map(i => i.trim()),
            dietary: Array.from(form.querySelectorAll('#productDietary option:checked')).map(option => option.value),
            image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400" // Imagem padrão
        };
        
        // Validar dados
        if (!productData.name || !productData.category || productData.price <= 0 || productData.stock < 0) {
            Utils.showToast('Por favor, preencha todos os campos obrigatórios corretamente', 'error');
            return;
        }
        
        const mode = form.dataset.mode;
        const productId = form.dataset.productId;
        
        if (mode === 'add') {
            ProductCatalog.addProduct(productData);
            Utils.showToast('Produto adicionado com sucesso!', 'success');
        } else if (mode === 'edit') {
            ProductCatalog.updateProduct(parseInt(productId), productData);
            Utils.showToast('Produto atualizado com sucesso!', 'success');
        }
        
        this.hideModals();
        this.loadProducts();
        this.loadInventory();
    },
    
    // Toggle disponibilidade do produto
    toggleProductAvailability: function(productId) {
        const product = ProductCatalog.getProductById(productId);
        if (!product) return;
        
        ProductCatalog.updateProduct(productId, { available: !product.available });
        Utils.showToast(`Produto ${product.available ? 'desativado' : 'ativado'}`, 'success');
        this.loadProducts();
    },
    
    // Carregar inventário
    loadInventory: function() {
        const inventoryGrid = document.getElementById('inventoryGrid');
        if (!inventoryGrid) return;
        
        const products = ProductCatalog.getProducts();
        
        let inventoryHTML = '';
        products.forEach(product => {
            const stockClass = product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : '';
            
            inventoryHTML += `
                <div class="inventory-card">
                    <h4>${product.name}</h4>
                    <div class="stock-level">
                        <span>Stock:</span>
                        <span class="stock-number ${stockClass}">${product.stock}</span>
                    </div>
                    <div class="availability-status">
                        <span>Estado:</span>
                        <span class="${product.available ? 'available' : 'unavailable'}">
                            ${product.available ? 'Disponível' : 'Indisponível'}
                        </span>
                    </div>
                    ${!product.available && product.unavailableReason ? 
                        `<div class="unavailable-reason">
                            <small>Motivo: ${product.unavailableReason}</small>
                        </div>` : ''
                    }
                    <div class="stock-controls">
                        <input type="number" class="stock-input" value="${product.stock}" min="0" data-product-id="${product.id}">
                        <button class="btn btn-primary btn-sm update-stock" data-product-id="${product.id}">Atualizar</button>
                    </div>
                </div>
            `;
        });
        
        inventoryGrid.innerHTML = inventoryHTML;
        
        // Adicionar event listeners
        this.attachInventoryEventListeners();
    },
    
    // Anexar event listeners do inventário
    attachInventoryEventListeners: function() {
        document.querySelectorAll('.update-stock').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const input = document.querySelector(`input[data-product-id="${productId}"]`);
                const newStock = parseInt(input.value);
                
                if (newStock >= 0) {
                    ProductCatalog.updateProductStock(productId, newStock);
                    Utils.showToast('Stock atualizado', 'success');
                    this.loadInventory();
                    this.updateStats();
                } else {
                    Utils.showToast('Valor de stock inválido', 'error');
                }
            });
        });
    },
    
    // Atualizar todo o stock
    updateAllStock: function() {
        const products = ProductCatalog.getProducts();
        const updates = [];
        
        document.querySelectorAll('.stock-input').forEach(input => {
            const productId = parseInt(input.dataset.productId);
            const newStock = parseInt(input.value);
            
            if (newStock >= 0) {
                updates.push({ productId, newStock });
            }
        });
        
        updates.forEach(update => {
            ProductCatalog.updateProductStock(update.productId, update.newStock);
        });
        
        Utils.showToast(`Stock atualizado para ${updates.length} produtos`, 'success');
        this.loadInventory();
        this.updateStats();
    },
    
    // Carregar análises
    loadAnalytics: function() {
        const popularProductsChart = document.getElementById('popularProductsChart');
        const analyticsSummary = document.getElementById('analyticsSummary');
        
        if (!popularProductsChart || !analyticsSummary) return;
        
        // Obter produtos populares
        const popularProducts = OrderManager.getPopularProducts().slice(0, 5);
        
        // Representação simples de gráfico
        let chartHTML = '<div class="chart-bars">';
        if (popularProducts.length > 0) {
            popularProducts.forEach(item => {
                const percentage = (item.count / popularProducts[0].count) * 100;
                chartHTML += `
                    <div class="chart-bar">
                        <div class="bar-label">${item.product.name}</div>
                        <div class="bar-container">
                            <div class="bar-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="bar-value">${item.count}</div>
                    </div>
                `;
            });
        } else {
            chartHTML += '<p>Nenhum dado disponível</p>';
        }
        chartHTML += '</div>';
        
        popularProductsChart.innerHTML = chartHTML;
        
        // Resumo das análises
        const stats = OrderManager.getOrderStats();
        const summaryHTML = `
            <div class="summary-stat">
                <div class="summary-stat-label">Total de Encomendas</div>
                <div class="summary-stat-value">${stats.totalOrders}</div>
            </div>
            <div class="summary-stat">
                <div class="summary-stat-label">Receita Total</div>
                <div class="summary-stat-value">${Utils.formatPrice(stats.totalRevenue)} MT</div>
            </div>
            <div class="summary-stat">
                <div class="summary-stat-label">Encomenda Média</div>
                <div class="summary-stat-value">${Utils.formatPrice(stats.averageOrderValue)} MT</div>
            </div>
            <div class="summary-stat">
                <div class="summary-stat-label">Receita de Hoje</div>
                <div class="summary-stat-value">${Utils.formatPrice(stats.todayRevenue)} MT</div>
            </div>
        `;
        
        analyticsSummary.innerHTML = summaryHTML;
    },
    
    // Mostrar modal
    showModal: function(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    // Esconder modais
    hideModals: function() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    },
    
    // Exportar dados
    exportData: function(type) {
        let data, filename;
        
        switch (type) {
            case 'orders':
                data = OrderManager.exportOrders('csv');
                filename = 'encomendas.csv';
                break;
            case 'products':
                data = JSON.stringify(ProductCatalog.getProducts(), null, 2);
                filename = 'produtos.json';
                break;
            default:
                return;
        }
        
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// Inicializar quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    AdminDashboard.init();
});

// Exportar para acesso global
window.AdminDashboard = AdminDashboard;