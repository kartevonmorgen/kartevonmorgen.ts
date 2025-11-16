/**
 * Handle dynamic viewport height for mobile browsers
 * This fixes issues with URL bars that appear/disappear on scroll
 */
export const updateViewportHeight = (): void => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

export const initViewportHeight = (): void => {
  // Set initial value
  updateViewportHeight()

  // Update on resize (including orientation change)
  window.addEventListener('resize', updateViewportHeight)
  
  // Update on orientation change (mobile devices)
  window.addEventListener('orientationchange', () => {
    // Small delay to ensure the browser has finished the orientation change
    setTimeout(updateViewportHeight, 100)
  })
}

export const cleanupViewportHeight = (): void => {
  window.removeEventListener('resize', updateViewportHeight)
  window.removeEventListener('orientationchange', updateViewportHeight)
}
