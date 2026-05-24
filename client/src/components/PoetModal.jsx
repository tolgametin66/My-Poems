import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { POET_COLORS } from '../lib/utils';

const EMPTY = { name: '', born: '', died: '', nationality: '', bio: '', color: POET_COLORS[0] };

export default function PoetModal({ open, poet, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(poet
        ? { name: poet.name, born: poet.born || '', died: poet.died || '', nationality: poet.nationality || '', bio: poet.bio || '', color: poet.color }
        : EMPTY
      );
      setError('');
    }
  }, [open, poet]);

  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave({
        name: form.name.trim(),
        color: form.color,
        born: form.born ? Number(form.born) : null,
        died: form.died ? Number(form.died) : null,
        nationality: form.nationality.trim() || null,
        bio: form.bio.trim() || null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-modal p-6">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {poet ? 'Edit Poet' : 'Add Poet'}
            </Dialog.Title>
            <Dialog.Close className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X size={18} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Name *</label>
              <input className="input" placeholder="Full name" value={form.name} onChange={e => set('name', e.target.value)} required autoFocus />
            </div>

            <div>
              <label className="label">Avatar Color</label>
              <div className="flex gap-2 flex-wrap">
                {POET_COLORS.map(c => (
                  <button
                    key={c} type="button"
                    onClick={() => set('color', c)}
                    className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                    style={{ backgroundColor: c, borderColor: form.color === c ? '#1a1a2e' : 'transparent' }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Born</label>
                <input className="input" type="number" placeholder="1830" value={form.born} onChange={e => set('born', e.target.value)} />
              </div>
              <div>
                <label className="label">Died</label>
                <input className="input" type="number" placeholder="1886" value={form.died} onChange={e => set('died', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label">Nationality</label>
              <input className="input" placeholder="e.g. American, Chilean…" value={form.nationality} onChange={e => set('nationality', e.target.value)} />
            </div>

            <div>
              <label className="label">Bio</label>
              <textarea className="input resize-none h-24" placeholder="Short biography…" value={form.bio} onChange={e => set('bio', e.target.value)} />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-3 py-2 rounded-lg">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving…' : poet ? 'Save Changes' : 'Add Poet'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
