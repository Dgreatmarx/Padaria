// Gestão de produtos e funcionalidade do catálogo

const ProductCatalog = {
    // Dados de produtos simulados com nomes moçambicanos e preços reduzidos
    products: [
        {
            id: 16,
    name: "Batata Doce Fresca",
    category: "agricola",
    price: 35,
    resellerPrice: 28,
    image: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400", // batatas-doces empilhadas
    description: "Batata doce fresca cultivada localmente, rica em vitaminas e minerais.",
    ingredients: ["batata doce orgânica"],
    available: true,
    stock: 50,
    dietary: ["vegano", "sem-gluten", "sem-lactose"],
    featured: true,
    popularity: 88,
    unit: "kg"
  },
  {
    id: 17,
    name: "Milho Fresco Local",
    category: "agricola",
    price: 25,
    resellerPrice: 20,
    image: "https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=400", // espigas de milho
    description: "Milho fresco colhido na região, ideal para preparar xima e outros pratos tradicionais.",
    ingredients: ["milho fresco local"],
    available: true,
    stock: 75,
    dietary: ["vegano", "sem-gluten", "sem-lactose"],
    featured: true,
    popularity: 95,
    unit: "kg"
  },
  {
    id: 18,
    name: "Mandioca Descascada",
    category: "agricola",
    price: 30,
    resellerPrice: 24,
    image: "https://images.pexels.com/photos/7129717/pexels-photo-7129717.jpeg?auto=compress&cs=tinysrgb&w=400", // mandiocas descascadas em cesta
    description: "Mandioca fresca descascada e pronta para cozinhar, base da alimentação moçambicana.",
    ingredients: ["mandioca fresca"],
    available: true,
    stock: 40,
    dietary: ["vegano", "sem-gluten", "sem-lactose"],
    featured: true,
    popularity: 90,
    unit: "kg"
  },
  {
    id: 19,
    name: "Amendoim Torrado",
    category: "agricola",
    price: 45,
    resellerPrice: 36,
    image: "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=400", // amendoins torrados
    description: "Amendoim torrado artesanalmente, rico em proteínas e sabor tradicional.",
    ingredients: ["amendoim local torrado"],
    available: true,
    stock: 30,
    dietary: ["vegano", "sem-gluten", "sem-lactose"],
    featured: false,
    popularity: 85,
    unit: "kg"
  },
  {
    id: 20,
    name: "Feijão Nhemba",
    category: "agricola",
    price: 55,
    resellerPrice: 44,
    image: "https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=400", // feijão em saco
    description: "Feijão nhemba tradicional moçambicano, fonte excelente de proteína vegetal.",
    ingredients: ["feijão nhemba seco"],
    available: true,
    stock: 25,
    dietary: ["vegano", "sem-gluten", "sem-lactose"],
    featured: false,
    popularity: 80,
    unit: "kg"
  },
  {
    id: 21,
    name: "Mapira (Sorgo)",
    category: "agricola",
    price: 40,
    resellerPrice: 32,
    image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400", // bagas de sorgo/mapira
    description: "Mapira (sorgo) tradicional, cereal resistente à seca cultivado localmente.",
    ingredients: ["mapira (sorgo) local"],
    available: true,
    stock: 35,
    dietary: ["vegano", "sem-gluten", "sem-lactose"],
    featured: false,
    popularity: 75,
    unit: "kg"
  },
  {
    id: 22,
    name: "Abóbora Menina",
    category: "agricola",
    price: 20,
    resellerPrice: 16,
    image: "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400", // abóboras inteiras
    description: "Abóbora menina fresca, ideal para sopas e pratos tradicionais moçambicanos.",
    ingredients: ["abóbora menina fresca"],
    available: true,
    stock: 45,
    dietary: ["vegano", "sem-gluten", "sem-lactose"],
    featured: false,
    popularity: 82,
    unit: "unidade"
  },
  {
    id: 23,
    name: "Folhas de Couve",
    category: "agricola",
    price: 15,
    resellerPrice: 12,
    image: "https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=400", // folhas de couve frescas
    description: "Folhas de couve frescas cultivadas sem pesticidas, ricas em vitaminas.",
    ingredients: ["folhas de couve orgânicas"],
    available: true,
    stock: 60,
    dietary: ["vegano", "sem-gluten", "sem-lactose"],
    featured: false,
    popularity: 78,
    unit: "molho"
  }
];
    // Estado do revendedor
    isResellerMode: false,

    // Inicializar o catálogo de produtos
    init: function() {
        this.loadResellerMode();
        this.setupEventListeners();
        this.loadProducts();
    },

    // Configurar event listeners
    setupEventListeners: function() {
        // Funcionalidade de pesquisa
        const searchInput = document.getElementById('searchProducts');
        if (searchInput) {
            searchInput.addEventListener('input', 
                Utils.debounce((e) => {
                    this.currentFilters.search = e.target.value;
                    this.filterProducts();
                }, 300)
            );
        }

        // Filtro de categoria
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.filterProducts();
            });
        }

        // Filtro dietético
        const dietaryFilter = document.getElementById('dietaryFilter');
        if (dietaryFilter) {
            dietaryFilter.addEventListener('change', (e) => {
                this.currentFilters.dietary = e.target.value;
                this.filterProducts();
            });
        }

        // Filtro ordenar por
        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                this.currentFilters.sortBy = e.target.value;
                this.filterProducts();
            });
        }

        // Botão limpar filtros
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    },

    // Carregar e exibir produtos
    loadProducts: function() {
        const featuredContainer = document.getElementById('featuredProducts');
        const productsContainer = document.getElementById('productsGrid');
        
        if (featuredContainer) {
            this.renderProducts(this.getFeaturedProducts(), featuredContainer);
        }
        
        if (productsContainer) {
            this.renderProducts(this.products, productsContainer);
        }
    },

    // Carregar todos os produtos para página de produtos
    loadAllProducts: function() {
        const productsContainer = document.getElementById('productsGrid');
        if (productsContainer) {
            this.renderProducts(this.products, productsContainer);
        }
    },

    // Obter produtos em destaque
    getFeaturedProducts: function() {
        return this.products.filter(product => product.featured && product.available).slice(0, 6);
    },

    // Renderizar produtos no contentor
    renderProducts: function(products, container) {
        if (!container) return;

        Utils.element.clearChildren(container);

        if (products.length === 0) {
            this.showNoResults();
            return;
        } else {
            this.hideNoResults();
        }

        products.forEach(product => {
            const productCard = this.createProductCard(product);
            container.appendChild(productCard);
        });
    },

    // Criar cartão de produto individual
    createProductCard: function(product) {
        const card = Utils.element.create('div', {
            className: 'product-card',
            'data-product-id': product.id
        });

        const currentPrice = this.isResellerMode ? product.resellerPrice : product.price;
        const originalPrice = product.price;
        
        let stockClass = '';
        let stockText = '';
        let availabilityClass = '';
        
        if (!product.available) {
            stockClass = 'unavailable';
            stockText = `Indisponível${product.unavailableReason ? ` - ${product.unavailableReason}` : ''}`;
            availabilityClass = 'unavailable';
        } else if (product.stock === 0) {
            stockClass = 'out';
            stockText = 'Esgotado';
        } else if (product.stock <= 5) {
            stockClass = 'low';
            stockText = `Apenas ${product.stock} restantes`;
        } else {
            stockText = `${product.stock} em stock`;
        }

        const dietaryTags = product.dietary.map(diet => 
            `<span class="dietary-tag">${Utils.capitalize(diet)}</span>`
        ).join('');

        const priceDisplay = this.isResellerMode && product.available ? 
            `<div class="price-container">
                <span class="product-price reseller-price">${Utils.formatPrice(currentPrice)} MT</span>
                <span class="original-price">${Utils.formatPrice(originalPrice)} MT</span>
                <span class="discount-badge">-20%</span>
            </div>` :
            `<span class="product-price">${Utils.formatPrice(currentPrice)} MT</span>`;

        card.innerHTML = `
            <div class="product-card-inner ${availabilityClass}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-dietary">
                        ${dietaryTags}
                    </div>
                    <div class="product-meta">
                        ${priceDisplay}
                        <span class="product-stock ${stockClass}">${stockText}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-secondary view-details" data-product-id="${product.id}">
                            Ver Detalhes
                        </button>
                        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}" 
                                ${!product.available || product.stock === 0 ? 'disabled' : ''}>
                            ${!product.available ? 'Indisponível' : product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Adicionar event listeners
        const viewDetailsBtn = card.querySelector('.view-details');
        const addToCartBtn = card.querySelector('.add-to-cart');

        viewDetailsBtn.addEventListener('click', () => {
            this.showProductDetails(product.id);
        });

        if (product.available && product.stock > 0) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart(product.id);
            });
        }

        return card;
    },

    // Filtrar produtos baseado nos filtros atuais
    filterProducts: function() {
        let filteredProducts = [...this.products];

        // Aplicar filtro de pesquisa
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.ingredients.some(ingredient => 
                    ingredient.toLowerCase().includes(searchTerm)
                )
            );
        }

        // Aplicar filtro de categoria
        if (this.currentFilters.category) {
            filteredProducts = filteredProducts.filter(product => 
                product.category === this.currentFilters.category
            );
        }

        // Aplicar filtro dietético
        if (this.currentFilters.dietary) {
            filteredProducts = filteredProducts.filter(product => 
                product.dietary.includes(this.currentFilters.dietary)
            );
        }

        // Aplicar ordenação
        this.sortProducts(filteredProducts);

        // Renderizar produtos filtrados
        const container = document.getElementById('productsGrid');
        this.renderProducts(filteredProducts, container);
    },

    // Ordenar produtos baseado no critério de ordenação
    sortProducts: function(products) {
        switch (this.currentFilters.sortBy) {
            case 'name':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                products.sort((a, b) => {
                    const priceA = this.isResellerMode ? a.resellerPrice : a.price;
                    const priceB = this.isResellerMode ? b.resellerPrice : b.price;
                    return priceA - priceB;
                });
                break;
            case 'price-high':
                products.sort((a, b) => {
                    const priceA = this.isResellerMode ? a.resellerPrice : a.price;
                    const priceB = this.isResellerMode ? b.resellerPrice : b.price;
                    return priceB - priceA;
                });
                break;
            case 'popular':
                products.sort((a, b) => b.popularity - a.popularity);
                break;
            default:
                products.sort((a, b) => a.name.localeCompare(b.name));
        }
    },

    // Limpar todos os filtros
    clearFilters: function() {
        this.currentFilters = {
            search: '',
            category: '',
            dietary: '',
            sortBy: 'name'
        };

        // Resetar elementos do formulário
        const searchInput = document.getElementById('searchProducts');
        const categoryFilter = document.getElementById('categoryFilter');
        const dietaryFilter = document.getElementById('dietaryFilter');
        const sortBy = document.getElementById('sortBy');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (dietaryFilter) dietaryFilter.value = '';
        if (sortBy) sortBy.value = 'name';

        // Re-renderizar produtos
        this.loadAllProducts();
    },

    // Mostrar detalhes do produto modal
    showProductDetails: function(productId) {
        const product = this.getProductById(productId);
        if (!product) return;

        const modal = document.getElementById('productModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalTitle || !modalBody) return;

        modalTitle.textContent = product.name;

        const currentPrice = this.isResellerMode ? product.resellerPrice : product.price;
        const originalPrice = product.price;
        
        let stockClass = '';
        let stockText = '';
        
        if (!product.available) {
            stockClass = 'unavailable';
            stockText = `Indisponível${product.unavailableReason ? ` - ${product.unavailableReason}` : ''}`;
        } else if (product.stock === 0) {
            stockClass = 'out';
            stockText = 'Esgotado';
        } else if (product.stock <= 5) {
            stockClass = 'low';
            stockText = `Apenas ${product.stock} restantes`;
        } else {
            stockText = `${product.stock} em stock`;
        }

        const dietaryTags = product.dietary.map(diet => 
            `<span class="dietary-tag">${Utils.capitalize(diet)}</span>`
        ).join('');

        const priceDisplay = this.isResellerMode && product.available ? 
            `<div class="price-container">
                <div class="product-detail-price reseller-price">${Utils.formatPrice(currentPrice)} MT</div>
                <div class="original-price">${Utils.formatPrice(originalPrice)} MT</div>
                <div class="discount-info">Desconto de Revendedor: 20%</div>
            </div>` :
            `<div class="product-detail-price">${Utils.formatPrice(currentPrice)} MT</div>`;

        modalBody.innerHTML = `
            <div class="product-detail">
                <img src="${product.image}" alt="${product.name}" class="product-detail-image">
                <div class="product-detail-info">
                    ${priceDisplay}
                    <div class="product-detail-stock ${stockClass}">${stockText}</div>
                    <div class="product-detail-dietary">
                        ${dietaryTags}
                    </div>
                    <p class="product-detail-description">${product.description}</p>
                    <div class="product-detail-ingredients">
                        <h4>Ingredientes:</h4>
                        <ul>
                            ${product.ingredients.map(ingredient => 
                                `<li>${Utils.capitalize(ingredient)}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    ${product.available && product.stock > 0 ? `
                    <div class="product-detail-actions">
                        <div class="quantity-selector">
                            <label for="productQuantity">Quantidade:</label>
                            <input type="number" id="productQuantity" min="1" max="${product.stock}" value="1">
                        </div>
                        <button class="btn btn-primary add-to-cart-modal" data-product-id="${product.id}">
                            Adicionar ao Carrinho
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Adicionar event listener para botão adicionar ao carrinho
        const addToCartBtn = modalBody.querySelector('.add-to-cart-modal');
        if (addToCartBtn && product.available && product.stock > 0) {
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(document.getElementById('productQuantity').value);
                this.addToCart(product.id, quantity);
                this.hideModal();
            });
        }

        this.showModal(modal);
    },

    // Adicionar produto ao carrinho
    addToCart: function(productId, quantity = 1) {
        const product = this.getProductById(productId);
        if (!product || !product.available || product.stock === 0) return;

        // Adicionar ao carrinho via gestor do carrinho
        if (window.CartManager) {
            const success = window.CartManager.addItem(productId, quantity, this.isResellerMode);
            if (success) {
                Utils.showToast(`${product.name} adicionado ao carrinho!`, 'success');
            }
        } else {
            Utils.showToast('Sistema de carrinho não disponível', 'error');
        }
    },

    // Obter produto por ID
    getProductById: function(id) {
        return this.products.find(product => product.id === parseInt(id));
    },

    // Atualizar stock do produto
    updateProductStock: function(productId, newStock) {
        const product = this.getProductById(productId);
        if (product) {
            product.stock = newStock;
            product.available = newStock > 0;
            
            // Guardar no localStorage
            Utils.storage.set('bakery_products', this.products);
            
            // Re-renderizar produtos se necessário
            this.loadProducts();
        }
    },

    // Mostrar modal
    showModal: function(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Configurar handlers de fechar
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideModal());
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
            }
        });
    },

    // Esconder modal
    hideModal: function() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    // Mostrar mensagem de nenhum resultado
    showNoResults: function() {
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = 'block';
        }
    },

    // Esconder mensagem de nenhum resultado
    hideNoResults: function() {
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = 'none';
        }
    },

    // Ativar/desativar modo revendedor
    toggleResellerMode: function() {
        this.isResellerMode = !this.isResellerMode;
        Utils.storage.set('bakery_reseller_mode', this.isResellerMode);
        
        // Atualizar interface
        this.updateResellerInterface();
        
        // Re-renderizar produtos com novos preços
        this.loadProducts();
        
        // Atualizar carrinho se existir
        if (window.CartManager) {
            CartManager.updateResellerMode(this.isResellerMode);
        }
        
        const message = this.isResellerMode ? 
            'Modo revendedor ativado! Preços com desconto aplicados.' : 
            'Modo revendedor desativado. Preços normais aplicados.';
        Utils.showToast(message, 'success');
    },

    // Carregar modo revendedor do localStorage
    loadResellerMode: function() {
        this.isResellerMode = Utils.storage.get('bakery_reseller_mode', false);
        this.updateResellerInterface();
    },

    // Atualizar interface do revendedor
    updateResellerInterface: function() {
        const resellerToggle = document.getElementById('resellerToggle');
        const resellerStatus = document.getElementById('resellerStatus');
        
        if (resellerToggle) {
            if (this.isResellerMode) {
                resellerToggle.classList.add('active');
                resellerToggle.querySelector('.reseller-text').textContent = 'Modo Revendedor';
            } else {
                resellerToggle.classList.remove('active');
                resellerToggle.querySelector('.reseller-text').textContent = 'Sou Revendedor';
            }
        }
        
        if (resellerStatus) {
            resellerStatus.style.display = this.isResellerMode ? 'block' : 'none';
        }
    },

    // Obter produtos para admin
    getProducts: function() {
        return this.products;
    },

    // Adicionar novo produto (função admin)
    addProduct: function(productData) {
        const newProduct = {
            id: Math.max(...this.products.map(p => p.id)) + 1,
            ...productData,
            resellerPrice: Math.round(productData.price * 0.8), // 20% desconto
            available: true,
            featured: false,
            popularity: 0
        };
        
        this.products.push(newProduct);
        Utils.storage.set('bakery_products', this.products);
        
        return newProduct;
    },

    // Atualizar produto (função admin)
    updateProduct: function(productId, productData) {
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            // Calcular preço de revendedor se o preço mudou
            if (productData.price) {
                productData.resellerPrice = Math.round(productData.price * 0.8);
            }
            
            this.products[productIndex] = { ...this.products[productIndex], ...productData };
            Utils.storage.set('bakery_products', this.products);
            return this.products[productIndex];
        }
        return null;
    },

    // Eliminar produto (função admin)
    deleteProduct: function(productId) {
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            Utils.storage.set('bakery_products', this.products);
            return true;
        }
        return false;
    },

    // Carregar produtos do localStorage se disponível
    loadFromStorage: function() {
        const savedProducts = Utils.storage.get('bakery_products');
        if (savedProducts && savedProducts.length > 0) {
            this.products = savedProducts;
        }
    },

    // Guardar produtos no localStorage
    saveToStorage: function() {
        Utils.storage.set('bakery_products', this.products);
    }
};

// Inicializar quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Carregar produtos do storage primeiro
    ProductCatalog.loadFromStorage();
    
    // Inicializar se estivermos numa página que precisa de produtos
    if (document.getElementById('featuredProducts') || document.getElementById('productsGrid')) {
        ProductCatalog.init();
    }
});

// Exportar para acesso global
window.ProductCatalog = ProductCatalog;