orders = [
             {
                 id: 1001,
                 orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                 items: [
                    { name: 'Pão Caseiro Tradicional', quantity: 2, price: 25 },
                    { name: 'Pão Francês Moçambicano', quantity: 1, price: 15 }
                 ],
                total: 65,
                status: 'completed'
            },
            {
                id: 1002,
                orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { name: 'Pão com Chocolate', quantity: 1, price: 45 },
                    { name: 'Pão com Ervas Locais', quantity: 1, price: 32 }
                ],
                total: 77,
                status: 'completed'
            }
]