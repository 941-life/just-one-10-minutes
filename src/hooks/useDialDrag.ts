import { useRef, useCallback, useEffect, useState } from 'react'

interface UseDialDragOptions {
  onSet: (minutes: number) => void
  enabled: boolean
}

export function useDialDrag({ onSet, enabled }: UseDialDragOptions) {
  const svgRef = useRef<SVGSVGElement>(null)
  const isDragging = useRef(false)
  const activePointerId = useRef<number | null>(null)
  const [dragging, setDragging] = useState(false)

  const calcMinutes = useCallback((e: PointerEvent | React.PointerEvent) => {
    if (!svgRef.current) return null

    const rect = svgRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy

    let angle = Math.atan2(dy, dx) + Math.PI / 2
    if (angle < 0) angle += 2 * Math.PI

    const raw = (angle / (2 * Math.PI)) * 60
    const snapped = Math.round(raw)
    const minutes = snapped === 0 ? 60 : snapped

    return Math.max(1, Math.min(60, minutes))
  }, [])

  const stopDragging = useCallback(() => {
    isDragging.current = false
    activePointerId.current = null
    setDragging(false)
  }, [])

  const updateFromPointer = useCallback(
    (e: PointerEvent | React.PointerEvent) => {
      const mins = calcMinutes(e)
      if (mins !== null) onSet(mins)
    },
    [calcMinutes, onSet],
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGElement>) => {
      if (!enabled) return

      e.preventDefault()
      activePointerId.current = e.pointerId
      isDragging.current = true
      setDragging(true)
      e.currentTarget.setPointerCapture?.(e.pointerId)
      updateFromPointer(e)
    },
    [enabled, updateFromPointer],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!enabled || !isDragging.current) return
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return
      e.preventDefault()
      updateFromPointer(e)
    },
    [enabled, updateFromPointer],
  )

  useEffect(() => {
    if (!dragging || !enabled) return

    function handleWindowPointerMove(e: PointerEvent) {
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return
      e.preventDefault()
      updateFromPointer(e)
    }

    function handleWindowPointerUp(e: PointerEvent) {
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return
      stopDragging()
    }

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: false })
    window.addEventListener('pointerup', handleWindowPointerUp)
    window.addEventListener('pointercancel', handleWindowPointerUp)

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove)
      window.removeEventListener('pointerup', handleWindowPointerUp)
      window.removeEventListener('pointercancel', handleWindowPointerUp)
    }
  }, [dragging, enabled, stopDragging, updateFromPointer])

  return { svgRef, dragging, onPointerDown, onPointerMove, onPointerUp: stopDragging }
}
