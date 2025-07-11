// Funcionalidade de gestão de encomendas

const OrderManager = {
    // Array de encomendas
    orders: [],
    
    // Estados das encomendas
    statuses: {
        'pending': 'Pendente',
        'confirmed': 'Confirmado',
        'preparing': 'A Preparar',
        'ready': 'Pronto para Recolha',
        'completed': 'Concluído',
        'cancelled': 'Cancelado'
    },
    
    // Inicializar gestor de encomendas
    init: function() {
        this.loadFromStorage();
        this.generateMockOrders();
    },
    
    // Criar nova encomenda
    createOrder: function(orderData) {
        const order = {
            id: this.generateOrderId(),
            ...orderData,
            status: 'pending',
            orderDate: new Date().toISOString(),
            estimatedTime: this.calculateEstimatedTime(orderData.items),
            orderType: 'pickup' // Padrão para recolha
        };
        
        this.orders.push(order);
        this.saveToStorage();
        
        // Atualizar inventário
        this.updateInventory(order.items);
        
        return order.id;
    },
    
    // Gerar ID da encomenda
    generateOrderId: function() {
        const lastOrder = this.orders[this.orders.length - 1];
        return lastOrder ? lastOrder.id + 1 : 1001;
    },
    
    // Calcular tempo estimado
    calculateEstimatedTime: function(items) {
        // Tempo base + tempo por item
        const baseTime = 15; // 15 minutos base
        const timePerItem = items.reduce((total, item) => total + item.quantity, 0) * 2; // 2 minutos por item
        return baseTime + timePerItem;
    },
    
    // Atualizar inventário após encomenda
    updateInventory: function(items) {
        items.forEach(item => {
            const product = ProductCatalog.getProductById(item.productId);
            if (product) {
                ProductCatalog.updateProductStock(item.productId, product.stock - item.quantity);
            }
        });
    },
    
    // Obter encomenda por ID
    getOrderById: function(orderId) {
        return this.orders.find(order => order.id === orderId);
    },
    
    // Obter encomendas por ID do utilizador
    getUserOrders: function(userId) {
        return this.orders.filter(order => order.customerInfo && order.customerInfo.id === userId);
    },
    
    // Obter encomendas por estado
    getOrdersByStatus: function(status) {
        return this.orders.filter(order => order.status === status);
    },
    
    // Obter encomendas de hoje
    getTodayOrders: function() {
        const today = new Date().toDateString();
        return this.orders.filter(order => {
            const orderDate = new Date(order.orderDate).toDateString();
            return orderDate === today;
        });
    },
    
    // Atualizar estado da encomenda
    updateOrderStatus: function(orderId, newStatus) {
        const order = this.getOrderById(orderId);
        if (order) {
            order.status = newStatus;
            order.lastUpdated = new Date().toISOString();
            this.saveToStorage();
            return true;
        }
        return false;
    },
    
    // Obter estatísticas das encomendas
    getOrderStats: function() {
        const today = new Date().toDateString();
        const todayOrders = this.getTodayOrders();
        
        return {
            totalOrders: this.orders.length,
            todayOrders: todayOrders.length,
            pendingOrders: this.getOrdersByStatus('pending').length,
            completedOrders: this.getOrdersByStatus('completed').length,
            totalRevenue: this.orders.reduce((total, order) => total + order.total, 0),
            todayRevenue: todayOrders.reduce((total, order) => total + order.total, 0),
            averageOrderValue: this.orders.length > 0 ? this.orders.reduce((total, order) => total + order.total, 0) / this.orders.length : 0
        };
    },
    
    // Obter produtos populares
    getPopularProducts: function() {
        const productCounts = {};
        
        this.orders.forEach(order => {
            order.items.forEach(item => {
                if (productCounts[item.productId]) {
                    productCounts[item.productId] += item.quantity;
                } else {
                    productCounts[item.productId] = item.quantity;
                }
            });
        });
        
        // Converter para array e ordenar por contagem
        const popular = Object.entries(productCounts)
            .map(([productId, count]) => ({
                productId: parseInt(productId),
                count: count,
                product: ProductCatalog.getProductById(parseInt(productId))
            }))
            .filter(item => item.product)
            .sort((a, b) => b.count - a.count);
        
        return popular;
    },
    
    // Cancelar encomenda
    cancelOrder: function(orderId) {
        const order = this.getOrderById(orderId);
        if (order && order.status === 'pending') {
            order.status = 'cancelled';
            order.lastUpdated = new Date().toISOString();
            
            // Restaurar inventário
            order.items.forEach(item => {
                const product = ProductCatalog.getProductById(item.productId);
                if (product) {
                    ProductCatalog.updateProductStock(item.productId, product.stock + item.quantity);
                }
            });
            
            this.saveToStorage();
            return true;
        }
        return false;
    },
    
    // Gerar encomendas simuladas para demo
    generateMockOrders: function() {
        if (this.orders.length > 0) return; // Não gerar se encomendas já existem
        
        const mockOrders = [
            {
                id: 1001,
                customerInfo: {
                    id: 1,
                    name: 'João Silva',
                    email: 'joao@exemplo.com',
                    phone: '+258 84 123-4567',
                    address: 'Rua das Flores, 123, Maputo, Moçambique'
                },
                items: [
                    { productId: 1, name: 'Pão de Massa Azeda Artesanal', quantity: 2, price: 425 },
                    { productId: 3, name: 'Baguete Francesa Clássica', quantity: 1, price: 225 }
                ],
                subtotal: 1075,
                tax: 182.75,
                total: 1257.75,
                status: 'completed',
                orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                estimatedTime: 25,
                orderType: 'pickup'
            },
            {
                id: 1002,
                customerInfo: {
                    id: 2,
                    name: 'Maria Santos',
                    email: 'maria@exemplo.com',
                    phone: '+258 87 987-6543',
                    address: 'Avenida Julius Nyerere, 456, Maputo, Moçambique'
                },
                items: [
                    { productId: 7, name: 'Brioche com Pepitas de Chocolate', quantity: 1, price: 412 },
                    { productId: 9, name: 'Focaccia de Alecrim', quantity: 1, price: 325 }
                ],
                subtotal: 737,
                tax: 125.29,
                total: 862.29,
                status: 'ready',
                orderDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                estimatedTime: 20,
                orderType: 'pickup'
            },
            {
                id: 1003,
                customerInfo: {
                    id: 3,
                    name: 'Carlos Mendes',
                    email: 'carlos@exemplo.com',
                    phone: '+258 82 456-7890',
                    address: 'Rua da Paz, 789, Maputo, Moçambique'
                },
                items: [
                    { productId: 2, name: 'Pão Integral com Sementes', quantity: 1, price: 362 },
                    { productId: 4, name: 'Pão Doce com Canela e Passas', quantity: 2, price: 337 }
                ],
                subtotal: 1036,
                tax: 176.12,
                total: 1212.12,
                status: 'preparing',
                orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                estimatedTime: 30,
                orderType: 'pickup'
            },
            {
                id: 1004,
                customerInfo: {
                    id: 4,
                    name: 'Ana Costa',
                    email: 'ana@exemplo.com',
                    phone: '+258 85 321-6547',
                    address: 'Avenida 24 de Julho, 321, Maputo, Moçambique'
                },
                items: [
                    { productId: 13, name: 'Pão de Abóbora Vegano com Especiarias', quantity: 1, price: 437 },
                    { productId: 12, name: 'Scones de Arando e Laranja', quantity: 3, price: 212 }
                ],
                subtotal: 1073,
                tax: 182.41,
                total: 1255.41,
                status: 'pending',
                orderDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                estimatedTime: 35,
                orderType: 'pickup'
            },
            {
                id: 1005,
                customerInfo: {
                    id: 5,
                    name: 'Pedro Nunes',
                    email: 'pedro@exemplo.com',
                    phone: '+258 86 654-3210',
                    address: 'Rua dos Trabalhadores, 654, Maputo, Moçambique'
                },
                items: [
                    { productId: 15, name: 'Bagels Completos', quantity: 6, price: 125 },
                    { productId: 11, name: 'Pãezinhos de Pretzel', quantity: 4, price: 187 }
                ],
                subtotal: 1498,
                tax: 254.66,
                total: 1752.66,
                status: 'confirmed',
                orderDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                estimatedTime: 25,
                orderType: 'pickup'
            }
        ];
        
        this.orders = mockOrders;
        this.saveToStorage();
    },
    
    // Obter encomendas para exibição (ordenadas por data)
    getOrdersForDisplay: function() {
        return [...this.orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    },
    
    // Formatar encomenda para exibição
    formatOrderForDisplay: function(order) {
        return {
            ...order,
            orderDate: Utils.formatDateTime(order.orderDate),
            statusText: this.statuses[order.status] || order.status,
            formattedTotal: Utils.formatPrice(order.total),
            itemsText: order.items.map(item => `${item.name} x${item.quantity}`).join(', ')
        };
    },
    
    // Obter resumo da encomenda
    getOrderSummary: function(orderId) {
        const order = this.getOrderById(orderId);
        if (!order) return null;
        
        return {
            id: order.id,
            customerName: order.customerInfo.name,
            customerPhone: order.customerInfo.phone,
            items: order.items,
            total: order.total,
            status: order.status,
            orderDate: order.orderDate,
            estimatedTime: order.estimatedTime,
            orderType: order.orderType
        };
    },
    
    // Enviar notificação da encomenda (simulado)
    sendOrderNotification: function(orderId, message) {
        const order = this.getOrderById(orderId);
        if (order) {
            // Notificação simulada - numa app real, isto enviaria SMS/email
            console.log(`Notificação enviada para ${order.customerInfo.name}: ${message}`);
            Utils.showToast(`Notificação enviada para ${order.customerInfo.name}`, 'success');
        }
    },
    
    // Obter horários disponíveis para agendamento de encomendas
    getAvailableTimeSlots: function(date = new Date()) {
        const slots = [];
        const startHour = 8; // 8h
        const endHour = 18; // 18h
        const interval = 30; // 30 minutos
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += interval) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push(time);
            }
        }
        
        return slots;
    },
    
    // Calcular prioridade da encomenda
    calculateOrderPriority: function(order) {
        const now = new Date();
        const orderDate = new Date(order.orderDate);
        const hoursAgo = (now - orderDate) / (1000 * 60 * 60);
        
        // Prioridade baseada na idade da encomenda e estado
        if (order.status === 'pending' && hoursAgo > 2) return 'high';
        if (order.status === 'preparing' && hoursAgo > 1) return 'medium';
        return 'normal';
    },
    
    // Guardar no localStorage
    saveToStorage: function() {
        Utils.storage.set('bakery_orders', this.orders);
    },
    
    // Carregar do localStorage
    loadFromStorage: function() {
        const savedOrders = Utils.storage.get('bakery_orders', []);
        this.orders = savedOrders;
    },
    
    // Obter todas as encomendas
    getAllOrders: function() {
        return this.orders;
    },
    
    // Exportar encomendas (para admin)
    exportOrders: function(format = 'json') {
        const data = this.orders.map(order => this.formatOrderForDisplay(order));
        
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            const headers = ['ID', 'Cliente', 'Itens', 'Total', 'Estado', 'Data'];
            const rows = data.map(order => [
                order.id,
                order.customerInfo.name,
                order.itemsText,
                order.total,
                order.statusText,
                order.orderDate
            ]);
            
            return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
        
        return data;
    }
};

// Inicializar quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    OrderManager.init();
});

// Exportar para acesso global
window.OrderManager = OrderManager;