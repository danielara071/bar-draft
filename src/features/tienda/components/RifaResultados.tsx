import { useEffect, useMemo, useState } from "react";
import {
  Trophy,
  Upload,
  X,
  Video,
  CircleAlert,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { supabase } from "../../../shared/services/supabaseClient";
import { useUserInfo } from "./hooks/useUserInfo";

type ResultadoItem = {
  id: number;
  name: string;
  image_url: string | null;
  fecha_cierre: string | null;
  gano: boolean;
  type: "boleto" | "experiencia" | "viaje";
  video_url?: string | null;
};

type VideoModalProps = {
  resultado: ResultadoItem;
  onClose: () => void;
  onUploaded: (rifaId: number, videoUrl: string) => void;
};

const VideoSubmissionModal = ({
  resultado,
  onClose,
  onUploaded,
}: VideoModalProps) => {
  const session = useUserInfo();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const yaSubido = Boolean(resultado.video_url);

  const reglas = useMemo(
    () => [
      "El video debe ser original y grabado por ti.",
      "No se permite contenido ofensivo, discriminatorio, político o sexual.",
      "No incluyas música, imágenes o material con derechos de autor sin permiso.",
      "Duración recomendada: entre 10 y 30 segundos.",
      "Formatos permitidos: MP4, MOV o WEBM.",
      "El club puede rechazar material que no cumpla con lineamientos de calidad o contenido.",
      "Al subir el video, autorizas su uso para mostrarse en el estadio dentro del contexto de la dinámica.",
    ],
    [],
  );

  const instrucciones = useMemo(
    () => [
      "Graba un video corto en formato vertical u horizontal.",
      "Asegúrate de que tu rostro, mensaje o contenido se vea claramente.",
      "Evita ruido excesivo o iluminación muy baja.",
      "Selecciona el archivo desde tu dispositivo.",
      "Presiona “Subir video” para enviarlo.",
    ],
    [],
  );

  const handleUpload = async () => {
    if (yaSubido) {
      setErrorMsg("Ya subiste un video para esta rifa. No puedes volver a subir otro.");
      return;
    }

    if (!session?.user?.id) {
      setErrorMsg("Debes iniciar sesión para subir tu video.");
      return;
    }

    if (!videoFile) {
      setErrorMsg("Selecciona un archivo de video antes de continuar.");
      return;
    }

    const allowedTypes = ["video/mp4", "video/quicktime", "video/webm"];
    if (!allowedTypes.includes(videoFile.type)) {
      setErrorMsg("Formato no permitido. Usa MP4, MOV o WEBM.");
      return;
    }

    const maxSizeMB = 50;
    if (videoFile.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`El video supera el límite de ${maxSizeMB}MB.`);
      return;
    }

    try {
      setSubiendo(true);
      setErrorMsg(null);

      const fileExt = videoFile.name.split(".").pop()?.toLowerCase() ?? "mp4";
      const filePath = `${session.user.id}/rifa-${resultado.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("video_rifas")
        .upload(filePath, videoFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: videoFile.type,
        });

      if (uploadError) {
        setErrorMsg(uploadError.message || "No se pudo subir el video. Intenta de nuevo.");
        return;
      }

      const { data: publicData } = supabase.storage
        .from("video_rifas")
        .getPublicUrl(filePath);

      const publicUrl = publicData.publicUrl;

      const payload = {
        rifa_id: resultado.id,
        ganador_id: session.user.id,
        video_url: publicUrl,
      };

      const { error: insertError } = await supabase
        .from("rifa_ganadores")
        .insert(payload);

      if (insertError) {
        setErrorMsg(
          insertError.message ||
            "El video se subió, pero no se pudo guardar la referencia en la base de datos."
        );
        return;
      }

      onUploaded(resultado.id, publicUrl);
      onClose();
    } catch {
      setErrorMsg("Ocurrió un error inesperado al subir el video.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              Sube tu video para el estadio
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Premio ganado:{" "}
              <span className="font-semibold text-gray-800">{resultado.name}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-4">
            <div className="flex items-start gap-3">
              <Video className="text-[#004d98] mt-0.5" size={18} />
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  ¿Qué pasará con tu video?
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Como ganador de una rifa de experiencia, puedes enviar un video corto
                  para que sea considerado para mostrarse en el estadio. El contenido debe
                  cumplir con las reglas de seguridad, respeto y calidad visual.
                </p>
              </div>
            </div>
          </div>

          {yaSubido && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
              <div className="flex items-start gap-3">
                <Lock className="text-amber-600 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold text-amber-800 mb-1">
                    Video ya enviado
                  </p>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Ya registraste un video para esta rifa. El formulario quedó bloqueado
                    y no se permiten nuevas cargas.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-extrabold text-gray-900 mb-3 uppercase tracking-wide">
              Instrucciones
            </h4>
            <div className="space-y-2">
              {instrucciones.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#004d98] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-gray-900 mb-3 uppercase tracking-wide">
              Reglamento
            </h4>
            <div className="space-y-2">
              {reglas.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <CircleAlert size={14} className="mt-0.5 text-[#A50044] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              yaSubido
                ? "border-gray-200 bg-gray-100 opacity-80"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Archivo de video
            </label>

            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              disabled={yaSubido || subiendo}
              onChange={(e) => {
                if (yaSubido) return;
                setErrorMsg(null);
                setVideoFile(e.target.files?.[0] ?? null);
              }}
              className="block w-full text-sm text-gray-600 disabled:opacity-60 disabled:cursor-not-allowed file:mr-4 file:rounded-xl file:border-0 file:bg-[#004d98] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-[#003a75] disabled:file:bg-gray-300 disabled:file:text-gray-500"
            />

            <p className="text-xs text-gray-400 mt-2">
              Formatos permitidos: MP4, MOV, WEBM. Tamaño máximo: 50MB.
            </p>

            {videoFile && !yaSubido && (
              <div className="mt-3 rounded-xl bg-white border border-gray-200 px-3 py-2 text-sm text-gray-700">
                Archivo seleccionado:{" "}
                <span className="font-semibold">{videoFile.name}</span>
              </div>
            )}

            {yaSubido && resultado.video_url && (
              <div className="mt-3 rounded-xl bg-green-50 border border-green-100 px-3 py-3 text-sm text-green-700 flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Ya subiste un video para esta rifa.</p>
                  <a
                    href={resultado.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Ver video actual
                  </a>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
                {errorMsg}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={handleUpload}
            disabled={yaSubido || subiendo || !videoFile}
            className={`px-5 py-2.5 rounded-xl font-bold text-white transition flex items-center gap-2 ${
              yaSubido || subiendo || !videoFile
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#A50044] hover:bg-[#8a003a]"
            }`}
          >
            <Upload size={16} />
            {yaSubido ? "Video ya enviado" : subiendo ? "Subiendo..." : "Subir video"}
          </button>
        </div>
      </div>
    </div>
  );
};

const RifasResultados = () => {
  const session = useUserInfo();
  const [resultados, setResultados] = useState<ResultadoItem[]>([]);
  const [resultadoSeleccionado, setResultadoSeleccionado] =
    useState<ResultadoItem | null>(null);

  useEffect(() => {
    const fetchResultados = async () => {
      if (!session?.user?.id) return;

      const { data: boletosData } = await supabase
        .from("rifa_boletos")
        .select("rifa_id")
        .eq("user_id", session.user.id);

      if (!boletosData || boletosData.length === 0) return;

      const rifaIds = boletosData.map((b) => b.rifa_id);

      const { data: rifasData, error } = await supabase
        .from("rifas")
        .select("id, name, image_url, fecha_cierre, ganador_id, type")
        .eq("estado", "terminada")
        .in("id", rifaIds)
        .order("fecha_cierre", { ascending: false });

      if (error || !rifasData) return;

      const { data: ganadoresData } = await supabase
        .from("rifa_ganadores")
        .select("rifa_id, video_url")
        .in("rifa_id", rifaIds);

      const videoMap = new Map<number, string | null>();
      (ganadoresData ?? []).forEach((item) => {
        videoMap.set(item.rifa_id, item.video_url);
      });

      const mapped: ResultadoItem[] = rifasData.map((r) => ({
        id: r.id,
        name: r.name,
        image_url: r.image_url,
        fecha_cierre: r.fecha_cierre,
        gano: r.ganador_id === session.user.id,
        type: r.type,
        video_url: videoMap.get(r.id) ?? null,
      }));

      setResultados(mapped);
    };

    void fetchResultados();
  }, [session]);

  if (resultados.length === 0) return null;

  return (
    <>
      <div className="mt-5">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Resultados Recientes
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {resultados.map((r) => {
            const fecha = r.fecha_cierre
              ? new Date(r.fecha_cierre).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })
              : null;

            const puedeSubirVideo = r.gano && r.type === "experiencia";

            return (
              <div
                key={r.id}
                className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#0d2b4d] to-[#1a3a6b] flex-shrink-0 flex items-center justify-center">
                  {r.image_url ? (
                    <img
                      src={r.image_url}
                      alt={r.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Trophy
                      size={28}
                      className="text-[#EDBB00]/70"
                      strokeWidth={1.4}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-gray-900 truncate">
                    {r.name}
                  </p>
                  {fecha && (
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      Finalizada el {fecha}
                    </p>
                  )}
                  {puedeSubirVideo && (
                    <p className="text-[12px] text-[#004d98] font-semibold mt-1">
                      Premio especial: puedes subir un video para mostrarse en el estadio.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {puedeSubirVideo && (
                    <button
                      type="button"
                      onClick={() => setResultadoSeleccionado(r)}
                      className="bg-[#004d98] hover:bg-[#003a75] text-white font-bold text-[13px] px-4 py-2.5 rounded-xl transition"
                    >
                      {r.video_url ? "Ver video enviado" : "Subir video"}
                    </button>
                  )}

                  {r.gano ? (
                    <div className="flex items-center gap-2 bg-[#EDBB00] text-gray-900 font-bold text-[13px] px-5 py-2.5 rounded-xl">
                      <Trophy size={16} strokeWidth={2} />
                      <span>¡Ganaste!</span>
                    </div>
                  ) : (
                    <div className="bg-gray-200 text-gray-500 font-semibold text-[13px] px-5 py-2.5 rounded-xl">
                      No ganaste
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {resultadoSeleccionado && (
        <VideoSubmissionModal
          resultado={resultadoSeleccionado}
          onClose={() => setResultadoSeleccionado(null)}
          onUploaded={(rifaId, videoUrl) => {
            setResultados((prev) =>
              prev.map((item) =>
                item.id === rifaId ? { ...item, video_url: videoUrl } : item
              )
            );
          }}
        />
      )}
    </>
  );
};

export default RifasResultados;