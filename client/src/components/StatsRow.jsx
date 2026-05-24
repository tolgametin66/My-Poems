import { BookMarked, BookOpen, Quote, Users } from 'lucide-react';

export default function StatsRow({ entries, poets }) {
  const poems = entries.filter(e => e.type === 'poem').length;
  const quotes = entries.filter(e => e.type === 'quote').length;

  const stats = [
    { label: 'Total', value: entries.length, icon: BookMarked, color: 'text-accent' },
    { label: 'Poems', value: poems, icon: BookOpen, color: 'text-indigo-400' },
    { label: 'Quotes', value: quotes, icon: Quote, color: 'text-amber-500' },
    { label: 'Poets', value: poets.length, icon: Users, color: 'text-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="card px-4 py-3 flex items-center gap-3">
          <Icon size={18} className={color} />
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-none">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
