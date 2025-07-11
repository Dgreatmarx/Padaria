// Funcionalidade do carrinho de compras

const CartManager = {
    // Array de itens do carrinho
    items: [],
    
    // Taxa de imposto (17%)
    taxRate: 0.17,
    
    // Modo revendedor
    isResellerMode: false,
    
    // Inicializar carrinho
    init: function() {
        this.loadFromStorage();
        this.loadResellerMode();
        this.setupEventListeners();
        this.updateCartDisplay();
    },
    
    // Configurar event listeners
    setupEventListeners: function() {
        // Botão toggle do carrinho
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => {
                this.toggleCart();
            });
        }
        
        // Botão fechar carrinho
        const cartClose = document.getElementById('cartClose');
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                this.hideCart();
            });
        }
        
        // Sobreposição do carrinho
        const cartOverlay = document.getElementById('cartOverlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                this.hideCart();
            });
        }
        
        // Botão finalizar compra
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
        
        // Tecla ESC para fechar carrinho
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideCart();
            }
        });
    },
    
    // Adicionar item ao carrinho
    addItem: function(productId, quantity = 1, useResellerPrice = false) {
        const product = ProductCatalog.getProductById(productId);
        if (!product || !product.available || product.stock === 0) {
            Utils.showToast('Produto não disponível', 'error');
            return false;
        }
        
        const existingItem = this.items.find(item => item.productId === productId);
        const price = useResellerPrice ? product.resellerPrice : product.price;
        
        if (existingItem) {
            // Atualizar quantidade se item já existe
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock) {
                Utils.showToast(`Apenas ${product.stock} itens disponíveis`, 'warning');
                return false;
            }
            existingItem.quantity = newQuantity;
            existingItem.price = price; // Atualizar preço caso modo revendedor tenha mudado
        } else {
            // Adicionar novo item
            if (quantity > product.stock) {
                Utils.showToast(`Apenas ${product.stock} itens disponíveis`, 'warning');
                return false;
            }
            
            this.items.push({
                productId: productId,
                quantity: quantity,
                price: price,
                name: product.name,
                image: product.image,
                isResellerPrice: useResellerPrice
            });
        }
        
        this.saveToStorage();
        this.updateCartDisplay();
        return true;
    },
    
    // Remover item do carrinho
    removeItem: function(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.saveToStorage();
        this.updateCartDisplay();
        Utils.showToast('Item removido do carrinho', 'info');
    },
    
    // Atualizar quantidade do item
    updateQuantity: function(productId, newQuantity) {
        const item = this.items.find(item => item.productId === productId);
        if (!item) return;
        
        const product = ProductCatalog.getProductById(productId);
        if (!product) return;
        
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }
        
        if (newQuantity > product.stock) {
            Utils.showToast(`Apenas ${product.stock} itens disponíveis`, 'warning');
            return;
        }
        
        item.quantity = newQuantity;
        this.saveToStorage();
        this.updateCartDisplay();
    },
    
    // Obter total do carrinho
    getTotal: function() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // Obter subtotal do carrinho
    getSubtotal: function() {
        return this.getTotal();
    },
    
    // Obter valor do imposto
    getTax: function() {
        return this.getSubtotal() * this.taxRate;
    },
    
    // Obter total final com imposto
    getFinalTotal: function() {
        return this.getSubtotal() + this.getTax();
    },
    
    // Obter contagem do carrinho
    getItemCount: function() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },
    
    // Limpar carrinho
    clearCart: function() {
        this.items = [];
        this.saveToStorage();
        this.updateCartDisplay();
        Utils.showToast('Carrinho limpo', 'info');
    },
    
    // Toggle visibilidade do carrinho
    toggleCart: function() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar && cartOverlay) {
            const isOpen = cartSidebar.classList.contains('open');
            
            if (isOpen) {
                this.hideCart();
            } else {
                this.showCart();
            }
        }
    },
    
    // Mostrar carrinho
    showCart: function() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    // Esconder carrinho
    hideCart: function() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    // Atualizar exibição do carrinho
    updateCartDisplay: function() {
        this.updateCartCount();
        this.updateCartContent();
        this.updateCartTotal();
    },
    
    // Atualizar badge de contagem do carrinho
    updateCartCount: function() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const count = this.getItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
    },
    
    // Atualizar conteúdo do carrinho
    updateCartContent: function() {
        const cartContent = document.getElementById('cartContent');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartFooter = document.getElementById('cartFooter');
        
        if (!cartContent) return;
        
        if (this.items.length === 0) {
            cartContent.innerHTML = `
                <div class="cart-empty">
                    <p>O seu carrinho está vazio</p>
                    <a href="products.html" class="btn btn-primary">Começar a Comprar</a>
                </div>
            `;
            if (cartFooter) cartFooter.style.display = 'none';
            return;
        }
        
        if (cartFooter) cartFooter.style.display = 'block';
        
        let cartHTML = '';
        this.items.forEach(item => {
            cartHTML += this.createCartItemHTML(item);
        });
        
        cartContent.innerHTML = cartHTML;
        
        // Adicionar event listeners aos itens do carrinho
        this.attachCartItemListeners();
    },
    
    // Criar HTML do item do carrinho
    createCartItemHTML: function(item) {
        const totalPrice = item.price * item.quantity;
        const product = ProductCatalog.getProductById(item.productId);
        const originalPrice = product ? product.price : item.price;
        
        const priceDisplay = item.isResellerPrice && item.price < originalPrice ?
            `<div class="cart-item-price-container">
                <div class="cart-item-price reseller-price">${Utils.formatPrice(totalPrice)} MT</div>
                <div class="cart-item-original-price">${Utils.formatPrice(originalPrice * item.quantity)} MT</div>
            </div>` :
            `<div class="cart-item-price">${Utils.formatPrice(totalPrice)} MT</div>`;
        
        return `
            <div class="cart-item" data-product-id="${item.productId}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    ${priceDisplay}
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn quantity-decrease" data-product-id="${item.productId}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn quantity-increase" data-product-id="${item.productId}">+</button>
                    <button class="cart-item-remove" data-product-id="${item.productId}">×</button>
                </div>
            </div>
        `;
    },
    
    // Anexar event listeners aos itens do carrinho
    attachCartItemListeners: function() {
        // Botões diminuir quantidade
        document.querySelectorAll('.quantity-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const item = this.items.find(item => item.productId === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });
        
        // Botões aumentar quantidade
        document.querySelectorAll('.quantity-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const item = this.items.find(item => item.productId === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });
        
        // Botões remover
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.removeItem(productId);
            });
        });
    },
    
    // Atualizar exibição do total do carrinho
    updateCartTotal: function() {
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            cartTotal.textContent = Utils.formatPrice(this.getTotal()).replace(' MT', '');
        }
    },
    
    // Processo de finalização de compra
    checkout: function() {
        if (this.items.length === 0) {
            Utils.showToast('O seu carrinho está vazio', 'warning');
            return;
        }
        
        // Verificar se utilizador está logado
        if (!UserManager || !UserManager.isLoggedIn()) {
            Utils.showToast('Por favor, faça login para finalizar a compra', 'warning');
            window.location.href = 'account.html';
            return;
        }
        
        // Criar encomenda
        const orderData = {
            items: [...this.items],
            subtotal: this.getSubtotal(),
            tax: this.getTax(),
            total: this.getFinalTotal(),
            customerInfo: UserManager.getCurrentUser(),
            orderDate: new Date().toISOString(),
            status: 'pending',
            isResellerOrder: this.isResellerMode
        };
        
        // Processar encomenda
        if (window.OrderManager) {
            const orderId = OrderManager.createOrder(orderData);
            if (orderId) {
                // Limpar carrinho após encomenda bem-sucedida
                this.clearCart();
                
                // Mostrar mensagem de sucesso
                Utils.showToast('Encomenda realizada com sucesso!', 'success');
                
                // Esconder carrinho
                this.hideCart();
                
                // Redirecionar para página da conta para ver encomenda
                setTimeout(() => {
                    window.location.href = 'account.html';
                }, 1500);
            } else {
                Utils.showToast('Erro ao realizar encomenda. Tente novamente.', 'error');
            }
        } else {
            // Processo de checkout simulado
            Utils.showToast('Checkout bem-sucedido! (Modo demo)', 'success');
            this.clearCart();
            this.hideCart();
        }
    },
    
    // Atualizar modo revendedor
    updateResellerMode: function(isResellerMode) {
        this.isResellerMode = isResellerMode;
        
        // Atualizar preços dos itens existentes no carrinho
        this.items.forEach(item => {
            const product = ProductCatalog.getProductById(item.productId);
            if (product) {
                item.price = isResellerMode ? product.resellerPrice : product.price;
                item.isResellerPrice = isResellerMode;
            }
        });
        
        this.saveToStorage();
        this.updateCartDisplay();
    },
    
    // Carregar modo revendedor
    loadResellerMode: function() {
        this.isResellerMode = Utils.storage.get('bakery_reseller_mode', false);
    },
    
    // Guardar carrinho no localStorage
    saveToStorage: function() {
        Utils.storage.set('bakery_cart', this.items);
        Utils.storage.set('bakery_cart_reseller_mode', this.isResellerMode);
    },
    
    // Carregar carrinho do localStorage
    loadFromStorage: function() {
        const savedCart = Utils.storage.get('bakery_cart', []);
        const savedResellerMode = Utils.storage.get('bakery_cart_reseller_mode', false);
        this.items = savedCart;
        this.isResellerMode = savedResellerMode;
    },
    
    // Obter itens do carrinho
    getItems: function() {
        return this.items;
    },
    
    // Verificar se produto está no carrinho
    hasProduct: function(productId) {
        return this.items.some(item => item.productId === productId);
    },
    
    // Obter quantidade do item para um produto
    getItemQuantity: function(productId) {
        const item = this.items.find(item => item.productId === productId);
        return item ? item.quantity : 0;
    },
    
    // Validar itens do carrinho contra dados atuais do produto
    validateCart: function() {
        let hasChanges = false;
        
        this.items = this.items.filter(item => {
            const product = ProductCatalog.getProductById(item.productId);
            
            if (!product || !product.available) {
                Utils.showToast(`${item.name} já não está disponível`, 'warning');
                hasChanges = true;
                return false;
            }
            
            if (item.quantity > product.stock) {
                item.quantity = product.stock;
                Utils.showToast(`Quantidade de ${item.name} ajustada para stock disponível`, 'warning');
                hasChanges = true;
            }
            
            // Atualizar preço se mudou
            const currentPrice = this.isResellerMode ? product.resellerPrice : product.price;
            if (item.price !== currentPrice) {
                item.price = currentPrice;
                item.isResellerPrice = this.isResellerMode;
                hasChanges = true;
            }
            
            return true;
        });
        
        if (hasChanges) {
            this.saveToStorage();
            this.updateCartDisplay();
        }
    }
};

// Inicializar carrinho quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    CartManager.init();
});

// Exportar para acesso global
window.CartManager = CartManager;