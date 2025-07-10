@@ .. @@
                customerInfo: {
                    id: 1,
                    name: 'João Silva',
                    email: 'joao@exemplo.com',
                    phone: '+258 84 123-4567',
                    address: 'Rua das Flores, 123, Maputo, Moçambique'
                },
                items: [
                    { productId: 1, name: 'Pão Caseiro Tradicional', quantity: 2, price: 25 },
                    { productId: 3, name: 'Pão Francês Moçambicano', quantity: 1, price: 15 }
                ],
                subtotal: 65,
                tax: 11.05,
                total: 76.05,
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
                    { productId: 7, name: 'Pão com Chocolate', quantity: 1, price: 45 },
                    { productId: 9, name: 'Pão com Ervas Locais', quantity: 1, price: 32 }
                ],
                subtotal: 77,
                tax: 13.09,
                total: 90.09,
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
                    { productId: 2, name: 'Pão Integral Moçambicano', quantity: 1, price: 30 },
                    { productId: 4, name: 'Pão Doce Moçambicano', quantity: 2, price: 35 }
                ],
                subtotal: 100,
                tax: 17.00,
                total: 117.00,
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
                    { productId: 13, name: 'Pão de Abóbora Moçambicano', quantity: 1, price: 42 },
                    { productId: 12, name: 'Biscoitos Doces da Casa', quantity: 3, price: 18 }
                ],
                subtotal: 96,
                tax: 16.32,
                total: 112.32,
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
                    { productId: 15, name: 'Pães Redondos Especiais', quantity: 6, price: 22 },
                    { productId: 11, name: 'Pãezinhos Tradicionais', quantity: 4, price: 12 }
                ],
                subtotal: 180,
                tax: 30.60,
                total: 210.60,
                status: 'confirmed',
                orderDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                estimatedTime: 25,
                orderType: 'pickup'
            }