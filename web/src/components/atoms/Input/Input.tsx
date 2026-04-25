import { forwardRef } from 'react'
import styles from './Input.module.scss'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorId?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, className, errorId, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={[styles.input, error ? styles.error : '', className].join(' ')}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        {...rest}
      />
    )
  }
)

Input.displayName = 'Input'

export default Input
