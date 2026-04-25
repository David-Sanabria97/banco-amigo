import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import solicitudReducer from '@/store/slices/solicitudSlice'
import BasicDataForm from '../BasicDataForm'

jest.mock('@/services/solicitudesService', () => ({
  default: {
    crear: jest.fn().mockResolvedValue({
      data: { id: 'mock-id-123', status: 'DRAFT' },
    }),
  },
}))

const renderWithStore = (component: React.ReactNode) => {
  const store = configureStore({
    reducer: { solicitud: solicitudReducer },
  })
  return render(<Provider store={store}>{component}</Provider>)
}

describe('BasicDataForm', () => {
  it('renderiza el título correctamente', () => {
    renderWithStore(<BasicDataForm />)
    expect(screen.getByText('Comencemos con tus datos')).toBeInTheDocument()
  })

  it('muestra las opciones de canal', () => {
    renderWithStore(<BasicDataForm />)
    expect(screen.getByText('Autoservicio')).toBeInTheDocument()
    expect(screen.getByText('Asistido')).toBeInTheDocument()
  })

  it('muestra errores cuando se envía el formulario vacío', async () => {
    renderWithStore(<BasicDataForm />)
    fireEvent.click(screen.getByText('Continuar →'))
    await waitFor(() => {
      expect(screen.getByText('Mínimo 5 caracteres')).toBeInTheDocument()
    })
  })

  it('muestra error de correo inválido', async () => {
    renderWithStore(<BasicDataForm />)
    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com')
    fireEvent.change(emailInput, { target: { value: 'correo-invalido' } })
    fireEvent.click(screen.getByText('Continuar →'))
    await waitFor(() => {
      expect(screen.getByText('Ingresa un correo electrónico válido')).toBeInTheDocument()
    })
  })

  it('muestra el indicador de paso 1 de 4', () => {
    renderWithStore(<BasicDataForm />)
    expect(screen.getByText('Paso 1 de 4')).toBeInTheDocument()
  })
})
