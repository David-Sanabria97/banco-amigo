/**
 * Formatea un valor numérico como moneda colombiana (COP)
 */
export const formatCurrency = (value?: number): string => {
  if (!value && value !== 0) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value)
}

/**
 * Formatea una fecha ISO como fecha corta (dd/mm/yyyy)
 */
export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

/**
 * Formatea una fecha ISO con hora completa (dd/mm/yyyy hh:mm:ss)
 */
export const formatDateTime = (dateStr: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(dateStr))
}

/**
 * Fórmula de amortización francesa
 * Calcula la cuota mensual de un crédito con interés compuesto
 */
export const calculateMonthlyPayment = (
  amount: number,
  termMonths: number,
  monthlyRate: number = 0.018
): number => {
  if (amount <= 0 || termMonths <= 0) return 0
  return Math.round(
    (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1)
  )
}
