import { NavLink } from 'react-router-dom';
import { BookOpen, Star, Quote, BookMarked, Users, X, Sun, Moon, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';
import PoetAvatar from './PoetAvatar';

const NAV = [
  { to: '/', label: 'All Entries', icon: BookMarked, end: true },
  { to: '/?type=poem', label: 'Poems', icon: BookOpen },
  { to: '/?type=quote', label: 'Quotes', icon: Quote },
  { to: '/?favorites=1', label: 'Favorites', icon: Star },
  { to: '/poets', label: 'Poets', icon: Users },
];

export default function Sidebar({ open, onClose, theme, onToggleTheme, onNewEntry }) {
  const { poets, entries } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800',
        'flex flex-col z-30 transition-transform duration-300 ease-in-out',
        'lg:translate-x-0 lg:static lg:h-auto lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100 leading-none">
              The Anthology
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Your personal collection</p>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* New Entry button */}
        <div className="px-4 pt-4">
          <button onClick={() => { onNewEntry(); onClose(); }} className="btn-primary w-full justify-center">
            <Plus size={16} /> New Entry
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="px-3 mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Browse</p>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn('sidebar-link', isActive && to === '/' && 'active')}
              onClick={onClose}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
            </NavLink>
          ))}

          {/* Poets */}
          {poets.length > 0 && (
            <>
              <p className="px-3 pt-4 mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Poets</p>
              {poets.map(poet => (
                <NavLink
                  key={poet.id}
                  to={`/?poet=${poet.id}`}
                  className={({ isActive }) => cn('sidebar-link', isActive && 'active')}
                  onClick={onClose}
                >
                  <PoetAvatar poet={poet} size="xs" />
                  <span className="flex-1 truncate text-sm">{poet.name}</span>
                  <span className="flex-shrink-0 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {poet.entry_count || 0}
                  </span>
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </aside>
    </>
  );
}
