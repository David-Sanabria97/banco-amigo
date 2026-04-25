import { useQuery } from '@tanstack/react-query'
import solicitudesService from '@/services/solicitudesService'

export function useSolicitud(id: string) {
  return useQuery({
    queryKey: ['solicitud', id],
    queryFn: async () => {
      const { data } = await solicitudesService.obtener(id)
      return data
    },
    enabled: !!id,
  })
}

export function useSolicitudEventos(id: string) {
  return useQuery({
    queryKey: ['solicitud-eventos', id],
    queryFn: async () => {
      const { data } = await solicitudesService.obtenerEventos(id)
      return data
    },
    enabled: !!id,
  })
}
