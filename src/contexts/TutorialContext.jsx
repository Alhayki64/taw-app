/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fireTourCompleteConfetti } from '@/lib/confetti'

const TutorialContext = createContext(undefined)

// Bump this key whenever tutorial content changes significantly so returning
// users who completed the old version will see the updated tour.
const COMPLETED_KEY = 'tawwa_tutorial_v2_completed'
const PROGRESS_KEY  = 'tawwa_tutorial_v2_progress'

const readCompleted = () => {
  try { return window.localStorage.getItem(COMPLETED_KEY) === 'true' } catch { return false }
}
const readProgress = () => {
  try { return parseInt(sessionStorage.getItem(PROGRESS_KEY) || '0', 10) } catch { return 0 }
}
const saveProgress = (index) => {
  try { sessionStorage.setItem(PROGRESS_KEY, String(index)) } catch { /* ignore */ }
}
const clearProgress = () => {
  try { sessionStorage.removeItem(PROGRESS_KEY) } catch { /* ignore */ }
}

export function TutorialProvider({ children }) {
  const [isActive, setIsActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [steps, setSteps] = useState([])
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(readCompleted)
  const isTutorialReady = true
  const navigate = useNavigate()

  const lockScroll = useCallback(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  }, [])

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }, [])

  useEffect(() => unlockScroll, [unlockScroll])

  const startTutorial = useCallback((tutorialSteps, options = {}) => {
    if (!tutorialSteps || tutorialSteps.length === 0) return

    // Restore mid-tutorial progress if no explicit index was requested
    const explicitIndex   = Number.isInteger(options.initialStepIndex) ? options.initialStepIndex : null
    const restoredIndex   = explicitIndex ?? readProgress()
    const initialStepIndex = Math.min(Math.max(restoredIndex, 0), tutorialSteps.length - 1)

    setSteps(tutorialSteps)
    setCurrentStepIndex(initialStepIndex)
    setIsActive(true)
    lockScroll()
  }, [lockScroll])

  const finishTutorial = useCallback((opts = {}) => {
    setIsActive(false)
    setCurrentStepIndex(0)
    clearProgress()

    if (!opts.reset) {
      setHasCompletedTutorial(true)
      try { window.localStorage.setItem(COMPLETED_KEY, 'true') } catch { /* ignore */ }
      fireTourCompleteConfetti()
    }
    unlockScroll()
  }, [unlockScroll])

  // resetTutorial lets users replay the tour (e.g. from Profile settings)
  const resetTutorial = useCallback(() => {
    clearProgress()
    setHasCompletedTutorial(false)
    try { window.localStorage.removeItem(COMPLETED_KEY) } catch { /* ignore */ }
  }, [])

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1
      setCurrentStepIndex(nextIndex)
      saveProgress(nextIndex)
      if (steps[nextIndex].path) navigate(steps[nextIndex].path)
    } else {
      finishTutorial()
    }
  }, [currentStepIndex, finishTutorial, steps, navigate])

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1
      setCurrentStepIndex(prevIndex)
      saveProgress(prevIndex)
      if (steps[prevIndex].path) navigate(steps[prevIndex].path)
    }
  }, [currentStepIndex, steps, navigate])

  const skipTutorial = useCallback(() => {
    finishTutorial()
  }, [finishTutorial])

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStep: steps[currentStepIndex],
        currentStepIndex,
        totalSteps: steps.length,
        hasCompletedTutorial,
        isTutorialReady,
        startTutorial,
        nextStep,
        prevStep,
        finishTutorial,
        skipTutorial,
        resetTutorial,
      }}
    >
      {children}
    </TutorialContext.Provider>
  )
}

export function useTutorial() {
  const context = useContext(TutorialContext)
  if (context === undefined) throw new Error('useTutorial must be used within a TutorialProvider')
  return context
}
