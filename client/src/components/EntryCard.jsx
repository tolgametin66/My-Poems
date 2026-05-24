import { Star, Edit2, Quote, BookOpen, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import PoetAvatar from './PoetAvatar';
import ConfirmDelete from './ConfirmDelete';

export default function EntryCard({ entry, onEdit, onDelete, onToggleFavorite, view = 'grid' }) {
  const navigate = useNavigate();
  const poet = entry.poet_id ? {
    id: entry.poet_id,
    name: entry.poet_name,
    initials: entry.poet_initials,
    color: entry.poet_color,
  } : null;

  const isList = view === 'list';

  return (
    <div
      className={cn(
        'card group relative overflow-hidden',
        isList ? 'flex items-start gap-4 p-4' : 'flex flex-col p-5',
        entry.is_favorite && 'border-l-4 border-l-accent'
      )}
    >
      {/* Type badge */}
      <div className={cn('flex items-center gap-2', isList ? 'flex-shrink-0 w-5' : 'mb-3')}>
        {!isList && (
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
            entry.type === 'poem'
              ? 'bg-accent/10 text-accent'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
          )}>
            {entry.type === 'poem' ? <BookOpen size={11} /> : <Quote size={11} />}
            {entry.type}
          </span>
        )}
      </div>

      {/* Main content */}
      <div className={cn('flex-1 min-w-0', isList && 'flex items-start gap-4')}>
        {isList && (
          <div className="flex-shrink-0 mt-0.5">
            {entry.type === 'poem'
              ? <BookOpen size={14} className="text-accent" />
              : <Quote size={14} className="text-amber-500" />
            }
          </div>
        )}

        <div className="flex-1 min-w-0">
          <button
            onClick={() => navigate(`/entry/${entry.id}`)}
            className={cn(
              'font-serif font-medium leading-snug text-left hover:text-accent transition-colors line-clamp-2 block',
              isList ? 'text-base' : 'text-lg mb-2'
            )}
          >
            {entry.title}
          </button>

          {!isList && (
            <p className="text-sm text-gray-500 dark:text-gray-400 font-serif italic line-clamp-3 leading-relaxed">
              {entry.excerpt}
            </p>
          )}

          {/* Tags */}
          {entry.tags?.length > 0 && !isList && (
            <div className="flex flex-wrap gap-1 mt-3">
              {entry.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {tag}
                </span>
              ))}
              {entry.tags.length > 3 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
                  +{entry.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* List view: tags inline */}
        {isList && entry.tags?.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-1 flex-shrink-0">
            {entry.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={cn(
        'flex items-center justify-between',
        isList ? 'flex-shrink-0 ml-auto gap-2' : 'mt-4 pt-3 border-t border-gray-50 dark:border-gray-800'
      )}>
        {/* Poet */}
        {!isList && poet && (
          <div className="flex items-center gap-2 min-w-0">
            <PoetAvatar poet={poet} size="xs" />
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{poet.name}</span>
          </div>
        )}
        {!isList && !poet && <span className="text-xs text-gray-400 italic">Anonymous</span>}

        {/* Actions */}
        <div className={cn(
          'flex items-center gap-0.5',
          !isList && 'opacity-0 group-hover:opacity-100 transition-opacity'
        )}>
          <button
            onClick={() => onToggleFavorite(entry)}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              entry.is_favorite
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
            )}
            title={entry.is_favorite ? 'Unfavorite' : 'Favorite'}
          >
            <Star size={15} fill={entry.is_favorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => onEdit(entry)}
            className="p-1.5 rounded-md text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors"
            title="Edit"
          >
            <Edit2 size={15} />
          </button>
          <ConfirmDelete onConfirm={() => onDelete(entry.id)} />
        </div>
      </div>
    </div>
  );
}
