import { cn } from '../lib/utils';

export default function TagFilter({ tags, activeTag, onChange }) {
  if (!tags.length) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <span className="flex-shrink-0 text-xs text-gray-400 font-medium">Tags:</span>
      <button
        onClick={() => onChange(null)}
        className={cn(
          'flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors',
          !activeTag
            ? 'bg-accent text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        )}
      >
        All
      </button>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onChange(activeTag === tag ? null : tag)}
          className={cn(
            'flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize',
            activeTag === tag
              ? 'bg-accent text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
