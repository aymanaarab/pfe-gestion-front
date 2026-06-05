import { useEffect, useRef, useState } from 'react'

export default function CountUp({ value = 0, duration = 900 }) {
  const [display, setDisplay] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    const target = Number(value) || 0
    const from = fromRef.current
    if (from === target) {
      setDisplay(target)
      return undefined
    }

    let raf
    let start
    const step = (ts) => {
      if (start === undefined) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (target - from) * eased))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      } else {
        fromRef.current = target
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return <>{display.toLocaleString('fr-FR')}</>
}
