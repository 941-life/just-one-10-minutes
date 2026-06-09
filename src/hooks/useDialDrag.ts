import { useRef, useCallback, useState } from 'react'

interface UseDialDragOptions {
  onSet: (minutes: number) => void
  enabled: boolean
}

export function useDialDrag({ onSet, enabled }: UseDialDragOptions) {
  const svgRef = useRef<SVGSVGElement>(null)
  const isDragging = useRef(false)
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
    const ratio = angle / (2 * Math.PI)
    const raw = ratio * 60
    const snapped = Math.round(raw)
    const minutes = snapped === 0 ? 60 : snapped
    return Math.max(1, Math.min(60, minutes))
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGElement>) => {
      if (!enabled) return
      e.preventDefault()
      isDragging.current = true
      setDragging(true)
      svgRef.current?.setPointerCapture(e.pointerId)
      const mins = calcMinutes(e)
      if (mins !== null) onSet(mins)
    },
    [enabled, calcMinutes, onSet],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!enabled || !isDragging.current) return
      const mins = calcMinutes(e as unknown as PointerEvent)
      if (mins !== null) onSet(mins)
    },
    [enabled, calcMinutes, onSet],
  )

  const onPointerUp = useCallback(() => {
    isDragging.current = false
    setDragging(false)
  }, [])

  return { svgRef, dragging, onPointerDown, onPointerMove, onPointerUp }
}
