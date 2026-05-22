import { useRef, useState, type ReactNode } from 'react'
import { toPng } from 'html-to-image'

interface Props {
  children: ReactNode
  filename?: string
}

export const GenUICapture = ({ children, filename = 'barcabot' }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [capturing, setCapturing] = useState(false)

  const capture = async () => {
    if (!contentRef.current || capturing) return
    setCapturing(true)
    try {
      // pixelRatio: 2 genera imagen a resolución retina (más nítida al guardar)
      const dataUrl = await toPng(contentRef.current, { pixelRatio: 2, cacheBust: true })
      setPreview(dataUrl)
    } catch (err) {
      console.error('[GenUICapture] Error al capturar:', err)
    } finally {
      setCapturing(false)
    }
  }

  const download = () => {
    if (!preview) return
    const a = document.createElement('a')
    a.href = preview
    // Limpia el nombre de archivo (quita caracteres inválidos en nombres de archivo)
    a.download = `${filename.replace(/[^\w\s-]/g, '').trim()}.png`
    a.click()
  }

  return (
    <>
      <div
        className="relative group cursor-pointer"
        onClick={capture}
        title="Haz clic para guardar como imagen"
      >
        {/* Solo este div se captura — el overlay queda fuera */}
        <div ref={contentRef}>{children}</div>

        {/* Overlay de hint, no se incluye en la captura */}
        <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs px-3 py-1 rounded-full select-none">
            {capturing ? 'Capturando…' : 'Guardar imagen'}
          </span>
        </div>
      </div>

      {/* Modal de previsualización */}
      {preview && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={preview}
              alt="Tarjeta generada"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
            />

            <button
              onClick={download}
              className="absolute bottom-4 right-4 flex items-center gap-2 bg-white text-slate-800 text-sm font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-slate-100 transition-colors"
            >
              ⬇ Descargar PNG
            </button>

            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
