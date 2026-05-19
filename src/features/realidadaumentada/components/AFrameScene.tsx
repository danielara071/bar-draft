import { useEffect, useRef } from 'react'
import type { WorldObject, UserCoords, SelectedObject } from '../interfaces/ar.types'
import { getDistanceMeters, getBearing } from '../../../lib/geoUtils'

interface AFrameSceneProps {
  userCoords: UserCoords
  nearbyObjects: WorldObject[]
  compassRef: React.MutableRefObject<number>
  onSelectObject: (obj: SelectedObject) => void
}

const RENDER_DISTANCE = 3.5  // Más cercano
const PROXIMITY_TRIGGER = 1.5  // Distancia para activar interacción (metros en 3D)

export default function AFrameScene({
  userCoords,
  nearbyObjects,
  compassRef,
  onSelectObject,
}: AFrameSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef     = useRef<HTMLElement | null>(null)
  const animFrameRef = useRef<number>(0)
  const proximityRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!containerRef.current || nearbyObjects.length === 0) return

    if (sceneRef.current && containerRef.current.contains(sceneRef.current)) {
      containerRef.current.removeChild(sceneRef.current)
      sceneRef.current = null
    }

    const scene = document.createElement('a-scene') as HTMLElement
    scene.setAttribute('embedded', '')
    scene.setAttribute('vr-mode-ui', 'enabled: false')
    scene.setAttribute('device-orientation-permission-ui', 'enabled: false')
    scene.setAttribute('background', 'transparent: true')
    scene.style.cssText = 'width:100%;height:100%;position:fixed;top:0;left:0;z-index:1;'
    sceneRef.current = scene

    // Assets — preload de GLBs
    const assets = document.createElement('a-assets') as HTMLElement
    nearbyObjects.forEach((obj) => {
      if (!obj.glbUrl) return
      const asset = document.createElement('a-asset-item') as HTMLElement
      asset.id  = `glb-${obj.id}`
      asset.setAttribute('src', obj.glbUrl)
      assets.appendChild(asset)
    })
    scene.appendChild(assets)

    // Cámara
    const camera = document.createElement('a-entity') as HTMLElement
    camera.setAttribute('camera', '')
    camera.setAttribute('look-controls', 'enabled: false')
    camera.setAttribute('position', '0 1.6 0')
    camera.id = 'ar-camera'

    // Cursor raycasting — mejorado
    const cursor = document.createElement('a-entity') as HTMLElement
    cursor.setAttribute('cursor', 'fuse: false; rayOrigin: mouse')
    cursor.setAttribute('raycaster', 'objects: .clickable; far: 200; near: 0.1')
    cursor.setAttribute('geometry', 'primitive: ring; radiusInner: 0.02; radiusOuter: 0.03')
    cursor.setAttribute('material', 'color: white; shader: flat; opacity: 0.8')
    cursor.style.pointerEvents = 'auto'
    camera.appendChild(cursor)
    scene.appendChild(camera)

    // ── LUCES ───────────────────────────────────────────────
    // Luz ambiental fuerte
    const ambientLight = document.createElement('a-entity') as HTMLElement
    ambientLight.setAttribute('light', 'type: ambient; intensity: 1.2; color: #ffffff')
    scene.appendChild(ambientLight)

    // Luz hemisférica para profundidad
    const hemLight = document.createElement('a-entity') as HTMLElement
    hemLight.setAttribute('light', 'type: hemisphere; intensity: 0.8')
    scene.appendChild(hemLight)

    // Luz direccional frontal
    const dirLight1 = document.createElement('a-entity') as HTMLElement
    dirLight1.setAttribute('light', 'type: directional; intensity: 1; color: #ffffff')
    dirLight1.setAttribute('position', '2 3 2')
    scene.appendChild(dirLight1)

    // Luz direccional trasera (fill light)
    const dirLight2 = document.createElement('a-entity') as HTMLElement
    dirLight2.setAttribute('light', 'type: directional; intensity: 0.5; color: #ffffff')
    dirLight2.setAttribute('position', '-2 2 -3')
    scene.appendChild(dirLight2)

    // Almacenar referencias a entidades para proximity detection
    const objectEntities = new Map<string, { entity: HTMLElement; distance: number }>()

    // Objetos
    nearbyObjects.forEach((obj) => {
      const distance   = getDistanceMeters(userCoords.lat, userCoords.lng, obj.lat, obj.lng)
      const bearing    = getBearing(userCoords.lat, userCoords.lng, obj.lat, obj.lng)
      const bearingRad = (bearing * Math.PI) / 180

      const pos = {
        x:  Math.sin(bearingRad) * RENDER_DISTANCE,
        y:  1.5,
        z: -Math.cos(bearingRad) * RENDER_DISTANCE,
      }

      const entity = document.createElement('a-entity') as HTMLElement
      entity.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`)
      entity.setAttribute('id', `obj-${obj.id}`)
      entity.setAttribute(
        'animation',
        'property: position; to: ' +
          `${pos.x} ${pos.y + 0.2} ${pos.z}; ` +
          'dir: alternate; dur: 2000; easing: easeInOutSine; loop: true'
      )

      objectEntities.set(obj.id, { entity, distance })

      const handleSelection = () => {
        onSelectObject({ id: obj.id, label: obj.label, distance: Math.round(distance) })
      }

      if (obj.glbUrl) {
        // ── Modelo GLB ───────────────────────────────────────
        const model = document.createElement('a-gltf-model') as HTMLElement
        model.setAttribute('src', `#glb-${obj.id}`)
        model.setAttribute('scale', '0.3 0.3 0.3')  // Más pequeño
        model.setAttribute('class', 'clickable')
        model.style.pointerEvents = 'auto'

        // ── HITBOX INVISIBLE (colisionador) ───────────────────
        const hitbox = document.createElement('a-box') as HTMLElement
        hitbox.setAttribute('class', 'clickable')
        hitbox.setAttribute('position', '0 0 0')
        hitbox.setAttribute('scale', '1.2 1.2 1.2')
        hitbox.setAttribute('material', 'transparent: true; opacity: 0')
        hitbox.style.pointerEvents = 'auto'

        // Halo debajo del modelo
        const ring = document.createElement('a-ring') as HTMLElement
        ring.setAttribute('radius-inner', '0.3')
        ring.setAttribute('radius-outer', '0.5')
        ring.setAttribute('position', '0 -0.6 0')
        ring.setAttribute('rotation', '-90 0 0')
        ring.setAttribute(
          'material',
          `color: ${obj.color}; opacity: 0.5; transparent: true`
        )
        ring.setAttribute(
          'animation__pulse',
          'property: scale; from: 1 1 1; to: 1.4 1.4 1.4; dir: alternate; dur: 1500; easing: easeInOutSine; loop: true'
        )

        // Event listeners en el hitbox (mejor raycasting)
        hitbox.addEventListener('click', handleSelection)
        hitbox.addEventListener('mouseenter', () => {
          // Feedback visual al pasar el mouse/raycast
          ring.setAttribute('material', `color: ${obj.color}; opacity: 0.8; transparent: true`)
        })
        hitbox.addEventListener('mouseleave', () => {
          ring.setAttribute('material', `color: ${obj.color}; opacity: 0.5; transparent: true`)
        })

        entity.appendChild(model)
        entity.appendChild(hitbox)
        entity.appendChild(ring)
      } else {
        // ── Fallback: esfera ─────────────────────────────────
        const sphere = document.createElement('a-sphere') as HTMLElement
        sphere.setAttribute('radius', '0.4')
        sphere.setAttribute('class', 'clickable')
        sphere.setAttribute(
          'material',
          `color: ${obj.color}; metalness: 0.3; roughness: 0.2; emissive: ${obj.color}; emissiveIntensity: 0.5`
        )
        sphere.style.pointerEvents = 'auto'

        const glow = document.createElement('a-sphere') as HTMLElement
        glow.setAttribute('radius', '0.55')
        glow.setAttribute(
          'material',
          `color: ${obj.color}; opacity: 0.2; transparent: true; side: back`
        )
        glow.setAttribute(
          'animation__pulse',
          'property: scale; from: 1 1 1; to: 1.4 1.4 1.4; dir: alternate; dur: 1500; easing: easeInOutSine; loop: true'
        )

        sphere.addEventListener('click', handleSelection)
        entity.appendChild(sphere)
        entity.appendChild(glow)
      }

      // Etiqueta
      const text = document.createElement('a-text') as HTMLElement
      text.setAttribute('value', `${obj.label}\n${Math.round(distance)}m`)
      text.setAttribute('align', 'center')
      text.setAttribute('position', '0 1.2 0')
      text.setAttribute('scale', '1 1 1')
      text.setAttribute('color', '#FFFFFF')

      entity.appendChild(text)
      scene.appendChild(entity)
    })

    containerRef.current.appendChild(scene)

    // ── Loop: brújula + proximity detection ──────────────────
    const tick = () => {
      const cam = document.getElementById('ar-camera')
      if (cam) cam.setAttribute('rotation', `0 ${-compassRef.current} 0`)

      // Proximity check — si el usuario está muy cerca, auto-abrir modal
      objectEntities.forEach(({ distance }, objId) => {
        const isNear = distance < PROXIMITY_TRIGGER
        const wasNear = proximityRef.current.has(objId)

        if (isNear && !wasNear) {
          // Entró en rango de proximidad
          proximityRef.current.add(objId)
          const obj = nearbyObjects.find((o) => o.id === objId)
          if (obj) {
            onSelectObject({
              id: obj.id,
              label: obj.label,
              distance: Math.round(distance),
            })
          }
        } else if (!isNear && wasNear) {
          // Salió del rango
          proximityRef.current.delete(objId)
        }
      })

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
      className="fixed inset-0"
      style={{ zIndex: 1, pointerEvents: 'none' }}
    />
  )
}