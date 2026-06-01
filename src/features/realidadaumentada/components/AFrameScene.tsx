import { useEffect, useRef } from 'react'
import type { WorldObject, UserCoords, SelectedObject } from '../interfaces/ar.types'
import { getDistanceMeters, getBearing } from '../../../lib/geoUtils'

interface AFrameSceneProps {
  userCoords:     UserCoords
  nearbyObjects:  WorldObject[]
  compassRef:     React.MutableRefObject<number>
  onSelectObject: (obj: SelectedObject) => void
}

// Distancia fija a la que se renderiza cada objeto en la escena (metros virtuales).
const RENDER_DISTANCE = 5

// Helper para calcular la posición relativa de un objeto en la escena a partir de las coordenadas del usuario y del objeto.
function calcPosition(
  userLat: number, userLng: number,
  objLat:  number, objLng:  number,
): { x: number; y: number; z: number } {
  const bearing    = getBearing(userLat, userLng, objLat, objLng)
  const bearingRad = (bearing * Math.PI) / 180
  return {
    x:  Math.sin(bearingRad) * RENDER_DISTANCE,
    y:  0,
    z: -Math.cos(bearingRad) * RENDER_DISTANCE,
  }
}

// ── Setup de luces (se llama una sola vez) ──────────────────────────

function appendLights(scene: HTMLElement) {
  const lights: Array<Record<string, string>> = [
    { type: 'ambient',     color: '#ffffff',  intensity: '3' },
    { type: 'directional', color: '#ffffff',  intensity: '3',   position: '0 2 3'  },
    { type: 'directional', color: '#fffae0',  intensity: '2',   position: '0 5 0'  },
    { type: 'directional', color: '#c8d8ff',  intensity: '1.5', position: '-3 2 0' },
    { type: 'directional', color: '#ffd0a0',  intensity: '1.5', position: '3 2 0'  },
    { type: 'point',       color: '#FFD700',  intensity: '2',   position: '0 0 2', distance: '10' },
  ]

  lights.forEach((attrs) => {
    const light = document.createElement('a-light') as HTMLElement
    Object.entries(attrs).forEach(([k, v]) => light.setAttribute(k, v))
    scene.appendChild(light)
  })
}

// ── Construcción de entidad para un WorldObject (se llama una sola vez por objeto) ──

function buildEntity(obj: WorldObject, pos: { x: number; y: number; z: number }): HTMLElement {
  const entity = document.createElement('a-entity') as HTMLElement
  entity.setAttribute('id', `obj-${obj.id}`)
  entity.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`)
  entity.setAttribute(
    'animation',
    `property: position; to: ${pos.x} ${pos.y + 0.15} ${pos.z}; ` +
    'dir: alternate; dur: 2000; easing: easeInOutSine; loop: true',
  )

  if (obj.glbUrl) {
    const model = document.createElement('a-gltf-model') as HTMLElement
    model.setAttribute('src', `#glb-${obj.id}`)
    model.setAttribute('scale', '0.2 0.2 0.2')
    model.setAttribute('rotation', '0 0 0')

    const ring = document.createElement('a-ring') as HTMLElement
    ring.setAttribute('radius-inner', '0.2')
    ring.setAttribute('radius-outer', '0.35')
    ring.setAttribute('rotation', '-90 0 0')
    ring.setAttribute('position', '0 0.01 0')
    ring.setAttribute('material', 'color: #FFD700; opacity: 0.6; transparent: true')
    ring.setAttribute(
      'animation__pulse',
      'property: scale; from: 1 1 1; to: 1.4 1.4 1.4; dir: alternate; dur: 1500; easing: easeInOutSine; loop: true',
    )

    entity.appendChild(model)
    entity.appendChild(ring)
  } else {
    const sphere = document.createElement('a-sphere') as HTMLElement
    sphere.setAttribute('radius', '0.3')
    sphere.setAttribute(
      'material',
      `color: ${obj.color}; metalness: 0.3; roughness: 0.4; emissive: ${obj.color}; emissiveIntensity: 0.5`,
    )
    entity.appendChild(sphere)
  }

  return entity
}

// Etiqueta con nombre y distancia (se llama una sola vez por objeto, luego solo se actualiza el texto)
function buildLabel(label: string, distance: number): HTMLElement {
  const text = document.createElement('a-text') as HTMLElement
  text.setAttribute('value', `${label}\n${Math.round(distance)}m`)
  text.setAttribute('align', 'center')
  text.setAttribute('position', '0 1.0 0')
  text.setAttribute('scale', '0.8 0.8 0.8')
  text.setAttribute('color', '#FFFFFF')
  text.setAttribute('geometry', 'primitive: plane; width: 1.2; height: 0.4')
  text.setAttribute('material', 'color: #0A1535; opacity: 0.6; transparent: true')
  return text
}


export default function AFrameScene({
  userCoords,
  nearbyObjects,
  compassRef,
}: AFrameSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef     = useRef<HTMLElement | null>(null)
  const animFrameRef = useRef<number>(0)

  // createScene solo se ejecuta una vez cuando aparecen objetos cercanos (de 0 a N), luego solo se actualizan posiciones/textos sin recrear la escena
  useEffect(() => {
    if (!containerRef.current || nearbyObjects.length === 0) return
    // Si ya existe escena, no recrear
    if (sceneRef.current) return

 
    const scene = document.createElement('a-scene') as HTMLElement
    scene.setAttribute('embedded', '')
    scene.setAttribute('vr-mode-ui', 'enabled: false')
    scene.setAttribute('device-orientation-permission-ui', 'enabled: false')
    scene.setAttribute('background', 'transparent: true')
    scene.setAttribute(
      'renderer',
      'colorManagement: true; physicallyCorrectLights: true; exposure: 2; toneMapping: ACESFilmic',
    )
    scene.style.cssText = 'width:100%;height:100%;position:fixed;top:0;left:0;z-index:1;'

 
    const assets = document.createElement('a-assets') as HTMLElement
    nearbyObjects.forEach((obj) => {
      if (!obj.glbUrl) return
      const asset = document.createElement('a-asset-item') as HTMLElement
      asset.id = `glb-${obj.id}`
      asset.setAttribute('src', obj.glbUrl)
      assets.appendChild(asset)
    })
    scene.appendChild(assets)


    const camera = document.createElement('a-entity') as HTMLElement
    camera.setAttribute('camera', '')
    camera.setAttribute('look-controls', 'enabled: false')
    camera.setAttribute('position', '0 1.6 0')
    camera.id = 'ar-camera'
    scene.appendChild(camera)

    // ── Luces ──
    appendLights(scene)

  
    nearbyObjects.forEach((obj) => {
      const dist  = getDistanceMeters(userCoords.lat, userCoords.lng, obj.lat, obj.lng)
      const pos   = calcPosition(userCoords.lat, userCoords.lng, obj.lat, obj.lng)
      const entity = buildEntity(obj, pos)
      entity.appendChild(buildLabel(obj.label, dist))
      scene.appendChild(entity)
    })

    containerRef.current.appendChild(scene)
    sceneRef.current = scene

    // ── Loop de rotación de cámara ──
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
  }, [nearbyObjects.length > 0])   


  useEffect(() => {
    if (!sceneRef.current || !userCoords || nearbyObjects.length === 0) return

    nearbyObjects.forEach((obj) => {
      const entity = document.getElementById(`obj-${obj.id}`)
      if (!entity) return

      const dist = getDistanceMeters(userCoords.lat, userCoords.lng, obj.lat, obj.lng)
      const pos  = calcPosition(userCoords.lat, userCoords.lng, obj.lat, obj.lng)

      // Actualizar posición base y animación de flotación
      entity.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`)
      entity.setAttribute(
        'animation',
        `property: position; to: ${pos.x} ${pos.y + 0.15} ${pos.z}; ` +
        'dir: alternate; dur: 2000; easing: easeInOutSine; loop: true',
      )

      // Actualizar etiqueta de distancia
      const label = entity.querySelector('a-text')
      if (label) label.setAttribute('value', `${obj.label}\n${Math.round(dist)}m`)
    })
  }, [userCoords]) 

  return (
    <div
      ref={containerRef}
      className="fixed inset-0"
      style={{ zIndex: 1, pointerEvents: 'none' }}
    />
  )
}