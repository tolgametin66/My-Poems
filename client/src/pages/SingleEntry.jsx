import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Edit2, BookOpen, Quote, Globe, Calendar, ExternalLink } from 'lucide-react';
import { cn, formatYear } from '../lib/utils';
import { api } from '../api';
import { useApp } from '../context/AppContext';
import PoetAvatar from '../components/PoetAvatar';
import EntryModal from '../components/EntryModal';
import ConfirmDelete from '../components/ConfirmDelete';

export default function SingleEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { entries, poets, updateEntry, deleteEntry } = useApp();

  const [editModal, setEditModal] = useState(false);

  const entry = entries.find(e => e.id === Number(id));
  const poet = entry?.poet_id ? poets.find(p => p.id === entry.poet_id) : null;

  const related = entries
    .filter(e => e.id !== Number(id) && e.poet_id === entry?.poet_id && entry?.poet_id)
    .slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!entry) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Entry not found.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          <ArrowLeft size={16} /> Back to collection
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteEntry(entry.id);
    navigate('/');
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          {/* Main content */}
          <article>
            {/* Type badge */}
            <span className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-4',
              entry.type === 'poem'
                ? 'bg-accent/10 text-accent'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
            )}>
              {entry.type === 'poem' ? <BookOpen size={12} /> : <Quote size={12} />}
              {entry.type}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-2">
              {entry.title}
            </h1>

            {(entry.source || entry.year) && (
              <p className="text-sm text-gray-400 mb-6 italic">
                {[entry.source, entry.year].filter(Boolean).join(', ')}
              </p>
            )}

            {/* Body */}
            <div className="entry-body text-gray-800 dark:text-gray-200 text-lg leading-[1.9]">
              {entry.body}
            </div>

            {/* Tags */}
            {entry.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {entry.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-accent/10 hover:text-accent transition-colors capitalize"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <button
                onClick={() => updateEntry(entry.id, { is_favorite: !entry.is_favorite })}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  entry.is_favorite
                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
                    : 'text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                )}
              >
                <Star size={15} fill={entry.is_favorite ? 'currentColor' : 'none'} />
                {entry.is_favorite ? 'Favorited' : 'Add to favorites'}
              </button>
              <button
                onClick={() => setEditModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-accent hover:bg-accent/10 transition-colors"
              >
                <Edit2 size={15} /> Edit
              </button>
              <ConfirmDelete onConfirm={handleDelete} label="Delete entry" />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Poet card */}
            {poet && (
              <div className="card p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">About the poet</h3>
                <div className="flex items-center gap-3 mb-3">
                  <PoetAvatar poet={poet} size="md" />
                  <div>
                    <Link
                      to={`/?poet=${poet.id}`}
                      className="font-serif font-semibold text-gray-900 dark:text-gray-100 hover:text-accent transition-colors"
                    >
                      {poet.name}
                    </Link>
                    {formatYear(poet.born, poet.died) && (
                      <p className="text-xs text-gray-400">{formatYear(poet.born, poet.died)}</p>
                    )}
                  </div>
                </div>
                {poet.nationality && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                    <Globe size={11} /> {poet.nationality}
                  </p>
                )}
                {poet.bio && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-4">{poet.bio}</p>
                )}
                <Link
                  to={`/?poet=${poet.id}`}
                  className="mt-3 text-xs text-accent hover:underline flex items-center gap-1"
                >
                  All entries by {poet.name} <ExternalLink size={10} />
                </Link>
              </div>
            )}

            {/* Related entries */}
            {related.length > 0 && (
              <div className="card p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  More from {poet?.name || 'this poet'}
                </h3>
                <div className="space-y-3">
                  {related.map(rel => (
                    <Link
                      key={rel.id}
                      to={`/entry/${rel.id}`}
                      className="block group"
                    >
                      <p className="font-serif text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-accent transition-colors line-clamp-1">
                        {rel.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">{rel.type}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <EntryModal
        open={editModal}
        entry={entry}
        onClose={() => setEditModal(false)}
      />
    </div>
  );
}
