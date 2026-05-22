import { useEffect, useRef } from 'react'
import type { WorldObject, UserCoords, SelectedObject } from '../interfaces/ar.types'
import { getDistanceMeters, getBearing } from '../../../lib/geoUtils'

interface AFrameSceneProps {
  userCoords: UserCoords
  nearbyObjects: WorldObject[]
  compassRef: React.MutableRefObject<number>
  onSelectObject: (obj: SelectedObject) => void
}

const RENDER_DISTANCE = 5

export default function AFrameScene({
  userCoords,
  nearbyObjects,
  compassRef,
}: AFrameSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef     = useRef<HTMLElement | null>(null)
  const animFrameRef = useRef<number>(0)

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
    // Renderer con physically correct lights + exposure alta
    scene.setAttribute(
      'renderer',
      'colorManagement: true; physicallyCorrectLights: true; exposure: 2; toneMapping: ACESFilmic'
    )
    scene.style.cssText =
      'width:100%;height:100%;position:fixed;top:0;left:0;z-index:1;'
    sceneRef.current = scene

    // Assets
    const assets = document.createElement('a-assets') as HTMLElement
    nearbyObjects.forEach((obj) => {
      if (!obj.glbUrl) return
      const asset = document.createElement('a-asset-item') as HTMLElement
      asset.id = `glb-${obj.id}`
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
    scene.appendChild(camera)


    // Ambiente muy fuerte
    const ambientLight = document.createElement('a-light') as HTMLElement
    ambientLight.setAttribute('type', 'ambient')
    ambientLight.setAttribute('color', '#ffffff')
    ambientLight.setAttribute('intensity', '3')
    scene.appendChild(ambientLight)

    // Direccional frontal fuerte
    const dirFront = document.createElement('a-light') as HTMLElement
    dirFront.setAttribute('type', 'directional')
    dirFront.setAttribute('color', '#ffffff')
    dirFront.setAttribute('intensity', '3')
    dirFront.setAttribute('position', '0 2 3')
    scene.appendChild(dirFront)

    // Direccional desde arriba
    const dirTop = document.createElement('a-light') as HTMLElement
    dirTop.setAttribute('type', 'directional')
    dirTop.setAttribute('color', '#fffae0')
    dirTop.setAttribute('intensity', '2')
    dirTop.setAttribute('position', '0 5 0')
    scene.appendChild(dirTop)

    // Direccional desde la izquierda (fill)
    const dirLeft = document.createElement('a-light') as HTMLElement
    dirLeft.setAttribute('type', 'directional')
    dirLeft.setAttribute('color', '#c8d8ff')
    dirLeft.setAttribute('intensity', '1.5')
    dirLeft.setAttribute('position', '-3 2 0')
    scene.appendChild(dirLeft)

    // Direccional desde la derecha (fill)
    const dirRight = document.createElement('a-light') as HTMLElement
    dirRight.setAttribute('type', 'directional')
    dirRight.setAttribute('color', '#ffd0a0')
    dirRight.setAttribute('intensity', '1.5')
    dirRight.setAttribute('position', '3 2 0')
    scene.appendChild(dirRight)

    // Point light debajo para rim light dorado
    const pointLight = document.createElement('a-light') as HTMLElement
    pointLight.setAttribute('type', 'point')
    pointLight.setAttribute('color', '#FFD700')
    pointLight.setAttribute('intensity', '2')
    pointLight.setAttribute('distance', '10')
    pointLight.setAttribute('position', '0 0 2')
    scene.appendChild(pointLight)

    // Objetos
    nearbyObjects.forEach((obj) => {
      const distance   = getDistanceMeters(userCoords.lat, userCoords.lng, obj.lat, obj.lng)
      const bearing    = getBearing(userCoords.lat, userCoords.lng, obj.lat, obj.lng)
      const bearingRad = (bearing * Math.PI) / 180

      const pos = {
        x:  Math.sin(bearingRad) * RENDER_DISTANCE,
        y:  0,
        z: -Math.cos(bearingRad) * RENDER_DISTANCE,
      }

      const entity = document.createElement('a-entity') as HTMLElement
      entity.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`)
      entity.setAttribute('id', `obj-${obj.id}`)
      entity.setAttribute(
        'animation',
        `property: position; to: ${pos.x} ${pos.y + 0.15} ${pos.z}; ` +
        'dir: alternate; dur: 2000; easing: easeInOutSine; loop: true'
      )

      if (obj.glbUrl) {
        const model = document.createElement('a-gltf-model') as HTMLElement
        model.setAttribute('src', `#glb-${obj.id}`)
        // El modelo tiene scale interno 0.0106 — con 1 1 1 se ve al tamaño correcto
        // Ajustamos a 0.05 para que sea pequeño pero visible
        model.setAttribute('scale', '0.2 0.2 0.2')
        model.setAttribute('rotation', '0 0 0')

        // Halo dorado debajo
        const ring = document.createElement('a-ring') as HTMLElement
        ring.setAttribute('radius-inner', '0.2')
        ring.setAttribute('radius-outer', '0.35')
        ring.setAttribute('rotation', '-90 0 0')
        ring.setAttribute('position', '0 0.01 0')
        ring.setAttribute(
          'material',
          'color: #FFD700; opacity: 0.6; transparent: true'
        )
        ring.setAttribute(
          'animation__pulse',
          'property: scale; from: 1 1 1; to: 1.4 1.4 1.4; dir: alternate; dur: 1500; easing: easeInOutSine; loop: true'
        )

        entity.appendChild(model)
        entity.appendChild(ring)
      } else {
        const sphere = document.createElement('a-sphere') as HTMLElement
        sphere.setAttribute('radius', '0.3')
        sphere.setAttribute(
          'material',
          `color: ${obj.color}; metalness: 0.3; roughness: 0.4; emissive: ${obj.color}; emissiveIntensity: 0.5`
        )
        entity.appendChild(sphere)
      }

      // Etiqueta
      const text = document.createElement('a-text') as HTMLElement
      text.setAttribute('value', `${obj.label}\n${Math.round(distance)}m`)
      text.setAttribute('align', 'center')
      text.setAttribute('position', '0 1.0 0')
      text.setAttribute('scale', '0.8 0.8 0.8')
      text.setAttribute('color', '#FFFFFF')
      text.setAttribute(
        'geometry',
        'primitive: plane; width: 1.2; height: 0.4'
      )
      text.setAttribute(
        'material',
        'color: #0A1535; opacity: 0.6; transparent: true'
      )
      entity.appendChild(text)
      scene.appendChild(entity)
    })

    containerRef.current.appendChild(scene)

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
      className="fixed inset-0"
      style={{ zIndex: 1, pointerEvents: 'none' }}
    />
  )
}