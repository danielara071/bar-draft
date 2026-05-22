import type { ReactNode } from 'react'
import { PlayerStatsCard, PlayerNotFoundCard } from '../components/PlayerStatsCard'
import { PlayerListCard } from '../components/PlayerListCard'
import { GenUICapture } from '../components/GenUICapture'

/**
 * Generative UI registry.
 *
 * El modelo decide QUÉ componente aparece eligiendo qué herramienta llamar.
 * El servidor produce los PROPS reales (salida de `execute`, query a Supabase),
 * por lo que el modelo NO puede inventar estadísticas.
 * Aquí solo mapeamos toolName -> cómo renderizar esa salida (`part.output`).
 *
 * Añadir una tarjeta GenUI nueva = una entrada más aquí.
 * `ChatMessages` NO se modifica nunca: itera el registry, no usa if/else.
 */
type GenUIRenderer = (output: any) => ReactNode

const genuiRegistry: Record<string, GenUIRenderer> = {
  getPlayerStats: (output) =>
    output?.found
      ? <GenUICapture filename={output.player.nombre}><PlayerStatsCard player={output.player} /></GenUICapture>
      : <PlayerNotFoundCard query={output?.query} />,

  getPlayerList: (output) =>
    <GenUICapture filename={output?.titulo ?? 'lista-jugadores'}><PlayerListCard titulo={output?.titulo} jugadores={output?.jugadores ?? []} /></GenUICapture>,
}

// En ai@6 las herramientas estáticas (definidas en el servidor con `tool()`) emiten
// parts con type 'tool-<nombre>'. Las herramientas dinámicas (generadas en runtime)
// usan type 'dynamic-tool' y guardan el nombre en part.toolName en lugar del type.
// Esta función normaliza ambos formatos a un único string con el nombre de la herramienta.
const getToolName = (part: any): string | null => {
  if (typeof part?.type !== 'string') return null
  if (part.type === 'dynamic-tool') return part.toolName ?? null
  if (part.type.startsWith('tool-')) return part.type.slice('tool-'.length)
  return null
}

/**
 * Si esta part es una tool-call terminada con un componente registrado,
 * devuelve el nodo React; si no, null. Sin lógica condicional por herramienta.
 */
export const renderGenUIPart = (part: any): ReactNode | null => {
  if (part?.state !== 'output-available') return null
  const toolName = getToolName(part)
  if (!toolName) return null
  const renderer = genuiRegistry[toolName]
  return renderer ? renderer(part.output) : null
}

/** Nodos GenUI de un mensaje del asistente (preserva orden, soporta varios). */
export const collectGenUI = (message: any): ReactNode[] => {
  const parts: any[] = message?.parts ?? []
  const nodes: ReactNode[] = []
  parts.forEach((part, i) => {
    const node = renderGenUIPart(part)
    if (node) nodes.push(<div key={`genui-${i}`} className="pl-8">{node}</div>)
  })
  return nodes
}
