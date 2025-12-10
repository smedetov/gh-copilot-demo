<template>
  <Transition name="slide">
    <div v-if="isOpen" class="cart-overlay" @click="closeCart">
      <div class="cart-panel" @click.stop>
        <div class="cart-header">
          <h2>Shopping Cart</h2>
          <button class="close-button" @click="closeCart" aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div v-if="cartStore.items.length === 0" class="empty-cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>Your cart is empty</p>
          <button class="continue-shopping" @click="closeCart">Continue Shopping</button>
        </div>

        <div v-else class="cart-content">
          <div class="cart-items">
            <TransitionGroup name="list">
              <div v-for="item in cartStore.items" :key="item.album.id" class="cart-item">
                <img :src="item.album.image_url" :alt="item.album.title" class="item-image" />
                <div class="item-details">
                  <h3>{{ item.album.title }}</h3>
                  <p class="item-artist">{{ item.album.artist }}</p>
                  <div class="item-quantity">
                    <button @click="decreaseQuantity(item.album.id)" class="quantity-button" aria-label="Decrease quantity">-</button>
                    <span class="quantity">{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item.album.id)" class="quantity-button" aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <div class="item-price-section">
                  <p class="item-price">${{ (item.album.price * item.quantity).toFixed(2) }}</p>
                  <button @click="removeItem(item.album.id)" class="remove-button" aria-label="Remove from cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <div class="cart-footer">
            <div class="total">
              <span class="total-label">Total:</span>
              <span class="total-price">${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <button class="checkout-button">Proceed to Checkout</button>
            <button class="clear-cart-button" @click="clearCart">Clear Cart</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const cartStore = useCartStore()

const closeCart = () => {
  emit('close')
}

const removeItem = (albumId: number) => {
  cartStore.removeFromCart(albumId)
}

const increaseQuantity = (albumId: number) => {
  const item = cartStore.items.find(item => item.album.id === albumId)
  if (item) {
    cartStore.updateQuantity(albumId, item.quantity + 1)
  }
}

const decreaseQuantity = (albumId: number) => {
  const item = cartStore.items.find(item => item.album.id === albumId)
  if (item) {
    cartStore.updateQuantity(albumId, item.quantity - 1)
  }
}

const clearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clearCart()
  }
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.cart-panel {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cart-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: background 0.3s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #666;
}

.empty-cart svg {
  opacity: 0.3;
  margin-bottom: 24px;
}

.empty-cart p {
  font-size: 18px;
  margin-bottom: 24px;
}

.continue-shopping {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.continue-shopping:hover {
  transform: translateY(-2px);
}

.cart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-details h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.item-artist {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.quantity-button {
  width: 28px;
  height: 28px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #667eea;
  transition: all 0.3s ease;
}

.quantity-button:hover {
  background: rgba(102, 126, 234, 0.2);
}

.quantity {
  min-width: 32px;
  text-align: center;
  font-weight: 500;
  color: #333;
}

.item-price-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.item-price {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
}

.remove-button {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f44336;
  transition: all 0.3s ease;
}

.remove-button:hover {
  background: rgba(244, 67, 54, 0.2);
}

.cart-footer {
  padding: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 20px;
}

.total-label {
  font-weight: 600;
  color: #333;
}

.total-price {
  font-weight: 700;
  color: #667eea;
  font-size: 24px;
}

.checkout-button {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  margin-bottom: 12px;
}

.checkout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.clear-cart-button {
  width: 100%;
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 12px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-cart-button:hover {
  background: rgba(244, 67, 54, 0.2);
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
}

.slide-enter-from .cart-panel {
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
}

.slide-leave-to .cart-panel {
  transform: translateX(100%);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-move {
  transition: transform 0.3s ease;
}

/* Scrollbar styling */
.cart-items::-webkit-scrollbar {
  width: 8px;
}

.cart-items::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.cart-items::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 4px;
}

.cart-items::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

@media (max-width: 768px) {
  .cart-panel {
    max-width: 100%;
  }
}
</style>
