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
