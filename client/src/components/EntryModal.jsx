import { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Plus, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';
import PoetModal from './PoetModal';

const EMPTY = {
  type: 'poem',
  title: '',
  body: '',
  poet_id: '',
  tags: [],
  tagInput: '',
  is_favorite: false,
  source: '',
  year: '',
};

export default function EntryModal({ open, entry, onClose }) {
  const { poets, createEntry, updateEntry, createPoet } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPoetModal, setShowPoetModal] = useState(false);
  const titleRef = useRef(null);

  const isEdit = Boolean(entry);

  useEffect(() => {
    if (open) {
      if (entry) {
        setForm({
          type: entry.type,
          title: entry.title,
          body: entry.body,
          poet_id: entry.poet_id || '',
          tags: entry.tags || [],
          tagInput: '',
          is_favorite: entry.is_favorite,
          source: entry.source || '',
          year: entry.year || '',
        });
      } else {
        setForm(EMPTY);
      }
      setError('');
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open, entry]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const addTag = () => {
    const tags = form.tagInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    if (tags.length) {
      set('tags', [...new Set([...form.tags, ...tags])]);
      set('tagInput', '');
    }
  };

  const removeTag = (tag) => set('tags', form.tags.filter(t => t !== tag));

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and body are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        type: form.type,
        title: form.title.trim(),
        body: form.body.trim(),
        poet_id: form.poet_id ? Number(form.poet_id) : null,
        tags: form.tags,
        is_favorite: form.is_favorite,
        source: form.source.trim() || null,
        year: form.year ? Number(form.year) : null,
      };
      if (isEdit) await updateEntry(entry.id, payload);
      else await createEntry(payload);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNewPoet = async (data) => {
    const poet = await createPoet(data);
    set('poet_id', poet.id);
    setShowPoetModal(false);
  };

  const excerpt = form.body.slice(0, 120) + (form.body.length > 120 ? '...' : '');

  return (
    <>
      <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-modal p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {isEdit ? 'Edit Entry' : 'New Entry'}
              </Dialog.Title>
              <Dialog.Close className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X size={18} />
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type */}
              <div>
                <label className="label">Type</label>
                <div className="flex gap-2">
                  {['poem', 'quote'].map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => set('type', t)}
                      className={cn(
                        'flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors capitalize',
                        form.type === t
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="label">Title *</label>
                <input
                  ref={titleRef}
                  className="input font-serif"
                  placeholder={form.type === 'poem' ? 'Poem title…' : 'Quote title or subject…'}
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  required
                />
              </div>

              {/* Body */}
              <div>
                <label className="label">Text *</label>
                <textarea
                  className="input font-serif resize-y min-h-[180px] leading-relaxed"
                  placeholder={form.type === 'poem' ? 'Paste or type the full poem…' : 'The quote text…'}
                  value={form.body}
                  onChange={e => set('body', e.target.value)}
                  required
                />
                {form.body && (
                  <p className="mt-1.5 text-xs text-gray-400 italic line-clamp-1">
                    Preview: {excerpt}
                  </p>
                )}
              </div>

              {/* Poet */}
              <div>
                <label className="label">Poet / Author</label>
                <div className="flex gap-2">
                  <select
                    className="input flex-1"
                    value={form.poet_id}
                    onChange={e => set('poet_id', e.target.value)}
                  >
                    <option value="">— Anonymous —</option>
                    {poets.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowPoetModal(true)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 hover:border-accent hover:text-accent transition-colors"
                  >
                    <Plus size={14} /> New
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="label">Tags</label>
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="love, nature, death — comma-separated"
                    value={form.tagInput}
                    onChange={e => set('tagInput', e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={addTag}
                  />
                  <button type="button" onClick={addTag} className="btn-ghost flex-shrink-0">Add</button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-accent/10 text-accent">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Source & Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Source / Collection</label>
                  <input className="input" placeholder="e.g. Leaves of Grass" value={form.source} onChange={e => set('source', e.target.value)} />
                </div>
                <div>
                  <label className="label">Year</label>
                  <input className="input" type="number" placeholder="e.g. 1855" value={form.year} onChange={e => set('year', e.target.value)} min="0" max="2100" />
                </div>
              </div>

              {/* Favorite */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => set('is_favorite', !form.is_favorite)}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    form.is_favorite ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'
                  )}
                >
                  <Star size={18} fill={form.is_favorite ? 'currentColor' : 'none'} />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">Mark as favorite</span>
              </label>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-3 py-2 rounded-lg">{error}</p>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Entry'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <PoetModal
        open={showPoetModal}
        onClose={() => setShowPoetModal(false)}
        onSave={handleNewPoet}
      />
    </>
  );
}
