import { useState } from 'react';
import { Plus, Edit2, BookOpen, Globe, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn, formatYear } from '../lib/utils';
import { useApp } from '../context/AppContext';
import PoetAvatar from '../components/PoetAvatar';
import PoetModal from '../components/PoetModal';
import ConfirmDelete from '../components/ConfirmDelete';

export default function Poets() {
  const { poets, entries, createPoet, updatePoet, deletePoet, loading } = useApp();
  const [modal, setModal] = useState({ open: false, poet: null });
  const [deleteError, setDeleteError] = useState('');
  const navigate = useNavigate();

  const openAdd = () => setModal({ open: true, poet: null });
  const openEdit = (poet) => setModal({ open: true, poet });
  const closeModal = () => setModal({ open: false, poet: null });

  const handleSave = async (data) => {
    if (modal.poet) await updatePoet(modal.poet.id, data);
    else await createPoet(data);
    closeModal();
  };

  const handleDelete = async (poet) => {
    setDeleteError('');
    try { await deletePoet(poet.id); }
    catch (err) { setDeleteError(err.message); }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Poets</h2>
            <p className="text-sm text-gray-400 mt-0.5">{poets.length} {poets.length === 1 ? 'poet' : 'poets'} in your collection</p>
          </div>
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} /> Add Poet
          </button>
        </div>

        {deleteError && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
            {deleteError}
          </div>
        )}

        {poets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No poets yet. Add your first poet to get started.</p>
            <button onClick={openAdd} className="btn-primary">
              <Plus size={16} /> Add Poet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {poets.map(poet => {
              const poetEntries = entries.filter(e => e.poet_id === poet.id);
              const poems = poetEntries.filter(e => e.type === 'poem').length;
              const quotes = poetEntries.filter(e => e.type === 'quote').length;
              const years = formatYear(poet.born, poet.died);

              return (
                <div key={poet.id} className="card p-5 group">
                  <div className="flex items-start gap-4">
                    <PoetAvatar poet={poet} size="lg" />
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => navigate(`/?poet=${poet.id}`)}
                        className="font-serif font-semibold text-gray-900 dark:text-gray-100 hover:text-accent transition-colors text-left line-clamp-1"
                      >
                        {poet.name}
                      </button>
                      {years && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar size={10} /> {years}
                        </p>
                      )}
                      {poet.nationality && (
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Globe size={10} /> {poet.nationality}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(poet)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <ConfirmDelete
                        onConfirm={() => handleDelete(poet)}
                        label="Delete poet"
                      />
                    </div>
                  </div>

                  {poet.bio && (
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {poet.bio}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800 flex items-center gap-4">
                    <button
                      onClick={() => navigate(`/?poet=${poet.id}`)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent transition-colors"
                    >
                      <BookOpen size={12} />
                      <span>{poet.entry_count || 0} {poet.entry_count === 1 ? 'entry' : 'entries'}</span>
                    </button>
                    {poems > 0 && (
                      <span className="text-xs text-gray-400">{poems} {poems === 1 ? 'poem' : 'poems'}</span>
                    )}
                    {quotes > 0 && (
                      <span className="text-xs text-gray-400">{quotes} {quotes === 1 ? 'quote' : 'quotes'}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PoetModal
        open={modal.open}
        poet={modal.poet}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
}
