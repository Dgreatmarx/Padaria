// Funções utilitárias para a aplicação da padaria

const Utils = {
    // Formatar preço com símbolo de moeda
    formatPrice: (price) => {
        return new Intl.NumberFormat('pt-MZ', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    },

    // Formatar data para exibição
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('pt-PT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Formatar data e hora
    formatDateTime: (date) => {
        return new Date(date).toLocaleString('pt-PT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Gerar ID único
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Função debounce para pesquisa
    debounce: (func, wait) => {
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

    // Mostrar spinner de carregamento
    showLoading: () => {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'flex';
        }
    },

    // Esconder spinner de carregamento
    hideLoading: () => {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    },

    // Mostrar notificação toast
    showToast: (message, type = 'info', duration = 3000) => {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        toast.innerHTML = `
            <div class="toast-message">${message}</div>
        `;

        toastContainer.appendChild(toast);

        // Ativar animação
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Remover toast após duração
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, duration);
    },

    // Validar email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validar número de telefone
    validatePhone: (phone) => {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/\D/g, ''));
    },

    // Sanitizar HTML para prevenir XSS
    sanitizeHTML: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // Truncar texto
    truncateText: (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    },

    // Capitalizar primeira letra
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Helpers do localStorage
    storage: {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('Erro ao guardar no localStorage:', error);
            }
        },

        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Erro ao ler do localStorage:', error);
                return defaultValue;
            }
        },

        remove: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error('Erro ao remover do localStorage:', error);
            }
        },

        clear: () => {
            try {
                localStorage.clear();
            } catch (error) {
                console.error('Erro ao limpar localStorage:', error);
            }
        }
    },

    // Helpers de animação
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    fadeOut: (element, duration = 300) => {
        const startOpacity = parseFloat(element.style.opacity) || 1;
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(startOpacity - (progress / duration), 0);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    },

    // Scroll suave para elemento
    scrollTo: (element, duration = 500) => {
        const targetPosition = element.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const ease = Utils.easeInOutQuad(progress / duration);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    // Função de easing
    easeInOutQuad: (t) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },

    // Clone profundo de objeto
    deepClone: (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = Utils.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    },

    // Helpers de array
    arrayHelpers: {
        // Remover item do array
        remove: (array, item) => {
            const index = array.indexOf(item);
            if (index > -1) {
                array.splice(index, 1);
            }
            return array;
        },

        // Encontrar item no array por propriedade
        findBy: (array, property, value) => {
            return array.find(item => item[property] === value);
        },

        // Filtrar array por múltiplas propriedades
        filterBy: (array, filters) => {
            return array.filter(item => {
                return Object.keys(filters).every(key => {
                    const filterValue = filters[key];
                    const itemValue = item[key];
                    
                    if (Array.isArray(filterValue)) {
                        return filterValue.includes(itemValue);
                    }
                    
                    if (typeof filterValue === 'string') {
                        return itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
                    }
                    
                    return itemValue === filterValue;
                });
            });
        },

        // Ordenar array por propriedade
        sortBy: (array, property, direction = 'asc') => {
            return array.sort((a, b) => {
                const aValue = a[property];
                const bValue = b[property];
                
                if (direction === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
        },

        // Agrupar array por propriedade
        groupBy: (array, property) => {
            return array.reduce((groups, item) => {
                const key = item[property];
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(item);
                return groups;
            }, {});
        }
    },

    // Helpers de URL
    url: {
        // Obter parâmetro de query
        getParam: (name) => {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        },

        // Definir parâmetro de query
        setParam: (name, value) => {
            const url = new URL(window.location);
            url.searchParams.set(name, value);
            window.history.replaceState({}, '', url);
        },

        // Remover parâmetro de query
        removeParam: (name) => {
            const url = new URL(window.location);
            url.searchParams.delete(name);
            window.history.replaceState({}, '', url);
        }
    },

    // Helpers de elemento
    element: {
        // Criar elemento com atributos
        create: (tag, attributes = {}, textContent = '') => {
            const element = document.createElement(tag);
            
            Object.keys(attributes).forEach(key => {
                if (key === 'className') {
                    element.className = attributes[key];
                } else if (key === 'innerHTML') {
                    element.innerHTML = attributes[key];
                } else {
                    element.setAttribute(key, attributes[key]);
                }
            });
            
            if (textContent) {
                element.textContent = textContent;
            }
            
            return element;
        },

        // Remover todos os filhos
        clearChildren: (element) => {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        },

        // Verificar se elemento está no viewport
        isInViewport: (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Obter posição do elemento
        getPosition: (element) => {
            const rect = element.getBoundingClientRect();
            return {
                top: rect.top + window.pageYOffset,
                left: rect.left + window.pageXOffset,
                width: rect.width,
                height: rect.height
            };
        }
    },

    // Helpers de evento
    event: {
        // Adicionar event listener com limpeza automática
        on: (element, event, handler, options = {}) => {
            element.addEventListener(event, handler, options);
            return () => element.removeEventListener(event, handler, options);
        },

        // Disparar evento personalizado
        trigger: (element, eventName, data = {}) => {
            const event = new CustomEvent(eventName, {
                detail: data,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(event);
        },

        // Prevenir default e parar propagação
        stop: (event) => {
            event.preventDefault();
            event.stopPropagation();
        }
    },

    // Helpers de performance
    performance: {
        // Medir tempo de execução
        measure: (name, fn) => {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            console.log(`${name} demorou ${end - start} milissegundos`);
            return result;
        },

        // Função throttle
        throttle: (func, limit) => {
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

        // Helper de request animation frame
        raf: (callback) => {
            return requestAnimationFrame(callback);
        },

        // Cancelar animation frame
        cancelRaf: (id) => {
            cancelAnimationFrame(id);
        }
    },

    // Deteção de dispositivo
    device: {
        isMobile: () => {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },

        isTablet: () => {
            return /iPad|Android|Tablet/i.test(navigator.userAgent);
        },

        isDesktop: () => {
            return !Utils.device.isMobile() && !Utils.device.isTablet();
        },

        supportsTouch: () => {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        }
    },

    // Helpers matemáticos
    math: {
        // Número aleatório entre min e max
        random: (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        // Arredondar para casas decimais
        round: (num, decimals = 2) => {
            return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
        },

        // Limitar número entre min e max
        clamp: (num, min, max) => {
            return Math.min(Math.max(num, min), max);
        },

        // Calcular percentagem
        percentage: (value, total) => {
            return (value / total) * 100;
        }
    }
};

// Exportar para uso noutros módulos
window.Utils = Utils;