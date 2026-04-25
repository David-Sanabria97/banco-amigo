import { useMemo } from 'react'

interface UseCapacidadPagoParams {
  monthlyIncome: number
  monthlyExpenses: number
}

interface CapacidadPagoResult {
  capacidad: number
  porcentajeEgresos: number
  advertencia: boolean
  viable: boolean
}

export function useCapacidadPago({
  monthlyIncome,
  monthlyExpenses,
}: UseCapacidadPagoParams): CapacidadPagoResult {
  return useMemo(() => {
    const capacidad = monthlyIncome - monthlyExpenses
    const porcentajeEgresos = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0

    return {
      capacidad,
      porcentajeEgresos,
      advertencia: porcentajeEgresos >= 80,
      viable: capacidad > 0,
    }
  }, [monthlyIncome, monthlyExpenses])
}
