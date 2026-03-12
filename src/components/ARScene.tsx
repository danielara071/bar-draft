// src/components/ARScene.tsx
import { useEffect, useRef, useState, useCallback } from "react";

// ── Tipos ────────────────────────────────────────────────────────
interface WorldObject {
  id: string;
  label: string;
  color: string;
  lat: number;
  lng: number;
}

interface SelectedObject {
  id: string;
  label: string;
  distance: number;
}

interface UserCoords {
  lat: number;
  lng: number;
}

// ── Tus objetos del mundo ────────────────────────────────────────
const MY_LAT = 25.6499814;
const MY_LNG = -100.2879801;
const WORLD_OBJECTS: WorldObject[] = [
  {
    id: "w1",
    label: "Tesoro",
    color: "#FFD700",
    lat: MY_LAT + 0.0001,
    lng: MY_LNG,
  },
  {
    id: "w2",
    label: "Cristal",
    color: "#FF4444",
    lat: MY_LAT,
    lng: MY_LNG + 0.0001,
  },
  {
    id: "w3",
    label: "Gema",
    color: "#44FFCC",
    lat: MY_LAT,
    lng: MY_LNG - 0.0001,
  },
  {
    id: "w4",
    label: "Portal",
    color: "#4488FF",
    lat: MY_LAT - 0.0001,
    lng: MY_LNG,
  },
];

const VISIBILITY_RADIUS_METERS = 50;

// ── Utilidades GPS ───────────────────────────────────────────────
function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Calcula el ángulo (bearing) del usuario hacia el objeto en grados (0=Norte, 90=Este)
function getBearing(
  userLat: number,
  userLng: number,
  objLat: number,
  objLng: number,
): number {
  const dLng = (objLng - userLng) * (Math.PI / 180);
  const lat1 = userLat * (Math.PI / 180);
  const lat2 = objLat * (Math.PI / 180);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// ── Componente principal ─────────────────────────────────────────
export default function ARScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLElement | null>(null);
  const compassRef = useRef<number>(0); // heading actual de la brújula
  const userCoordsRef = useRef<UserCoords | null>(null);
  const animFrameRef = useRef<number>(0);

  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [nearbyObjects, setNearbyObjects] = useState<WorldObject[]>([]);
  const [selected, setSelected] = useState<SelectedObject | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [compassReady, setCompassReady] = useState(false);

  // ── Filtra objetos cercanos ──────────────────────────────────
  const filterNearbyObjects = useCallback((coords: UserCoords) => {
    const nearby = WORLD_OBJECTS.filter(
      (obj) =>
        getDistanceMeters(coords.lat, coords.lng, obj.lat, obj.lng) <=
        VISIBILITY_RADIUS_METERS,
    );
    setNearbyObjects(nearby);
    return nearby;
  }, []);

  // Reemplaza el useEffect de la brújula por este durante desarrollo en PC

  useEffect(() => {
    if (!started) return;

    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

    if (isMobile) {
      // ── Móvil: brújula real ──────────────────────────────────
      const handleOrientation = (e: DeviceOrientationEvent) => {
        let heading = 0;
        if ((e as any).webkitCompassHeading !== undefined) {
          heading = (e as any).webkitCompassHeading;
        } else if (e.alpha !== null) {
          heading = (360 - e.alpha) % 360;
        }
        compassRef.current = heading;
        if (!compassReady) setCompassReady(true);
      };

      const requestAndListen = async () => {
        if (
          typeof (DeviceOrientationEvent as any).requestPermission ===
          "function"
        ) {
          const permission = await (
            DeviceOrientationEvent as any
          ).requestPermission();
          if (permission === "granted") {
            window.addEventListener(
              "deviceorientationabsolute",
              handleOrientation as any,
              true,
            );
            window.addEventListener(
              "deviceorientation",
              handleOrientation as any,
              true,
            );
          }
        } else {
          window.addEventListener(
            "deviceorientationabsolute",
            handleOrientation as any,
            true,
          );
          window.addEventListener(
            "deviceorientation",
            handleOrientation as any,
            true,
          );
        }
      };

      requestAndListen();
      return () => {
        window.removeEventListener(
          "deviceorientationabsolute",
          handleOrientation as any,
          true,
        );
        window.removeEventListener(
          "deviceorientation",
          handleOrientation as any,
          true,
        );
      };
    } else {
      // ── PC: simula la brújula con teclas ◄ ► ────────────────
      setCompassReady(true);
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft")
          compassRef.current = (compassRef.current - 5 + 360) % 360;
        if (e.key === "ArrowRight")
          compassRef.current = (compassRef.current + 5) % 360;
      };
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [started]);

  // ── GPS watch ────────────────────────────────────────────────
  useEffect(() => {
    if (!started) return;
    if (!navigator.geolocation) {
      setGpsError("GPS no disponible");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        userCoordsRef.current = coords;
        setUserCoords(coords);
        filterNearbyObjects(coords);
      },
      (err) => setGpsError(err.message),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [started, filterNearbyObjects]);

  // ── Construye escena A-Frame ─────────────────────────────────
  useEffect(() => {
    if (!userCoords || !containerRef.current || nearbyObjects.length === 0)
      return;

    if (sceneRef.current && containerRef.current.contains(sceneRef.current)) {
      containerRef.current.removeChild(sceneRef.current);
      sceneRef.current = null;
    }

    const scene = document.createElement("a-scene") as HTMLElement;
    scene.setAttribute("embedded", "");
    scene.setAttribute("vr-mode-ui", "enabled: false");
    scene.setAttribute("device-orientation-permission-ui", "enabled: false");
    scene.setAttribute("background", "transparent: true");
    scene.style.cssText =
      "width:100%;height:100%;position:fixed;top:0;left:0;z-index:1;";
    sceneRef.current = scene;

    // Cámara SIN look-controls — la rotamos manualmente con la brújula
    const camera = document.createElement("a-entity") as HTMLElement;
    camera.setAttribute("camera", "");
    camera.setAttribute("look-controls", "enabled: false"); // lo controlamos nosotros
    camera.setAttribute("position", "0 1.6 0");
    camera.id = "ar-camera";

    const cursor = document.createElement("a-entity") as HTMLElement;
    cursor.setAttribute("cursor", "fuse: false; rayOrigin: mouse");
    cursor.setAttribute("raycaster", "objects: .clickable; far: 100");
    cursor.setAttribute(
      "geometry",
      "primitive: ring; radiusInner: 0.02; radiusOuter: 0.03",
    );
    cursor.setAttribute("material", "color: white; shader: flat; opacity: 0.8");
    camera.appendChild(cursor);
    scene.appendChild(camera);

    const light = document.createElement("a-entity") as HTMLElement;
    light.setAttribute("light", "type: ambient; intensity: 1");
    scene.appendChild(light);

    // Coloca objetos en su dirección GPS real
    nearbyObjects.forEach((obj) => {
      const distance = getDistanceMeters(
        userCoords.lat,
        userCoords.lng,
        obj.lat,
        obj.lng,
      );

      // Bearing = ángulo real hacia el objeto desde el usuario
      const bearing = getBearing(
        userCoords.lat,
        userCoords.lng,
        obj.lat,
        obj.lng,
      );
      const bearingRad = (bearing * Math.PI) / 180;

      // Distancia de render fija (no real) para que siempre sea visible
      const renderDist = 8;

      const pos = {
        x: Math.sin(bearingRad) * renderDist,
        y: 1.5,
        z: -Math.cos(bearingRad) * renderDist,
      };

      const entity = document.createElement("a-entity") as HTMLElement;
      entity.setAttribute("position", `${pos.x} ${pos.y} ${pos.z}`);

      const box = document.createElement("a-box") as HTMLElement;
      box.setAttribute("color", obj.color);
      box.setAttribute("scale", "0.8 0.8 0.8");
      box.setAttribute("class", "clickable");
      box.setAttribute(
        "animation",
        "property: position; to: 0 0.3 0; dir: alternate; dur: 2000; easing: easeInOutSine; loop: true",
      );

      const text = document.createElement("a-text") as HTMLElement;
      text.setAttribute("value", `${obj.label}\n${Math.round(distance)}m`);
      text.setAttribute("align", "center");
      text.setAttribute("position", "0 1 0");
      text.setAttribute("scale", "1.5 1.5 1.5");
      text.setAttribute("color", "#FFFFFF");

      box.addEventListener("click", () => {
        setSelected({
          id: obj.id,
          label: obj.label,
          distance: Math.round(distance),
        });
        box.setAttribute(
          "animation__click",
          "property: scale; from: 0.8 0.8 0.8; to: 1.4 1.4 1.4; dur: 150; easing: easeOutQuad; loop: 1; dir: alternate",
        );
      });

      entity.appendChild(box);
      entity.appendChild(text);
      scene.appendChild(entity);
    });

    containerRef.current.appendChild(scene);

    // ── Loop: rota la cámara virtual según la brújula real ────
    const tick = () => {
      const cam = document.getElementById("ar-camera");
      if (cam) {
        // Rotamos solo en Y (izquierda/derecha) con el heading de la brújula
        // El objeto está en su bearing real, la cámara apunta al heading real
        // → si el usuario apunta al objeto, lo ve en el centro
        cam.setAttribute("rotation", `0 ${-compassRef.current} 0`);
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (
        sceneRef.current &&
        containerRef.current?.contains(sceneRef.current)
      ) {
        containerRef.current.removeChild(sceneRef.current);
        sceneRef.current = null;
      }
    };
  }, [userCoords, nearbyObjects]);

  // ── Pantalla de inicio ───────────────────────────────────────
  if (!started) {
    return (
      <div style={styles.fullscreen}>
        <h2 style={styles.title}>🌍 AR World</h2>
        <p style={styles.desc}>
          Mueve tu cámara para encontrar objetos ocultos cerca de ti
        </p>
        <button style={styles.primaryBtn} onClick={() => setStarted(true)}>
          Iniciar experiencia
        </button>
      </div>
    );
  }

  if (gpsError) {
    return (
      <div style={styles.fullscreen}>
        <p style={{ color: "#fff", fontSize: 16 }}>⚠️ {gpsError}</p>
        <small style={{ color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
          Activa el GPS e intenta de nuevo
        </small>
      </div>
    );
  }

  if (!userCoords) {
    return (
      <div style={styles.fullscreen}>
        <div style={styles.spinner} />
        <p style={{ color: "#fff", marginTop: 16 }}>
          Obteniendo ubicación GPS...
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <CameraFeed />
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* HUD */}
      <div style={styles.hud}>
        {nearbyObjects.length === 0
          ? "🔍 Sin objetos en esta zona"
          : `✨ ${nearbyObjects.length} objeto${nearbyObjects.length > 1 ? "s" : ""} cerca — gira para encontrarlos`}
      </div>

      {/* Brújula debug — quitar en producción */}
      <div style={styles.compass}>
        🧭 {Math.round(compassRef.current)}° {compassReady ? "✅" : "⏳"}
      </div>

      {selected && (
        <div style={styles.panel}>
          <p style={styles.panelTitle}>📦 {selected.label}</p>
          <p style={styles.panelSub}>A {selected.distance} metros de ti</p>
          <button style={styles.closeBtn} onClick={() => setSelected(null)}>
            ✕ Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

// ── Camera feed ──────────────────────────────────────────────────
function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(console.error);

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{
        position: "absolute",
        top: 50,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: 0,
      }}
    />
  );
}

// ── Estilos ──────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  fullscreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #0f0f1a, #1a0f2e)",
    color: "#fff",
    fontFamily: "sans-serif",
    padding: "0 32px",
    textAlign: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    margin: "0 0 12px",
    letterSpacing: -1,
  },
  desc: {
    fontSize: 16,
    opacity: 0.6,
    maxWidth: 280,
    lineHeight: 1.6,
    margin: "0 0 40px",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #6c63ff, #3ecfcf)",
    color: "#fff",
    border: "none",
    borderRadius: 16,
    padding: "16px 48px",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
  },
  hud: {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    padding: "8px 20px",
    borderRadius: 20,
    fontSize: 13,
    zIndex: 999,
    fontFamily: "monospace",
    border: "1px solid rgba(255,255,255,0.1)",
    whiteSpace: "nowrap",
  },
  compass: {
    position: "fixed",
    top: 60,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,0.5)",
    color: "#00FF88",
    padding: "6px 14px",
    borderRadius: 12,
    zIndex: 999,
    fontFamily: "monospace",
    fontSize: 12,
  },
  panel: {
    position: "fixed",
    bottom: 48,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    padding: "20px 36px",
    borderRadius: 20,
    textAlign: "center",
    zIndex: 999,
    minWidth: 240,
  },
  panelTitle: { fontSize: 22, fontWeight: 700, margin: 0 },
  panelSub: { fontSize: 13, opacity: 0.5, margin: "4px 0 16px" },
  closeBtn: {
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: 10,
    padding: "10px 28px",
    cursor: "pointer",
    fontWeight: 700,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid rgba(255,255,255,0.2)",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};
