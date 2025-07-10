// Inicialização da aplicação principal e funcionalidade global

const BakeryApp = {
    // Inicializar a aplicação
    init: function() {
        this.setupGlobalEventListeners();
        this.initializeComponents();
        this.handlePageSpecificLogic();
        this.setupResellerSystem();
    },
    
    // Configurar event listeners globais
    setupGlobalEventListeners: function() {
        // Menu móvel toggle
        this.setupMobileMenu();
        
        // Scroll suave para links âncora
        this.setupSmoothScrolling();
        
        // Submissões de formulários
        this.setupFormSubmissions();
        
        // Atalhos de teclado globais
        this.setupKeyboardShortcuts();
        
        // Handler de redimensionamento da janela
        this.setupResizeHandler();
        
        // Handler de visibilidade da página
        this.setupVisibilityHandler();
    },
    
    // Configurar menu móvel
    setupMobileMenu: function() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
            
            // Fechar menu ao clicar nos links de navegação
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    },
    
    // Configurar scroll suave
    setupSmoothScrolling: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    Utils.scrollTo(target);
                }
            });
        });
    },
    
    // Configurar submissões de formulários
    setupFormSubmissions: function() {
        // Formulário de contacto
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e);
            });
        }
    },
    
    // Lidar com submissão do formulário de contacto
    handleContactForm: function(e) {
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Validação básica
        if (!name || !email || !message) {
            Utils.showToast('Por favor, preencha todos os campos', 'error');
            return;
        }
        
        if (!Utils.validateEmail(email)) {
            Utils.showToast('Por favor, insira um endereço de email válido', 'error');
            return;
        }
        
        // Submissão de formulário simulada
        Utils.showLoading();
        
        setTimeout(() => {
            Utils.hideLoading();
            Utils.showToast('Obrigado pela sua mensagem! Entraremos em contacto em breve.', 'success');
            e.target.reset();
        }, 1500);
    },
    
    // Configurar atalhos de teclado
    setupKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Tecla ESC para fechar modais/sobreposições
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
            
            // Ctrl/Cmd + K para abrir pesquisa (se implementado)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.focusSearch();
            }
        });
    },
    
    // Lidar com tecla escape
    handleEscapeKey: function() {
        // Fechar barra lateral do carrinho
        if (window.CartManager) {
            CartManager.hideCart();
        }
        
        // Fechar modais
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Fechar menu móvel
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (menuToggle && navMenu) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Fechar modal de revendedor
        const resellerModal = document.getElementById('resellerModal');
        if (resellerModal) {
            resellerModal.classList.remove('active');
        }
    },
    
    // Focar input de pesquisa
    focusSearch: function() {
        const searchInput = document.getElementById('searchProducts');
        if (searchInput) {
            searchInput.focus();
        }
    },
    
    // Configurar handler de redimensionamento
    setupResizeHandler: function() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    },
    
    // Lidar com redimensionamento da janela
    handleResize: function() {
        // Fechar menu móvel ao redimensionar para desktop
        if (window.innerWidth > 768) {
            const menuToggle = document.getElementById('menuToggle');
            const navMenu = document.getElementById('navMenu');
            
            if (menuToggle && navMenu) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
        
        // Atualizar largura da barra lateral do carrinho no móvel
        if (window.CartManager) {
            CartManager.updateCartDisplay();
        }
    },
    
    // Configurar handler de visibilidade da página
    setupVisibilityHandler: function() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Página está escondida
                this.onPageHidden();
            } else {
                // Página está visível
                this.onPageVisible();
            }
        });
    },
    
    // Lidar com página escondida
    onPageHidden: function() {
        // Guardar dados não guardados
        if (window.CartManager) {
            CartManager.saveToStorage();
        }
        
        if (window.UserManager) {
            UserManager.saveToStorage();
        }
    },
    
    // Lidar com página visível
    onPageVisible: function() {
        // Atualizar validação do carrinho
        if (window.CartManager) {
            CartManager.validateCart();
        }
        
        // Atualizar dados em tempo real se no painel admin
        if (window.AdminDashboard && window.AdminDashboard.currentAdmin) {
            AdminDashboard.updateStats();
        }
    },
    
    // Inicializar componentes
    initializeComponents: function() {
        // Inicializar componentes que devem estar disponíveis globalmente
        this.initializeLazyLoading();
        this.initializeIntersectionObserver();
        this.initializePerformanceMonitoring();
    },
    
    // Inicializar carregamento lazy para imagens
    initializeLazyLoading: function() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores mais antigos
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    },
    
    // Inicializar intersection observer para animações
    initializeIntersectionObserver: function() {
        if ('IntersectionObserver' in window) {
            const animateObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                animateObserver.observe(el);
            });
        }
    },
    
    // Inicializar monitorização de performance
    initializePerformanceMonitoring: function() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.entryType === 'navigation') {
                            console.log('Tempo de carregamento da página:', entry.loadEventEnd - entry.loadEventStart);
                        }
                    });
                });
                
                observer.observe({ entryTypes: ['navigation'] });
            } catch (e) {
                console.log('Monitorização de performance não suportada');
            }
        }
    },
    
    // Configurar sistema de revendedor
    setupResellerSystem: function() {
        const resellerToggle = document.getElementById('resellerToggle');
        const resellerModal = document.getElementById('resellerModal');
        const confirmResellerBtn = document.getElementById('confirmResellerBtn');
        const cancelResellerBtn = document.getElementById('cancelResellerBtn');
        const resellerModalClose = document.getElementById('resellerModalClose');
        
        if (resellerToggle) {
            resellerToggle.addEventListener('click', () => {
                if (ProductCatalog.isResellerMode) {
                    // Se já está no modo revendedor, desativar
                    ProductCatalog.toggleResellerMode();
                } else {
                    // Mostrar modal de confirmação
                    if (resellerModal) {
                        resellerModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                }
            });
        }
        
        if (confirmResellerBtn) {
            confirmResellerBtn.addEventListener('click', () => {
                ProductCatalog.toggleResellerMode();
                this.hideResellerModal();
            });
        }
        
        if (cancelResellerBtn) {
            cancelResellerBtn.addEventListener('click', () => {
                this.hideResellerModal();
            });
        }
        
        if (resellerModalClose) {
            resellerModalClose.addEventListener('click', () => {
                this.hideResellerModal();
            });
        }
        
        // Fechar modal ao clicar fora
        if (resellerModal) {
            resellerModal.addEventListener('click', (e) => {
                if (e.target === resellerModal) {
                    this.hideResellerModal();
                }
            });
        }
    },
    
    // Esconder modal de revendedor
    hideResellerModal: function() {
        const resellerModal = document.getElementById('resellerModal');
        if (resellerModal) {
            resellerModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    // Lidar com lógica específica da página
    handlePageSpecificLogic: function() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'index':
                this.initializeHomePage();
                break;
            case 'products':
                this.initializeProductsPage();
                break;
            case 'account':
                this.initializeAccountPage();
                break;
            case 'admin':
                this.initializeAdminPage();
                break;
        }
    },
    
    // Obter página atual
    getCurrentPage: function() {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1);
        
        if (page === '' || page === 'index.html') return 'index';
        if (page === 'products.html') return 'products';
        if (page === 'account.html') return 'account';
        if (page === 'admin.html') return 'admin';
        
        return 'index';
    },
    
    // Inicializar página inicial
    initializeHomePage: function() {
        // Carregar produtos em destaque
        if (window.ProductCatalog) {
            ProductCatalog.loadProducts();
        }
        
        // Inicializar animações do hero
        this.initializeHeroAnimations();
        
        // Configurar testemunhos (se implementado)
        this.setupTestimonials();
    },
    
    // Inicializar animações do hero
    initializeHeroAnimations: function() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroActions = document.querySelector('.hero-actions');
        
        if (heroTitle && heroSubtitle && heroActions) {
            setTimeout(() => {
                heroTitle.classList.add('animate-fade-in');
            }, 100);
            
            setTimeout(() => {
                heroSubtitle.classList.add('animate-fade-in');
            }, 300);
            
            setTimeout(() => {
                heroActions.classList.add('animate-fade-in');
            }, 500);
        }
    },
    
    // Configurar testemunhos
    setupTestimonials: function() {
        // Placeholder para funcionalidade de testemunhos
        // Poderia ser implementado como carrossel ou slider
    },
    
    // Inicializar página de produtos
    initializeProductsPage: function() {
        // Inicialização da página de produtos é lidada no ProductCatalog
        // Isto poderia incluir funcionalidades adicionais como:
        // - Comparação de produtos
        // - Produtos visualizados recentemente
        // - Recomendações de produtos
    },
    
    // Inicializar página da conta
    initializeAccountPage: function() {
        // Inicialização da página da conta é lidada no UserManager
        // Isto poderia incluir funcionalidades adicionais como:
        // - Gestão de livro de endereços
        // - Métodos de pagamento
        // - Preferências de notificação
    },
    
    // Inicializar página admin
    initializeAdminPage: function() {
        // Inicialização da página admin é lidada no AdminDashboard
        // Isto poderia incluir funcionalidades adicionais como:
        // - Notificações em tempo real
        // - Análises avançadas
        // - Operações em lote
    },
    
    // Funções utilitárias
    utils: {
        // Função debounce
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Função throttle
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // Verificar se elemento está no viewport
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    },
    
    // Tratamento de erros
    handleError: function(error, context = 'Desconhecido') {
        console.error(`Erro em ${context}:`, error);
        
        // Mostrar mensagem de erro amigável ao utilizador
        if (window.Utils && Utils.showToast) {
            Utils.showToast('Algo correu mal. Por favor, tente novamente.', 'error');
        }
        
        // Em produção, poderia querer enviar relatórios de erro para um serviço
        // this.reportError(error, context);
    },
    
    // Reportar erro para serviço externo (placeholder)
    reportError: function(error, context) {
        // Isto enviaria relatórios de erro para um serviço como Sentry, LogRocket, etc.
        // Por agora, apenas registamos
        console.log('Erro reportado:', { error, context, timestamp: new Date().toISOString() });
    },
    
    // Função de limpeza
    cleanup: function() {
        // Remover event listeners
        // Limpar intervalos/timeouts
        // Guardar dados no localStorage
        
        if (window.CartManager) {
            CartManager.saveToStorage();
        }
        
        if (window.UserManager) {
            UserManager.saveToStorage();
        }
    }
};

// Inicializar app quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    try {
        BakeryApp.init();
    } catch (error) {
        BakeryApp.handleError(error, 'Inicialização da App');
    }
});

// Limpeza ao descarregar página
window.addEventListener('beforeunload', function() {
    BakeryApp.cleanup();
});

// Lidar com erros não capturados
window.addEventListener('error', function(event) {
    BakeryApp.handleError(event.error, 'Erro Não Capturado');
});

// Lidar com rejeições de promise não tratadas
window.addEventListener('unhandledrejection', function(event) {
    BakeryApp.handleError(event.reason, 'Rejeição de Promise Não Tratada');
});

// Exportar para acesso global
window.BakeryApp = BakeryApp;