import { useEffect, useRef } from 'react'
import type { WorldObject, UserCoords, SelectedObject } from '../interfaces/ar.types'
import { getDistanceMeters, getBearing } from '../lib/geoUtils'

interface AFrameSceneProps {
  userCoords: UserCoords
  nearbyObjects: WorldObject[]
  compassRef: React.MutableRefObject<number>
  onSelectObject: (obj: SelectedObject) => void
}

const RENDER_DISTANCE = 8 // metros virtuales de render (no real)

/**
 * AFrameScene — monta/desmonta la escena A-Frame y mantiene el loop de la brújula.
 * z-index: 1 (entre la cámara y los overlays HUD / navbar).
 */
export default function AFrameScene({
  userCoords,
  nearbyObjects,
  compassRef,
  onSelectObject,
}: AFrameSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef     = useRef<HTMLElement | null>(null)
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current || nearbyObjects.length === 0) return

    // Limpia escena anterior si existe
    if (sceneRef.current && containerRef.current.contains(sceneRef.current)) {
      containerRef.current.removeChild(sceneRef.current)
      sceneRef.current = null
    }

    // ── Crea escena A-Frame ──────────────────────────────────
    const scene = document.createElement('a-scene') as HTMLElement
    scene.setAttribute('embedded', '')
    scene.setAttribute('vr-mode-ui', 'enabled: false')
    scene.setAttribute('device-orientation-permission-ui', 'enabled: false')
    scene.setAttribute('background', 'transparent: true')
    scene.style.cssText =
      'width:100%;height:100%;position:fixed;top:0;left:0;z-index:1;'
    sceneRef.current = scene

    // Cámara sin look-controls — la rotamos manualmente
    const camera = document.createElement('a-entity') as HTMLElement
    camera.setAttribute('camera', '')
    camera.setAttribute('look-controls', 'enabled: false')
    camera.setAttribute('position', '0 1.6 0')
    camera.id = 'ar-camera'

    // Cursor para clicks
    const cursor = document.createElement('a-entity') as HTMLElement
    cursor.setAttribute('cursor', 'fuse: false; rayOrigin: mouse')
    cursor.setAttribute('raycaster', 'objects: .clickable; far: 100')
    cursor.setAttribute('geometry', 'primitive: ring; radiusInner: 0.02; radiusOuter: 0.03')
    cursor.setAttribute('material', 'color: white; shader: flat; opacity: 0.8')
    // El cursor SÍ captura eventos de puntero
    cursor.style.pointerEvents = 'auto'
    camera.appendChild(cursor)
    scene.appendChild(camera)

    // Luz ambiental
    const light = document.createElement('a-entity') as HTMLElement
    light.setAttribute('light', 'type: ambient; intensity: 1')
    scene.appendChild(light)

    // ── Coloca esferas en su dirección GPS ──────────────────
    nearbyObjects.forEach((obj) => {
      const distance = getDistanceMeters(
        userCoords.lat, userCoords.lng,
        obj.lat, obj.lng
      )
      const bearing    = getBearing(userCoords.lat, userCoords.lng, obj.lat, obj.lng)
      const bearingRad = (bearing * Math.PI) / 180

      const pos = {
        x:  Math.sin(bearingRad) * RENDER_DISTANCE,
        y:  1.5,
        z: -Math.cos(bearingRad) * RENDER_DISTANCE,
      }

      const entity = document.createElement('a-entity') as HTMLElement
      entity.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`)

      // ── ESFERA (reemplaza al cubo) ───────────────────────
      const sphere = document.createElement('a-sphere') as HTMLElement
      sphere.setAttribute('color', obj.color)
      sphere.setAttribute('radius', '0.5')
      sphere.setAttribute('class', 'clickable')
      sphere.setAttribute('material', `color: ${obj.color}; metalness: 0.3; roughness: 0.2; emissive: ${obj.color}; emissiveIntensity: 0.3`)
      sphere.setAttribute(
        'animation',
        'property: position; to: 0 0.4 0; dir: alternate; dur: 2000; easing: easeInOutSine; loop: true'
      )
      // Permitir clicks en la esfera
      sphere.style.pointerEvents = 'auto'

      // Halo brillante alrededor de la esfera
      const glow = document.createElement('a-sphere') as HTMLElement
      glow.setAttribute('radius', '0.6')
      glow.setAttribute('material', `color: ${obj.color}; opacity: 0.15; transparent: true; side: back`)
      glow.setAttribute(
        'animation__pulse',
        'property: scale; from: 1 1 1; to: 1.3 1.3 1.3; dir: alternate; dur: 1500; easing: easeInOutSine; loop: true'
      )

      const text = document.createElement('a-text') as HTMLElement
      text.setAttribute('value', `${obj.label}\n${Math.round(distance)}m`)
      text.setAttribute('align', 'center')
      text.setAttribute('position', '0 1.2 0')
      text.setAttribute('scale', '1.5 1.5 1.5')
      text.setAttribute('color', '#FFFFFF')

      sphere.addEventListener('click', () => {
        onSelectObject({ id: obj.id, label: obj.label, distance: Math.round(distance) })
        sphere.setAttribute(
          'animation__click',
          'property: scale; from: 1 1 1; to: 1.6 1.6 1.6; dur: 150; easing: easeOutQuad; loop: 1; dir: alternate'
        )
      })

      entity.appendChild(sphere)
      entity.appendChild(glow)
      entity.appendChild(text)
      scene.appendChild(entity)
    })

    containerRef.current.appendChild(scene)

    // ── Loop: rota la cámara virtual con el heading real ────
    const tick = () => {
      const cam = document.getElementById('ar-camera')
      if (cam) cam.setAttribute('rotation', `0 ${-compassRef.current} 0`)
      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      if (sceneRef.current && containerRef.current?.contains(sceneRef.current)) {
        containerRef.current.removeChild(sceneRef.current)
        sceneRef.current = null
      }
    }
  }, [userCoords, nearbyObjects])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        // pointer-events none aquí; los clickables los re-habilitan ellos mismos
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}