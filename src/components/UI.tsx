import React from 'react';

// ========================== BUTTON COMPONENT ==========================
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  id,
  onClick,
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] shadow-sm shadow-primary-600/10',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-sm',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    accent: 'bg-primary-50 text-primary-700 hover:bg-primary-100'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 rounded-full'
  };

  return (
    <button
      id={id}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

// ========================== CARD COMPONENTS ==========================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', id, onClick }: CardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white border border-slate-200 shadow-sm rounded-3xl transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-primary-200 hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)]' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-8 pb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-xl font-bold font-display tracking-tight text-slate-800 ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs text-slate-400 mt-1 leading-relaxed ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-8 pt-0 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-8 pt-0 border-t border-slate-100 flex items-center justify-end ${className}`}>{children}</div>;
}

// ========================== SLIDER COMPONENT ==========================
interface SliderProps {
  id?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  className?: string;
}

export function Slider({
  id,
  min,
  max,
  step = 1,
  value,
  onChange,
  className = ''
}: SliderProps) {
  // Calculate fill percentage for custom styling track fill
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <div className="relative w-full h-2 rounded-full bg-slate-100 flex items-center">
        {/* Fill track */}
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-700"
          style={{ width: `${percentage}%` }}
        />
        {/* Invisible default input overlay for standard sliding support */}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-thumb absolute left-0 w-full h-full opacity-100 cursor-pointer appearance-none bg-transparent"
        />
      </div>
      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// ========================== PROGRESS COMPONENT ==========================
interface ProgressProps {
  id?: string;
  value: number; // percentage (0 to 100)
  className?: string;
}

export function Progress({ id, value, className = '' }: ProgressProps) {
  // Constrain value
  const pct = Math.min(Math.max(0, value), 100);

  return (
    <div
      id={id}
      className={`w-full h-1.5 rounded-full bg-slate-100 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-primary-600 to-primary-700 transition-all duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
