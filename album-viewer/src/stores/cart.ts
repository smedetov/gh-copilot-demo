import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Album } from '../types/album'
import type { CartItem } from '../types/cart'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])

  // Load cart from localStorage on initialization
  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        items.value = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }))
      } catch (e) {
        console.error('Failed to load cart from localStorage', e)
      }
    }
  }

  // Save cart to localStorage
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.album.price * item.quantity), 0)
  })

  const isInCart = computed(() => (albumId: number) => {
    return items.value.some(item => item.album.id === albumId)
  })

  // Actions
  const addToCart = (album: Album) => {
    const existingItem = items.value.find(item => item.album.id === album.id)
    
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        album,
        quantity: 1,
        addedAt: new Date()
      })
    }
    
    saveCart()
  }

  const removeFromCart = (albumId: number) => {
    const index = items.value.findIndex(item => item.album.id === albumId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveCart()
    }
  }

  const updateQuantity = (albumId: number, quantity: number) => {
    const item = items.value.find(item => item.album.id === albumId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(albumId)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  const clearCart = () => {
    items.value = []
    saveCart()
  }

  // Initialize cart from localStorage
  loadCart()

  return {
    items,
    itemCount,
    totalPrice,
    isInCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})
