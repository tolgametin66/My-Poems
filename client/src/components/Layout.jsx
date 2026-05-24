import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import EntryModal from './EntryModal';

export default function Layout({ theme, onToggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newEntryModal, setNewEntryModal] = useState(false);

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-950 flex">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onNewEntry={() => setNewEntryModal(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-serif font-semibold text-gray-900 dark:text-gray-100">The Anthology</h1>
        </header>

        <Outlet />
      </div>

      <EntryModal
        open={newEntryModal}
        entry={null}
        onClose={() => setNewEntryModal(false)}
      />
    </div>
  );
}
