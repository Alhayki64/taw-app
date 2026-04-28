import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useTutorial } from '@/contexts/TutorialContext'
import { useLanguage } from '@/contexts/LanguageProvider'

const SPOTLIGHT_PADDING = 12
const CARD_MARGIN = 16
const CARD_MAX_WIDTH = 344
const CARD_TARGET_SPACE = 320
const CARD_FALLBACK_HEIGHT = 360
const CORNER_SIZE = 26
const CARD_STACK_ESTIMATE_TALL = 388
const CARD_STACK_ESTIMATE_COMPACT = 332

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function scrollTargetIntoView(element, placement) {
  const block =
    placement === 'above' ? 'end' : placement === 'below' ? 'start' : 'center'

  element.scrollIntoView({ behavior: 'smooth', block, inline: 'nearest' })
}

export function TutorialOverlay() {
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    prevStep,
    skipTutorial,
  } = useTutorial()
  const [targetBounds, setTargetBounds] = useState(null)
  const { language } = useLanguage()
  const isAr = language === 'ar'

  const labels = {
    back: isAr ? 'السابق' : 'Back',
    finish: isAr ? 'ابدأ!' : "Let's Go!",
    next: isAr ? 'التالي' : 'Next',
    skip: isAr ? 'تخطي' : 'Skip Tour',
    step: isAr ? 'الخطوة' : 'Step',
    title: isAr ? 'الجولة التعريفية' : 'Tutorial walkthrough',
  }

  const updateBounds = useCallback(() => {
    if (!isActive || !currentStep?.targetId) {
      setTargetBounds(null)
      return
    }

    const element = document.getElementById(currentStep.targetId)

    if (!element) {
      setTargetBounds(null)
      return
    }

    const rect = element.getBoundingClientRect()
    setTargetBounds({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })
  }, [currentStep, isActive])

  useEffect(() => {
    if (!isActive || !currentStep) return undefined

    if (!currentStep.targetId) {
      return undefined
    }

    let retryCount = 0
    const maxRetries = 20 // Approx 300-400ms

    let syncFrameId = 0
    let timerId = 0

    const findAndScroll = () => {
      const element = document.getElementById(currentStep.targetId)

      if (!element) {
        if (retryCount < maxRetries) {
          retryCount++
          syncFrameId = window.requestAnimationFrame(findAndScroll)
        } else {
          setTargetBounds(null)
        }
        return
      }

      // Element found, scroll into view and start tracking
      scrollTargetIntoView(element, currentStep.placement)

      let remainingFrames = 24

      const syncBounds = () => {
        updateBounds()
        if (remainingFrames <= 0) return
        remainingFrames -= 1
        syncFrameId = window.requestAnimationFrame(syncBounds)
      }

      timerId = window.setTimeout(syncBounds, 80)
    }

    syncFrameId = window.requestAnimationFrame(findAndScroll)

    return () => {
      window.clearTimeout(timerId)
      window.cancelAnimationFrame(syncFrameId)
    }
  }, [currentStep, isActive, updateBounds])

  useEffect(() => {
    if (!isActive) return undefined
    const initialFrame = window.requestAnimationFrame(updateBounds)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        skipTutorial()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        if (isAr) {
          prevStep()
        } else {
          nextStep()
        }
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        if (isAr) {
          nextStep()
        } else {
          prevStep()
        }
      }
    }

    window.addEventListener('resize', updateBounds)
    window.addEventListener('scroll', updateBounds, true)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(initialFrame)
      window.removeEventListener('resize', updateBounds)
      window.removeEventListener('scroll', updateBounds, true)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, isAr, nextStep, prevStep, skipTutorial, updateBounds])

  if (!isActive || !currentStep) return null

  const hole = targetBounds
    ? {
        top: targetBounds.top - SPOTLIGHT_PADDING,
        left: targetBounds.left - SPOTLIGHT_PADDING,
        width: targetBounds.width + SPOTLIGHT_PADDING * 2,
        height: targetBounds.height + SPOTLIGHT_PADDING * 2,
      }
    : null

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const cardWidth = Math.max(0, Math.min(CARD_MAX_WIDTH, viewportWidth - CARD_MARGIN * 2))
  const cardLeft = (viewportWidth - cardWidth) / 2
  const estimatedStackHeight =
    viewportHeight < 700 ? CARD_STACK_ESTIMATE_COMPACT : CARD_STACK_ESTIMATE_TALL
  const defaultTop = clamp(
    (viewportHeight - CARD_FALLBACK_HEIGHT) / 2,
    CARD_MARGIN,
    Math.max(CARD_MARGIN, viewportHeight - CARD_FALLBACK_HEIGHT - CARD_MARGIN)
  )

  let cardTop = defaultTop
  let cardPlacement = 'center'

  if (hole) {
    const spaceAbove = hole.top - CARD_MARGIN
    const spaceBelow = viewportHeight - (hole.top + hole.height) - CARD_MARGIN
    const preferredBelowTop = hole.top + hole.height + CARD_MARGIN
    const preferredAboveTop = hole.top - estimatedStackHeight - CARD_MARGIN
    const preferredPlacement =
      currentStep.placement === 'above' || currentStep.placement === 'below'
        ? currentStep.placement
        : null

    if (
      preferredPlacement === 'below' &&
      (spaceBelow >= CARD_MARGIN || spaceBelow >= spaceAbove)
    ) {
      cardTop = preferredBelowTop
      cardPlacement = 'below'
    } else if (
      preferredPlacement === 'above' &&
      (spaceAbove >= CARD_MARGIN || spaceAbove > spaceBelow)
    ) {
      cardTop = preferredAboveTop
      cardPlacement = 'above'
    } else if (spaceBelow >= CARD_TARGET_SPACE || spaceBelow >= spaceAbove) {
      cardTop = preferredBelowTop
      cardPlacement = 'below'
    } else if (spaceAbove >= estimatedStackHeight) {
      cardTop = preferredAboveTop
      cardPlacement = 'above'
    } else {
      cardTop = spaceBelow >= spaceAbove ? preferredBelowTop : preferredAboveTop
      cardPlacement = spaceBelow >= spaceAbove ? 'below' : 'above'
    }

    cardTop = clamp(
      cardTop,
      CARD_MARGIN,
      Math.max(CARD_MARGIN, viewportHeight - CARD_FALLBACK_HEIGHT - CARD_MARGIN)
    )
  }

  const mascotHeight = viewportHeight < 700 ? 96 : 136
  const bubbleMaxHeight = Math.max(180, viewportHeight - cardTop - mascotHeight - 40)
  const estimatedBubbleHeight = Math.min(290, bubbleMaxHeight)
  const stackHeight = mascotHeight + estimatedBubbleHeight + 24
  const connector = hole && cardPlacement !== 'center'
    ? (() => {
        const startX = hole.left + hole.width / 2
        const startY = cardPlacement === 'below' ? hole.top + hole.height + 4 : hole.top - 4
        const endX = cardLeft + cardWidth / 2
        const endY = cardPlacement === 'below'
          ? cardTop + 6
          : cardTop + stackHeight - 12
        const deltaX = endX - startX
        const deltaY = endY - startY
        const length = Math.hypot(deltaX, deltaY)

        return {
          angle: Math.atan2(deltaY, deltaX) * (180 / Math.PI),
          endX,
          endY,
          length,
          startX,
          startY,
        }
      })()
    : null

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={labels.title}
      style={{ position: 'fixed', inset: 0, zIndex: 99999 }}
      onClick={(event) => event.stopPropagation()}
    >
      <svg
        width={viewportWidth}
        height={viewportHeight}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <defs>
          <mask id="tutorial-spotlight-mask">
            <rect x="0" y="0" width={viewportWidth} height={viewportHeight} fill="white" />
            {hole && (
              <rect
                x={hole.left}
                y={hole.top}
                width={hole.width}
                height={hole.height}
                rx="24"
                ry="24"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width={viewportWidth}
          height={viewportHeight}
          fill="rgba(11, 18, 14, 0.82)"
          mask="url(#tutorial-spotlight-mask)"
        />
      </svg>

      {hole && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-[24px] border border-white/60 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_34px_rgba(155,219,187,0.18)] backdrop-blur-[1px]"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
          }}
          animate={{ opacity: [0.5, 0.95, 0.5], scale: [0.99, 1.02, 0.99] }}
          transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
        />
      )}

      {hole && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-[32px] bg-primary/15 blur-3xl"
          style={{
            top: hole.top - 24,
            left: hole.left - 24,
            width: hole.width + 48,
            height: hole.height + 48,
          }}
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
        />
      )}

      {hole && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute border-l-[3px] border-t-[3px] border-primary/90"
            style={{
              top: hole.top - 6,
              left: hole.left - 6,
              width: CORNER_SIZE,
              height: CORNER_SIZE,
              borderTopLeftRadius: 18,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute border-r-[3px] border-t-[3px] border-primary/90"
            style={{
              top: hole.top - 6,
              left: hole.left + hole.width - CORNER_SIZE + 6,
              width: CORNER_SIZE,
              height: CORNER_SIZE,
              borderTopRightRadius: 18,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute border-b-[3px] border-l-[3px] border-primary/90"
            style={{
              top: hole.top + hole.height - CORNER_SIZE + 6,
              left: hole.left - 6,
              width: CORNER_SIZE,
              height: CORNER_SIZE,
              borderBottomLeftRadius: 18,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute border-b-[3px] border-r-[3px] border-primary/90"
            style={{
              top: hole.top + hole.height - CORNER_SIZE + 6,
              left: hole.left + hole.width - CORNER_SIZE + 6,
              width: CORNER_SIZE,
              height: CORNER_SIZE,
              borderBottomRightRadius: 18,
            }}
          />
        </>
      )}

      {connector && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute origin-left rounded-full bg-gradient-to-r from-primary/65 via-primary/35 to-transparent"
            style={{
              top: connector.startY,
              left: connector.startX,
              width: connector.length,
              height: 2,
              transform: `rotate(${connector.angle}deg)`,
              zIndex: 1,
            }}
            animate={{ opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full border border-primary/50 bg-primary shadow-[0_0_18px_rgba(112,235,195,0.55)]"
            style={{
              top: connector.startY - 5,
              left: connector.startX - 5,
              width: 10,
              height: 10,
              zIndex: 1,
            }}
            animate={{ scale: [0.92, 1.12, 0.92], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 1.9, ease: 'easeInOut', repeat: Infinity }}
          />
        </>
      )}

      <div
        style={{
          position: 'absolute',
          top: cardTop,
          left: '50%',
          transform: 'translateX(-50%)',
          width: cardWidth,
          pointerEvents: 'auto',
          zIndex: 2,
        }}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`${currentStepIndex}-${currentStep.targetId || 'intro'}`}
            dir={isAr ? 'rtl' : 'ltr'}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.28 }}
          >
            <div className={`flex items-center gap-2 ${currentStep.mascotPosition === 'bottom' ? 'flex-col-reverse' : 'flex-col'}`}>
              <div
                className="relative flex w-full items-end justify-center"
                style={{ height: mascotHeight }}
              >
                {hole && cardPlacement !== 'center' && (
                  <div
                    aria-hidden="true"
                    className="absolute left-1/2 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-primary/0 via-primary/60 to-primary/0"
                    style={{
                      top: cardPlacement === 'below' ? -22 : undefined,
                      bottom: cardPlacement === 'above' ? -22 : undefined,
                    }}
                  />
                )}
                <div className="absolute inset-x-8 bottom-4 h-12 rounded-full bg-primary/25 blur-2xl" />
                <img
                  src={`/mascot/${currentStep.mascot || 'mascot-idle.webp'}`}
                  alt="Mascot Guide"
                  className="relative max-h-full max-w-full object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.38)]"
                />
              </div>

              <div className="w-full overflow-hidden rounded-[30px] border border-white/10 bg-card/95 text-card-foreground shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <div className="space-y-4 px-5 pt-5" style={{ maxHeight: bubbleMaxHeight, overflowY: 'auto' }}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-primary">
                      {labels.step} {currentStepIndex + 1}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {currentStepIndex + 1} / {totalSteps}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentStepIndex
                            ? 'w-8 bg-primary'
                            : index < currentStepIndex
                              ? 'w-3 bg-primary/40'
                              : 'w-3 bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="space-y-2 pb-5">
                    <h3 className="text-lg font-extrabold text-foreground">{currentStep.title}</h3>
                    <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                      {currentStep.text}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-background/40 px-4 py-3">
                  <div className="flex items-center gap-2">
                    {currentStepIndex > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-10 px-4 text-muted-foreground"
                        onClick={(event) => {
                          event.stopPropagation()
                          prevStep()
                        }}
                      >
                        {labels.back}
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        skipTutorial()
                      }}
                      className="px-2 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {labels.skip}
                    </button>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    className="h-10 px-5"
                    onClick={(event) => {
                      event.stopPropagation()
                      nextStep()
                    }}
                  >
                    {currentStepIndex === totalSteps - 1 ? labels.finish : labels.next}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )

  return createPortal(overlay, document.body)
}
