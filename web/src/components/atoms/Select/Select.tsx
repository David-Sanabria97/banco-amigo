import styles from './Select.module.scss'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  id?: string
  options: SelectOption[]
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void
  error?: boolean
  disabled?: boolean
  placeholder?: string
}

export default function Select({
  id,
  options,
  value,
  onChange,
  onBlur,
  error = false,
  disabled = false,
  placeholder,
}: SelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className={[styles.select, error ? styles.error : ''].join(' ')}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
