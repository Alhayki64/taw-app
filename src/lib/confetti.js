import confetti from 'canvas-confetti'

export function fireTierUpConfetti() {
  const count = 200
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 }

  confetti({ ...defaults, particleCount: count * 0.25, spread: 26, startVelocity: 55 })
  confetti({ ...defaults, particleCount: count * 0.2, spread: 60 })
  confetti({ ...defaults, particleCount: count * 0.35, spread: 100, decay: 0.91, scalar: 0.8 })
  confetti({ ...defaults, particleCount: count * 0.1, spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  confetti({ ...defaults, particleCount: count * 0.1, spread: 120, startVelocity: 45 })
}

// Lighter burst fired when the app tour completes — green-tinted to match the brand
export function fireTourCompleteConfetti() {
  const defaults = {
    zIndex: 999999,
    colors: ['#4edea3', '#2D5A3D', '#C9A961', '#ffffff', '#86efac'],
  }
  confetti({ ...defaults, particleCount: 60,  spread: 70,  origin: { x: 0.2, y: 0.6 }, startVelocity: 45 })
  confetti({ ...defaults, particleCount: 60,  spread: 70,  origin: { x: 0.8, y: 0.6 }, startVelocity: 45 })
  confetti({ ...defaults, particleCount: 40,  spread: 100, origin: { x: 0.5, y: 0.5 }, startVelocity: 30, scalar: 0.8 })
}
