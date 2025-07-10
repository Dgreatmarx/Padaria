// Funcionalidade de gestão de utilizadores

const UserManager = {
    // Dados do utilizador atual
    currentUser: null,
    
    // Dados de utilizadores simulados para demo
    mockUsers: [
        {
            id: 1,
            name: 'João Silva',
            email: 'joao@exemplo.com',
            phone: '+258 84 123-4567',
            address: 'Rua das Flores, 123, Maputo, Moçambique',
            loyaltyPoints: 150,
            dietary: ['vegetariano'],
            favorites: [1, 3, 6],
            joinDate: '2023-01-15'
        },
        {
            id: 2,
            name: 'Maria Santos',
            email: 'maria@exemplo.com',
            phone: '+258 87 987-6543',
            address: 'Avenida Julius Nyerere, 456, Maputo, Moçambique',
            loyaltyPoints: 275,
            dietary: ['vegano', 'sem glúten'],
            favorites: [2, 5, 13],
            joinDate: '2023-03-22'
        }
    ],
    
    // Inicializar gestão de utilizadores
    init: function() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateUserInterface();
    },
    
    // Configurar event listeners
    setupEventListeners: function() {
        // Abas de autenticação
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        
        if (loginTab) {
            loginTab.addEventListener('click', () => {
                this.showLoginForm();
            });
        }
        
        if (registerTab) {
            registerTab.addEventListener('click', () => {
                this.showRegisterForm();
            });
        }
        
        // Formulário de login
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }
        
        // Formulário de registo
        const registerForm = document.getElementById('registerFormElement');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(e);
            });
        }
        
        // Botão logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
        
        // Abas do painel
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.showDashboardTab(e.target.dataset.tab);
            });
        });
        
        // Formulário de perfil
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile(e);
            });
        }
    },
    
    // Mostrar formulário de login
    showLoginForm: function() {
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginTab) loginTab.classList.add('active');
        if (registerTab) registerTab.classList.remove('active');
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
    },
    
    // Mostrar formulário de registo
    showRegisterForm: function() {
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginTab) loginTab.classList.remove('active');
        if (registerTab) registerTab.classList.add('active');
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
    },
    
    // Lidar com login
    handleLogin: function(e) {
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Validação básica
        if (!email || !password) {
            Utils.showToast('Por favor, preencha todos os campos', 'error');
            return;
        }
        
        if (!Utils.validateEmail(email)) {
            Utils.showToast('Por favor, insira um email válido', 'error');
            return;
        }
        
        // Autenticação simulada (numa app real, isto seria do lado do servidor)
        let user = this.mockUsers.find(u => u.email === email);
        
        if (!user) {
            // Criar utilizador simulado para fins de demonstração
            user = {
                id: Date.now(),
                name: email.split('@')[0],
                email: email,
                phone: '+258 84 123-4567',
                address: 'Rua Demo, 123, Maputo, Moçambique',
                loyaltyPoints: 0,
                dietary: [],
                favorites: [],
                joinDate: new Date().toISOString()
            };
            this.mockUsers.push(user);
        }
        
        this.currentUser = user;
        this.saveToStorage();
        this.showDashboard();
        
        Utils.showToast('Login realizado com sucesso!', 'success');
    },
    
    // Lidar com registo
    handleRegister: function(e) {
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const address = formData.get('address');
        const password = formData.get('password');
        
        // Validação básica
        if (!name || !email || !phone || !address || !password) {
            Utils.showToast('Por favor, preencha todos os campos', 'error');
            return;
        }
        
        if (!Utils.validateEmail(email)) {
            Utils.showToast('Por favor, insira um email válido', 'error');
            return;
        }
        
        if (!Utils.validatePhone(phone)) {
            Utils.showToast('Por favor, insira um número de telefone válido', 'error');
            return;
        }
        
        // Verificar se utilizador já existe
        if (this.mockUsers.find(u => u.email === email)) {
            Utils.showToast('Utilizador já existe', 'error');
            return;
        }
        
        // Criar novo utilizador
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            address: address,
            loyaltyPoints: 0,
            dietary: [],
            favorites: [],
            joinDate: new Date().toISOString()
        };
        
        this.mockUsers.push(newUser);
        this.currentUser = newUser;
        this.saveToStorage();
        this.showDashboard();
        
        Utils.showToast('Registo realizado com sucesso!', 'success');
    },
    
    // Logout do utilizador
    logout: function() {
        this.currentUser = null;
        this.saveToStorage();
        this.updateUserInterface();
        Utils.showToast('Logout realizado com sucesso', 'info');
    },
    
    // Mostrar painel
    showDashboard: function() {
        const authContainer = document.getElementById('authContainer');
        const userDashboard = document.getElementById('userDashboard');
        
        if (authContainer) authContainer.style.display = 'none';
        if (userDashboard) userDashboard.style.display = 'block';
        
        this.loadUserData();
        this.loadOrderHistory();
        this.loadFavorites();
        this.updateLoyaltyDisplay();
    },
    
    // Mostrar aba do painel
    showDashboardTab: function(tabName) {
        // Atualizar botões das abas
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
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
                this.loadOrderHistory();
                break;
            case 'favorites':
                this.loadFavorites();
                break;
            case 'loyalty':
                this.updateLoyaltyDisplay();
                break;
        }
    },
    
    // Carregar dados do utilizador no formulário de perfil
    loadUserData: function() {
        if (!this.currentUser) return;
        
        const fields = {
            'profileName': this.currentUser.name,
            'profileEmail': this.currentUser.email,
            'profilePhone': this.currentUser.phone,
            'profileAddress': this.currentUser.address
        };
        
        Object.keys(fields).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = fields[fieldId] || '';
            }
        });
        
        // Carregar preferências dietéticas
        const dietarySelect = document.getElementById('profileDietary');
        if (dietarySelect && this.currentUser.dietary) {
            Array.from(dietarySelect.options).forEach(option => {
                option.selected = this.currentUser.dietary.includes(option.value);
            });
        }
    },
    
    // Atualizar perfil
    updateProfile: function(e) {
        if (!this.currentUser) return;
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const address = formData.get('address');
        
        // Validação básica
        if (!name || !email || !phone || !address) {
            Utils.showToast('Por favor, preencha todos os campos', 'error');
            return;
        }
        
        if (!Utils.validateEmail(email)) {
            Utils.showToast('Por favor, insira um email válido', 'error');
            return;
        }
        
        if (!Utils.validatePhone(phone)) {
            Utils.showToast('Por favor, insira um número de telefone válido', 'error');
            return;
        }
        
        // Atualizar dados do utilizador
        this.currentUser.name = name;
        this.currentUser.email = email;
        this.currentUser.phone = phone;
        this.currentUser.address = address;
        
        // Atualizar preferências dietéticas
        const dietarySelect = document.getElementById('profileDietary');
        if (dietarySelect) {
            this.currentUser.dietary = Array.from(dietarySelect.selectedOptions).map(option => option.value);
        }
        
        this.saveToStorage();
        Utils.showToast('Perfil atualizado com sucesso!', 'success');
    },
    
    // Carregar histórico de encomendas
    loadOrderHistory: function() {
        const ordersList = document.getElementById('ordersList');
        if (!ordersList) return;
        
        // Obter encomendas do OrderManager se disponível
        let orders = [];
        if (window.OrderManager) {
            orders = OrderManager.getUserOrders(this.currentUser.id);
        } else {
            // Encomendas simuladas para demo
            orders = this.getMockOrders();
        }
        
        if (orders.length === 0) {
            ordersList.innerHTML = '<p>Nenhuma encomenda encontrada.</p>';
            return;
        }
        
        ordersList.innerHTML = orders.map(order => this.createOrderHTML(order)).join('');
    },
    
    // Criar HTML da encomenda
    createOrderHTML: function(order) {
        const statusClass = order.status;
        const statusText = Utils.capitalize(order.status);
        
        const statusTranslations = {
            'pending': 'Pendente',
            'confirmed': 'Confirmado',
            'preparing': 'A Preparar',
            'ready': 'Pronto',
            'completed': 'Concluído',
            'cancelled': 'Cancelado'
        };
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-number">Encomenda #${order.id}</span>
                    <span class="order-status ${statusClass}">${statusTranslations[order.status] || statusText}</span>
                </div>
                <div class="order-details">
                    <div class="order-date">${Utils.formatDate(order.orderDate)}</div>
                    <div class="order-items">
                        ${order.items.slice(0, 3).map(item => 
                            `<span>${item.name} x${item.quantity}</span>`
                        ).join(', ')}
                        ${order.items.length > 3 ? `... +${order.items.length - 3} mais` : ''}
                    </div>
                </div>
                <div class="order-total">${Utils.formatPrice(order.total)} MT</div>
            </div>
        `;
    },
    
    // Obter encomendas simuladas para demo
    getMockOrders: function() {
        if (!this.currentUser) return [];
        
        return [
            {
                id: 1001,
                orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { name: 'Pão de Massa Azeda Artesanal', quantity: 2, price: 425 },
                    { name: 'Baguete Francesa Clássica', quantity: 1, price: 225 }
                ],
                total: 1075,
                status: 'completed'
            },
            {
                id: 1002,
                orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { name: 'Brioche com Pepitas de Chocolate', quantity: 1, price: 412 },
                    { name: 'Focaccia de Alecrim', quantity: 1, price: 325 }
                ],
                total: 737,
                status: 'completed'
            }
        ];
    },
    
    // Carregar favoritos
    loadFavorites: function() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        if (!favoritesGrid || !this.currentUser) return;
        
        const favoriteProducts = this.currentUser.favorites
            .map(id => ProductCatalog.getProductById(id))
            .filter(product => product);
        
        if (favoriteProducts.length === 0) {
            favoritesGrid.innerHTML = '<p>Ainda não tem produtos favoritos.</p>';
            return;
        }
        
        favoritesGrid.innerHTML = favoriteProducts.map(product => 
            this.createFavoriteHTML(product)
        ).join('');
        
        // Adicionar event listeners
        favoritesGrid.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.removeFavorite(productId);
            });
        });
    },
    
    // Criar HTML do favorito
    createFavoriteHTML: function(product) {
        return `
            <div class="favorite-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="favorite-info">
                    <h4>${product.name}</h4>
                    <p class="favorite-price">${Utils.formatPrice(product.price)} MT</p>
                    <div class="favorite-actions">
                        <button class="btn btn-primary btn-sm add-to-cart" 
                                data-product-id="${product.id}">
                            Adicionar ao Carrinho
                        </button>
                        <button class="btn btn-secondary btn-sm remove-favorite" 
                                data-product-id="${product.id}">
                            Remover
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Adicionar aos favoritos
    addToFavorites: function(productId) {
        if (!this.currentUser) return;
        
        if (!this.currentUser.favorites.includes(productId)) {
            this.currentUser.favorites.push(productId);
            this.saveToStorage();
            Utils.showToast('Adicionado aos favoritos!', 'success');
        }
    },
    
    // Remover dos favoritos
    removeFavorite: function(productId) {
        if (!this.currentUser) return;
        
        this.currentUser.favorites = this.currentUser.favorites.filter(id => id !== productId);
        this.saveToStorage();
        this.loadFavorites();
        Utils.showToast('Removido dos favoritos', 'info');
    },
    
    // Atualizar exibição de fidelidade
    updateLoyaltyDisplay: function() {
        if (!this.currentUser) return;
        
        const loyaltyPoints = document.getElementById('loyaltyPoints');
        const loyaltyProgress = document.getElementById('loyaltyProgress');
        const pointsToNext = document.getElementById('pointsToNext');
        
        if (loyaltyPoints) {
            loyaltyPoints.textContent = this.currentUser.loyaltyPoints;
        }
        
        if (loyaltyProgress && pointsToNext) {
            const currentPoints = this.currentUser.loyaltyPoints;
            const nextRewardAt = Math.ceil(currentPoints / 50) * 50;
            const progressPercent = (currentPoints % 50) / 50 * 100;
            
            loyaltyProgress.style.width = `${progressPercent}%`;
            pointsToNext.textContent = nextRewardAt - currentPoints;
        }
    },
    
    // Adicionar pontos de fidelidade
    addLoyaltyPoints: function(points) {
        if (!this.currentUser) return;
        
        this.currentUser.loyaltyPoints += points;
        this.saveToStorage();
        this.updateLoyaltyDisplay();
    },
    
    // Atualizar interface do utilizador baseado no estado de login
    updateUserInterface: function() {
        const authContainer = document.getElementById('authContainer');
        const userDashboard = document.getElementById('userDashboard');
        
        if (this.currentUser) {
            if (authContainer) authContainer.style.display = 'none';
            if (userDashboard) userDashboard.style.display = 'block';
            this.loadUserData();
            this.loadOrderHistory();
            this.loadFavorites();
            this.updateLoyaltyDisplay();
        } else {
            if (authContainer) authContainer.style.display = 'block';
            if (userDashboard) userDashboard.style.display = 'none';
        }
    },
    
    // Verificar se utilizador está logado
    isLoggedIn: function() {
        return this.currentUser !== null;
    },
    
    // Obter utilizador atual
    getCurrentUser: function() {
        return this.currentUser;
    },
    
    // Guardar no localStorage
    saveToStorage: function() {
        Utils.storage.set('bakery_current_user', this.currentUser);
        Utils.storage.set('bakery_users', this.mockUsers);
    },
    
    // Carregar do localStorage
    loadFromStorage: function() {
        this.currentUser = Utils.storage.get('bakery_current_user');
        const savedUsers = Utils.storage.get('bakery_users');
        if (savedUsers) {
            this.mockUsers = savedUsers;
        }
    }
};

// Inicializar quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    UserManager.init();
});

// Exportar para acesso global
window.UserManager = UserManager;