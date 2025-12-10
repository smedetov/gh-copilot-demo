import { test, expect } from '@playwright/test'

test.describe('Album Cart Feature', () => {
  test('should add album to cart and verify in cart panel', async ({ page }) => {
    // Step 1: Open the Album App
    await test.step('Open the Album App', async () => {
      await page.goto('http://localhost:3001')
      await page.waitForLoadState('networkidle')
      
      // Verify the page loaded correctly
      await expect(page.locator('h1')).toContainText('Album Collection')
      console.log('✓ Step 1: Successfully opened the Album App')
    })

    // Step 2: Click on the Add to cart button on the first album tile
    await test.step('Click Add to cart on the first album', async () => {
      // Wait for albums to load
      await page.waitForSelector('.album-card', { timeout: 10000 })
      
      // Get the first album card
      const firstAlbumCard = page.locator('.album-card').first()
      await expect(firstAlbumCard).toBeVisible()
      
      // Get album details before adding to cart
      const albumTitle = await firstAlbumCard.locator('.album-title').textContent()
      const albumArtist = await firstAlbumCard.locator('.album-artist').textContent()
      console.log(`Found first album: "${albumTitle}" by ${albumArtist}`)
      
      // Click the "Add to Cart" button
      const addToCartButton = firstAlbumCard.locator('.btn-primary')
      await expect(addToCartButton).toContainText('Add to Cart')
      await addToCartButton.click()
      
      // Verify button state changed
      await expect(addToCartButton).toContainText('In Cart')
      console.log('✓ Step 2: Successfully clicked Add to Cart on the first album')
    })

    // Step 3: Click on the cart button on the top right to display the cart
    await test.step('Click the cart icon to open cart panel', async () => {
      // Verify cart badge shows 1 item
      const cartBadge = page.locator('.cart-badge')
      await expect(cartBadge).toBeVisible()
      await expect(cartBadge).toHaveText('1')
      console.log('✓ Cart badge shows 1 item')
      
      // Click the cart icon
      const cartIcon = page.locator('.cart-icon')
      await cartIcon.click()
      
      // Wait for cart panel to appear
      await page.waitForSelector('.cart-panel', { state: 'visible' })
      await expect(page.locator('.cart-panel')).toBeVisible()
      console.log('✓ Step 3: Successfully opened the cart panel')
    })

    // Step 4: Check that the cart contains the added album
    await test.step('Verify cart contains the added album', async () => {
      // Check cart header
      await expect(page.locator('.cart-header h2')).toContainText('Shopping Cart')
      
      // Verify cart has items
      const cartItems = page.locator('.cart-item')
      await expect(cartItems).toHaveCount(1)
      
      // Verify the first album details are in the cart
      const cartItem = cartItems.first()
      await expect(cartItem.locator('.item-details h3')).toBeVisible()
      
      // Check quantity is 1
      const quantity = cartItem.locator('.quantity')
      await expect(quantity).toHaveText('1')
      
      // Check total is displayed
      const totalPrice = page.locator('.total-price')
      await expect(totalPrice).toBeVisible()
      
      const totalText = await totalPrice.textContent()
      console.log(`✓ Step 4: Cart verified - contains 1 album with total: ${totalText}`)
    })

    // Step 5: Take a screenshot of the cart
    await test.step('Take a screenshot of the cart', async () => {
      await page.screenshot({ 
        path: 'e2e/screenshots/cart-with-album.png',
        fullPage: true 
      })
      console.log('✓ Step 5: Screenshot saved to e2e/screenshots/cart-with-album.png')
    })
  })
})
