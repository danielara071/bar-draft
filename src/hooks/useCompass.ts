import { useEffect, useRef, useState } from 'react'

interface UseCompassResult {
  compassRef: React.MutableRefObject<number>
  compassReady: boolean
}

export function useCompass(started: boolean): UseCompassResult {
  const compassRef = useRef<number>(0)
  const [compassReady, setCompassReady] = useState(false)

  useEffect(() => {
    if (!started) return

    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)

    if (isMobile) {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        let heading = 0
        if ((e as any).webkitCompassHeading !== undefined) {
          heading = (e as any).webkitCompassHeading
        } else if (e.alpha !== null) {
          heading = (360 - e.alpha) % 360
        }
        compassRef.current = heading
        if (!compassReady) setCompassReady(true)
      }

      const requestAndListen = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          if (permission === 'granted') {
            window.addEventListener('deviceorientationabsolute', handleOrientation as any, true)
            window.addEventListener('deviceorientation', handleOrientation as any, true)
          }
        } else {
          window.addEventListener('deviceorientationabsolute', handleOrientation as any, true)
          window.addEventListener('deviceorientation', handleOrientation as any, true)
        }
      }

      requestAndListen()
      return () => {
        window.removeEventListener('deviceorientationabsolute', handleOrientation as any, true)
        window.removeEventListener('deviceorientation', handleOrientation as any, true)
      }
    } else {
      // PC: simula brújula con teclas ◄ ►
      setCompassReady(true)
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft')  compassRef.current = (compassRef.current - 5 + 360) % 360
        if (e.key === 'ArrowRight') compassRef.current = (compassRef.current + 5) % 360
      }
      window.addEventListener('keydown', handleKey)
      return () => window.removeEventListener('keydown', handleKey)
    }
  }, [started])

  return { compassRef, compassReady }
}