import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { api } from '../api';
import { auth, googleProvider } from '../firebase';

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL;

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [poets, setPoets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const isOwner = !!user && (!OWNER_EMAIL || user.email === OWNER_EMAIL);

  const fetchAll = useCallback(async () => {
    try {
      const [e, p] = await Promise.all([api.getEntries(), api.getPoets()]);
      setEntries(e);
      setPoets(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!isOwner) return;
    api.seedIfEmpty().then(seeded => { if (seeded) fetchAll(); }).catch(() => {});
  }, [isOwner, fetchAll]);

  const [authError, setAuthError] = useState(null);
  const signIn = () => signInWithPopup(auth, googleProvider)
    .then(() => setAuthError(null))
    .catch(err => setAuthError(err.code || err.message));
  const signOut = () => fbSignOut(auth);

  // Entries
  const createEntry = async (data) => {
    const entry = await api.createEntry(data);
    setEntries(prev => [entry, ...prev]);
    if (entry.poet_id) {
      setPoets(prev => prev.map(p =>
        p.id === entry.poet_id ? { ...p, entry_count: (p.entry_count || 0) + 1 } : p
      ));
    }
    return entry;
  };

  const updateEntry = async (id, data) => {
    const entry = await api.updateEntry(id, data);
    setEntries(prev => prev.map(e => e.id === id ? entry : e));
    return entry;
  };

  const deleteEntry = async (id) => {
    const entry = entries.find(e => e.id === id);
    await api.deleteEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
    if (entry?.poet_id) {
      setPoets(prev => prev.map(p =>
        p.id === entry.poet_id ? { ...p, entry_count: Math.max(0, (p.entry_count || 1) - 1) } : p
      ));
    }
  };

  // Poets
  const createPoet = async (data) => {
    const poet = await api.createPoet(data);
    setPoets(prev => [...prev, poet].sort((a, b) => a.name.localeCompare(b.name)));
    return poet;
  };

  const updatePoet = async (id, data) => {
    const poet = await api.updatePoet(id, data);
    setPoets(prev => prev.map(p => p.id === id ? poet : p));
    return poet;
  };

  const deletePoet = async (id) => {
    await api.deletePoet(id);
    setPoets(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider value={{
      entries, poets, loading, error,
      user, isOwner, authError, signIn, signOut,
      createEntry, updateEntry, deleteEntry,
      createPoet, updatePoet, deletePoet,
      refetch: fetchAll,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
