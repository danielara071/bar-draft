import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

export interface CameraFeedHandle {
  stop: () => void
}

// CameraFeed — stream de cámara trasera.
// Expone `stop()` vía ref para que el padre pueda apagar la cámara al salir.
const CameraFeed = forwardRef<CameraFeedHandle>((_, ref) => {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stop = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }

  // Expone stop() al componente padre
  useImperativeHandle(ref, () => ({ stop }), [])

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((s) => {
        streamRef.current = s
        if (videoRef.current) videoRef.current.srcObject = s
      })
      .catch(console.error)

    return stop   // cleanup al desmontar
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="fixed left-0 top-0 h-full w-full object-cover"
      style={{ zIndex: 0 }}
    />
  )
})

CameraFeed.displayName = 'CameraFeed'
export default CameraFeed