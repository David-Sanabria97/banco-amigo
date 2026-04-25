import { renderHook } from '@testing-library/react'
import { useCapacidadPago } from '../useCapacidadPago'

describe('useCapacidadPago', () => {
  it('calcula correctamente la capacidad de pago', () => {
    const { result } = renderHook(() =>
      useCapacidadPago({ monthlyIncome: 3500000, monthlyExpenses: 1200000 })
    )
    expect(result.current.capacidad).toBe(2300000)
  })

  it('detecta advertencia cuando egresos superan el 80% de ingresos', () => {
    const { result } = renderHook(() =>
      useCapacidadPago({ monthlyIncome: 3500000, monthlyExpenses: 3000000 })
    )
    expect(result.current.advertencia).toBe(true)
  })

  it('no genera advertencia cuando egresos son menores al 80%', () => {
    const { result } = renderHook(() =>
      useCapacidadPago({ monthlyIncome: 3500000, monthlyExpenses: 1200000 })
    )
    expect(result.current.advertencia).toBe(false)
  })

  it('marca como no viable cuando capacidad es negativa', () => {
    const { result } = renderHook(() =>
      useCapacidadPago({ monthlyIncome: 1000000, monthlyExpenses: 1500000 })
    )
    expect(result.current.viable).toBe(false)
    expect(result.current.capacidad).toBe(-500000)
  })

  it('retorna porcentaje de egresos correcto', () => {
    const { result } = renderHook(() =>
      useCapacidadPago({ monthlyIncome: 2000000, monthlyExpenses: 1000000 })
    )
    expect(result.current.porcentajeEgresos).toBe(50)
  })

  it('maneja ingresos en cero sin dividir por cero', () => {
    const { result } = renderHook(() => useCapacidadPago({ monthlyIncome: 0, monthlyExpenses: 0 }))
    expect(result.current.porcentajeEgresos).toBe(0)
  })
})
