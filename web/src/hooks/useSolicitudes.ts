import { useQuery } from '@tanstack/react-query'
import solicitudesService from '@/services/solicitudesService'

interface UseSolicitudesParams {
  status?: string
  channel?: string
  search?: string
}

export function useSolicitudes(params?: UseSolicitudesParams) {
  return useQuery({
    queryKey: ['solicitudes', params],
    queryFn: async () => {
      const { data } = await solicitudesService.listar(params)
      return data
    },
  })
}
