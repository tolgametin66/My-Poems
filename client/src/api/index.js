import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, limit, writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { SEED_POETS, SEED_ENTRIES } from './seedData';

const poetsCol = collection(db, 'poets');
const entriesCol = collection(db, 'entries');

const excerpt = (body) => body.slice(0, 120) + (body.length > 120 ? '...' : '');
const withId = (d) => ({ id: d.id, ...d.data() });

const withPoet = (entry, poetsById) => {
  const p = entry.poet_id ? poetsById[entry.poet_id] : null;
  return {
    ...entry,
    poet_name: p?.name ?? null,
    poet_initials: p?.initials ?? null,
    poet_color: p?.color ?? null,
  };
};

async function loadPoetsById() {
  const snap = await getDocs(poetsCol);
  return Object.fromEntries(snap.docs.map(d => [d.id, withId(d)]));
}

export const api = {
  async getEntries() {
    const [snap, poetsById] = await Promise.all([getDocs(entriesCol), loadPoetsById()]);
    return snap.docs
      .map(d => withPoet(withId(d), poetsById))
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  },

  async getEntry(id) {
    const snap = await getDoc(doc(entriesCol, id));
    if (!snap.exists()) throw new Error('Entry not found');
    return withPoet(withId(snap), await loadPoetsById());
  },

  async createEntry(data) {
    const now = new Date().toISOString();
    const entry = {
      type: data.type,
      title: data.title,
      body: data.body,
      excerpt: excerpt(data.body),
      poet_id: data.poet_id || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      is_favorite: !!data.is_favorite,
      source: data.source || null,
      year: data.year || null,
      created_at: now,
      updated_at: now,
    };
    const ref = await addDoc(entriesCol, entry);
    return withPoet({ id: ref.id, ...entry }, await loadPoetsById());
  },

  async updateEntry(id, data) {
    const patch = { ...data, updated_at: new Date().toISOString() };
    delete patch.id;
    ['poet_name', 'poet_initials', 'poet_color'].forEach(k => delete patch[k]);
    if (patch.body !== undefined) patch.excerpt = excerpt(patch.body);
    if ('poet_id' in patch) patch.poet_id = patch.poet_id || null;
    if ('source' in patch) patch.source = patch.source || null;
    if ('year' in patch) patch.year = patch.year || null;
    await updateDoc(doc(entriesCol, id), patch);
    return this.getEntry(id);
  },

  async deleteEntry(id) {
    await deleteDoc(doc(entriesCol, id));
    return { success: true };
  },

  async getPoets() {
    const [poetSnap, entrySnap] = await Promise.all([getDocs(poetsCol), getDocs(entriesCol)]);
    const counts = {};
    entrySnap.docs.forEach(d => {
      const pid = d.data().poet_id;
      if (pid) counts[pid] = (counts[pid] || 0) + 1;
    });
    return poetSnap.docs
      .map(d => ({ ...withId(d), entry_count: counts[d.id] || 0 }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async createPoet(data) {
    const poet = {
      name: data.name,
      initials: data.initials
        || data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      color: data.color || '#7F77DD',
      born: data.born || null,
      died: data.died || null,
      nationality: data.nationality || null,
      bio: data.bio || null,
      created_at: new Date().toISOString(),
    };
    const ref = await addDoc(poetsCol, poet);
    return { id: ref.id, ...poet, entry_count: 0 };
  },

  async updatePoet(id, data) {
    const patch = { ...data };
    delete patch.id;
    delete patch.entry_count;
    ['born', 'died', 'nationality', 'bio'].forEach(k => {
      if (k in patch) patch[k] = patch[k] || null;
    });
    await updateDoc(doc(poetsCol, id), patch);
    const poets = await this.getPoets();
    return poets.find(p => p.id === id);
  },

  async deletePoet(id) {
    const used = await getDocs(query(entriesCol, where('poet_id', '==', id), limit(1)));
    if (!used.empty) {
      throw new Error('Cannot delete a poet who has entries. Remove or reassign their entries first.');
    }
    await deleteDoc(doc(poetsCol, id));
    return { success: true };
  },

  async seedIfEmpty() {
    const existing = await getDocs(query(poetsCol, limit(1)));
    if (!existing.empty) return false;
    const now = new Date().toISOString();
    const batch = writeBatch(db);
    const poetIds = SEED_POETS.map(p => {
      const ref = doc(poetsCol);
      batch.set(ref, { ...p, created_at: now });
      return ref.id;
    });
    SEED_ENTRIES.forEach((e, i) => {
      const { poet, ...rest } = e;
      batch.set(doc(entriesCol), {
        ...rest,
        excerpt: excerpt(e.body),
        poet_id: poetIds[poet],
        created_at: new Date(Date.now() - i * 1000).toISOString(),
        updated_at: now,
      });
    });
    await batch.commit();
    return true;
  },
};
