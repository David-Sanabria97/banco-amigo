import { forwardRef } from 'react'
import Label from '@/components/atoms/Label'
import Input from '@/components/atoms/Input'
import styles from './FormField.module.scss'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  required?: boolean
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, error, required = false, ...rest }, ref) => {
    const errorId = error ? `${id}-error` : undefined

    return (
      <div className={styles.field}>
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        <Input id={id} ref={ref} error={!!error} errorId={errorId} {...rest} />
        {error && (
          <span id={errorId} className={styles.errorMsg} role="alert" aria-live="polite">
            {error}
          </span>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

export default FormField
