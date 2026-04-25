import { useState, useCallback } from 'react'
import solicitudesService, { SimulationResult } from '@/services/solicitudesService'

type SimulacionEstado = 'idle' | 'loading' | 'success' | 'not_viable' | 'error'

interface UseSimulacionResult {
  estado: SimulacionEstado
  resultado: SimulationResult | null
  correlationId: string | null
  simular: (applicationId: string) => Promise<void>
  reintentar: (applicationId: string) => Promise<void>
  setEstado: (estado: SimulacionEstado) => void
}

export function useSimulacion(): UseSimulacionResult {
  const [estado, setEstado] = useState<SimulacionEstado>('idle')
  const [resultado, setResultado] = useState<SimulationResult | null>(null)
  const [correlationId, setCorrelationId] = useState<string | null>(null)

  const simular = useCallback(async (applicationId: string) => {
    setEstado('loading')
    setResultado(null)

    try {
      const { data } = await solicitudesService.simularOferta(applicationId)
      if (data.viable) {
        setResultado(data)
        setEstado('success')
      } else {
        setResultado(data)
        setEstado('not_viable')
      }
    } catch {
      const id = crypto.randomUUID()
      setCorrelationId(id)
      setEstado('error')
    }
  }, [])

  const reintentar = useCallback(
    async (applicationId: string) => {
      setCorrelationId(null)
      await simular(applicationId)
    },
    [simular]
  )

  return { estado, resultado, correlationId, simular, reintentar, setEstado }
}
