import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { COLORS } from '../../config/design.system';

// ============================================================================
// FORM FIELD
// ============================================================================

interface FormFieldProps {
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  success,
  hint,
  required,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-400 text-xs mt-1"
        >
          <AlertCircle size={14} />
          {error}
        </motion.div>
      )}
      {success && !error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-green-400 text-xs mt-1"
        >
          <CheckCircle size={14} />
          Validado com sucesso
        </motion.div>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
};

// ============================================================================
// FORM GROUP (AGRUPAR MÚLTIPLOS CAMPOS)
// ============================================================================

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  className = '',
  columns = 1,
}) => {
  const colClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
  }[columns];

  return (
    <div className={`grid ${colClass} gap-4 ${className}`}>
      {children}
    </div>
  );
};

// ============================================================================
// PASSWORD INPUT COM TOGGLE
// ============================================================================

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  success,
  hint,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField label={label} error={error} success={success} hint={hint}>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          {...props}
          className={`w-full px-4 py-2 rounded-lg bg-surface border border-cyan/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-all ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </FormField>
  );
};

// ============================================================================
// CHECKBOX COM LABEL
// ============================================================================

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  className = '',
  ...props
}) => {
  return (
    <label className={`flex items-start gap-3 cursor-pointer group ${className}`}>
      <div className="relative mt-1">
        <input
          type="checkbox"
          {...props}
          className="sr-only"
        />
        <div className="w-5 h-5 rounded border-2 border-cyan/50 bg-surface group-hover:border-cyan transition-all group-hover:shadow-lg group-hover:shadow-cyan/20" />
        <motion.div
          initial={false}
          animate={props.checked ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          className="absolute inset-0 w-5 h-5 rounded flex items-center justify-center bg-gradient-to-br from-cyan to-blue-500"
        >
          <svg
            className="w-3 h-3 text-black"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </motion.div>
      </div>
      {label && (
        <div>
          <p className="text-sm font-medium text-gray-200">{label}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
      )}
    </label>
  );
};

// ============================================================================
// RADIO GROUP
// ============================================================================

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  inline?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  className = '',
  inline = false,
}) => {
  const containerClass = inline ? 'flex flex-row gap-4 flex-wrap' : 'flex flex-col gap-3';

  return (
    <div className={`${containerClass} ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-1">
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              className="sr-only"
            />
            <div className="w-5 h-5 rounded-full border-2 border-cyan/50 bg-surface group-hover:border-cyan transition-all group-hover:shadow-lg group-hover:shadow-cyan/20" />
            <motion.div
              initial={false}
              animate={value === option.value ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              className="absolute inset-0 w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan to-blue-500"
            >
              <div className="w-2 h-2 rounded-full bg-black" />
            </motion.div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">{option.label}</p>
            {option.description && <p className="text-xs text-gray-500 mt-1">{option.description}</p>}
          </div>
        </label>
      ))}
    </div>
  );
};

// ============================================================================
// SELECT/DROPDOWN
// ============================================================================

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  label,
  error,
  success,
  hint,
  placeholder = 'Selecione uma opção',
  className = '',
  ...props
}) => {
  return (
    <FormField label={label} error={error} success={success} hint={hint}>
      <select
        {...props}
        className={`w-full px-4 py-2 rounded-lg bg-surface border border-cyan/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-all appearance-none cursor-pointer ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '20px',
          paddingRight: '40px',
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

// ============================================================================
// TEXTAREA
// ============================================================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  success,
  hint,
  maxLength,
  showCharCount = false,
  value = '',
  className = '',
  ...props
}) => {
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <FormField label={label} error={error} success={success} hint={hint}>
      <div>
        <textarea
          {...props}
          value={value}
          maxLength={maxLength}
          className={`w-full px-4 py-3 rounded-lg bg-surface border border-cyan/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-all resize-none ${className}`}
          rows={4}
        />
        {showCharCount && maxLength && (
          <p className="text-xs text-gray-500 mt-2 text-right">
            {charCount} / {maxLength}
          </p>
        )}
      </div>
    </FormField>
  );
};

// ============================================================================
// RANGE SLIDER
// ============================================================================

interface RangeSliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  value = 50,
  className = '',
  ...props
}) => {
  const percentage = ((Number(value) - min) / (max - min)) * 100;

  return (
    <div className={className}>
      {label && <label className="text-sm font-medium text-gray-200 mb-2 block">{label}</label>}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          {...props}
          className="w-full h-2 bg-surface border border-cyan/30 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${percentage}%, #1e293b ${percentage}%, #1e293b 100%)`,
          }}
        />
      </div>
      {showValue && (
        <p className="text-sm text-cyan mt-2">
          {value} {max === 100 && '%'}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// FORM COM SUBMIT
// ============================================================================

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  submitLabel?: string;
  submitVariant?: 'primary' | 'secondary' | 'danger';
}

export const Form: React.FC<FormProps> = ({
  children,
  isLoading = false,
  submitLabel = 'Enviar',
  submitVariant = 'primary',
  className = '',
  ...props
}) => {
  return (
    <form {...props} className={`space-y-6 ${className}`}>
      {children}
    </form>
  );
};

export default {
  FormField,
  FormGroup,
  PasswordInput,
  Checkbox,
  RadioGroup,
  Select,
  Textarea,
  RangeSlider,
  Form,
};
