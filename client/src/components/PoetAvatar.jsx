import { cn } from '../lib/utils';

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

export default function PoetAvatar({ poet, size = 'md', className }) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 select-none',
        sizes[size],
        className
      )}
      style={{ backgroundColor: poet?.color || '#7F77DD' }}
      title={poet?.name}
    >
      {poet?.initials || '?'}
    </div>
  );
}
