<template>
  <button class="cart-icon" @click="toggleCart" aria-label="Shopping cart">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
    <span v-if="itemCount > 0" class="cart-badge">{{ itemCount }}</span>
  </button>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const itemCount = cartStore.itemCount

const emit = defineEmits<{
  toggleCart: []
}>()

const toggleCart = () => {
  emit('toggleCart')
}
</script>

<style scoped>
.cart-icon {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: white;
}

.cart-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cart-icon svg {
  display: block;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  padding: 2px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: pulse 0.3s ease;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
