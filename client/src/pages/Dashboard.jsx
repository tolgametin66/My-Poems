import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, LayoutGrid, List, Plus, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';
import EntryCard from '../components/EntryCard';
import EntryModal from '../components/EntryModal';
import StatsRow from '../components/StatsRow';
import TagFilter from '../components/TagFilter';
import PoetAvatar from '../components/PoetAvatar';

export default function Dashboard() {
  const { entries, poets, loading, updateEntry, deleteEntry } = useApp();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const [view, setView] = useState('grid');
  const [modal, setModal] = useState({ open: false, entry: null });

  const typeFilter = searchParams.get('type');
  const poetFilter = searchParams.get('poet');
  const favFilter   = searchParams.get('favorites');

  const allTags = useMemo(() => {
    const set = new Set();
    entries.forEach(e => (e.tags || []).forEach(t => set.add(t)));
    return [...set].sort();
  }, [entries]);

  const filtered = useMemo(() => {
    let list = entries;
    if (typeFilter) list = list.filter(e => e.type === typeFilter);
    if (poetFilter) list = list.filter(e => String(e.poet_id) === poetFilter);
    if (favFilter)  list = list.filter(e => e.is_favorite);
    if (activeTag)  list = list.filter(e => (e.tags || []).includes(activeTag));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q) ||
        (e.poet_name || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [entries, typeFilter, poetFilter, favFilter, activeTag, search]);

  // Group by poet
  const groups = useMemo(() => {
    const map = new Map();
    filtered.forEach(e => {
      const key = e.poet_id || 0;
      if (!map.has(key)) {
        map.set(key, {
          poet: e.poet_id ? { id: e.poet_id, name: e.poet_name, initials: e.poet_initials, color: e.poet_color } : null,
          entries: [],
        });
      }
      map.get(key).entries.push(e);
    });
    return [...map.values()].sort((a, b) => {
      if (!a.poet) return 1;
      if (!b.poet) return -1;
      return (a.poet.name || '').localeCompare(b.poet.name || '');
    });
  }, [filtered]);

  const handleToggleFavorite = (entry) => {
    updateEntry(entry.id, { is_favorite: !entry.is_favorite });
  };

  const openEdit = (entry) => setModal({ open: true, entry });
  const closeModal = () => setModal({ open: false, entry: null });

  const pageTitle = useMemo(() => {
    if (favFilter) return 'Favorites';
    if (typeFilter === 'poem') return 'Poems';
    if (typeFilter === 'quote') return 'Quotes';
    if (poetFilter) {
      const poet = poets.find(p => String(p.id) === poetFilter);
      return poet ? poet.name : 'Entries';
    }
    return 'All Entries';
  }, [typeFilter, poetFilter, favFilter, poets]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading your collection…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <StatsRow entries={entries} poets={poets} />

        {/* Search + controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              className="input pl-9"
              placeholder="Search titles, text, or poets…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}
              className="btn-ghost"
              title={view === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            >
              {view === 'grid' ? <List size={16} /> : <LayoutGrid size={16} />}
            </button>
            <button
              onClick={() => setModal({ open: true, entry: null })}
              className="btn-primary"
            >
              <Plus size={16} /> Add Entry
            </button>
          </div>
        </div>

        {/* Tag filter */}
        <TagFilter tags={allTags} activeTag={activeTag} onChange={setActiveTag} />

        {/* Heading */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{pageTitle}</h2>
          {filtered.length > 0 && (
            <span className="text-sm text-gray-400">{filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}</span>
          )}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {search || activeTag ? 'No entries match your search.' : 'No entries yet — add your first poem.'}
            </p>
            {!search && !activeTag && (
              <button onClick={() => setModal({ open: true, entry: null })} className="btn-primary mt-4">
                <Plus size={16} /> Add your first entry
              </button>
            )}
          </div>
        )}

        {/* Grouped entries */}
        <div className="space-y-8">
          {groups.map(({ poet, entries: groupEntries }) => (
            <section key={poet?.id || 'anon'}>
              {/* Poet heading */}
              <div className="flex items-center gap-3 mb-4">
                <PoetAvatar poet={poet || { initials: '?', color: '#9ca3af' }} size="sm" />
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                  {poet?.name || 'Anonymous'}
                </h3>
                <span className="text-xs text-gray-400">{groupEntries.length}</span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
              </div>

              {/* Cards */}
              <div className={cn(
                view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-2'
              )}>
                {groupEntries.map(entry => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    view={view}
                    onEdit={openEdit}
                    onDelete={deleteEntry}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <EntryModal
        open={modal.open}
        entry={modal.entry}
        onClose={closeModal}
      />
    </div>
  );
}
