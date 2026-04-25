import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button'

describe('Button', () => {
  it('renderiza el texto correctamente', () => {
    render(<Button>Continuar</Button>)
    expect(screen.getByText('Continuar')).toBeInTheDocument()
  })

  it('llama onClick cuando se hace clic', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Clic aquí</Button>)
    fireEvent.click(screen.getByText('Clic aquí'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('no llama onClick cuando está deshabilitado', () => {
    const handleClick = jest.fn()
    render(
      <Button onClick={handleClick} disabled>
        Deshabilitado
      </Button>
    )
    fireEvent.click(screen.getByText('Deshabilitado'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('aplica la clase fullWidth correctamente', () => {
    render(<Button fullWidth>Ancho completo</Button>)
    const btn = screen.getByText('Ancho completo')
    expect(btn.className).toContain('fullWidth')
  })

  it('renderiza como tipo submit', () => {
    render(<Button type="submit">Enviar</Button>)
    expect(screen.getByText('Enviar')).toHaveAttribute('type', 'submit')
  })
})
