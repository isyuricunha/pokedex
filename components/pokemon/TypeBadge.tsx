import { TypeName, TYPE_COLORS } from '@/lib/types/pokemon';

interface TypeBadgeProps {
  type: TypeName;
  size?: 'sm' | 'md' | 'lg';
}

export default function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const backgroundColor = TYPE_COLORS[type] || TYPE_COLORS.unknown;

  return (
    <span
      className={`inline-block rounded-full font-medium text-white ${sizeClasses[size]} transition-transform hover:scale-105`}
      style={{ backgroundColor }}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}
