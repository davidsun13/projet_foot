import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
};

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-red-600 text-black hover:bg-red-700 focus:ring-red-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300',
  ghost: 'bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-200',
  danger: 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-200',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5 rounded',
  md: 'text-sm px-4 py-2 rounded-md',
  lg: 'text-base px-5 py-3 rounded-md',
};

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cx('animate-spin', className || 'w-4 h-4')}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    className,
    ...rest
  } = props;

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={props.type || 'button'}
      disabled={isDisabled}
      {...rest}
      className={cx(
        'inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1',
        variantClasses[variant],
        sizeClasses[size],
        isDisabled ? 'opacity-60 cursor-not-allowed' : 'shadow-sm',
        className
      )}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <span className="flex items-center space-x-2">
          <Spinner className="w-4 h-4 text-current" />
          {children ? <span className="sr-only">Chargement</span> : null}
        </span>
      ) : (
        <>
          {leftIcon && <span className="mr-2 inline-flex items-center">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2 inline-flex items-center">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

export default Button;