@@ .. @@
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
         
+        // Verificar se deve ativar modo revendedor automaticamente
+        this.checkAutoResellerMode();
+        
         this.saveToStorage();
         this.updateCartDisplay();
         return true;
     },
+    
+    // Verificar e ativar modo revendedor automaticamente se mais de 10 itens
+    checkAutoResellerMode: function() {
+        const totalItems = this.getItemCount();
+        
+        if (totalItems >= 10 && !this.isResellerMode) {
+            // Ativar modo revendedor automaticamente
+            if (window.ProductCatalog) {
+                ProductCatalog.toggleResellerMode();
+                Utils.showToast('Modo revendedor ativado automaticamente! Mais de 10 itens no carrinho.', 'success');
+            }
+        }
+    },