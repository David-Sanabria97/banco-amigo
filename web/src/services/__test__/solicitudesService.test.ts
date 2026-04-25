import axios from 'axios'
import solicitudesService from '../solicitudesService'

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}))
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('solicitudesService', () => {
  it('tiene definido el método crear', () => {
    expect(typeof solicitudesService.crear).toBe('function')
  })

  it('tiene definido el método listar', () => {
    expect(typeof solicitudesService.listar).toBe('function')
  })

  it('tiene definido el método obtener', () => {
    expect(typeof solicitudesService.obtener).toBe('function')
  })

  it('tiene definido el método actualizar', () => {
    expect(typeof solicitudesService.actualizar).toBe('function')
  })

  it('tiene definido el método simularOferta', () => {
    expect(typeof solicitudesService.simularOferta).toBe('function')
  })

  it('tiene definido el método finalizar', () => {
    expect(typeof solicitudesService.finalizar).toBe('function')
  })

  it('tiene definido el método abandonar', () => {
    expect(typeof solicitudesService.abandonar).toBe('function')
  })

  it('tiene definido el método obtenerEventos', () => {
    expect(typeof solicitudesService.obtenerEventos).toBe('function')
  })
})
