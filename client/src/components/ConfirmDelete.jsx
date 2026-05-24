import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ConfirmDelete({ onConfirm, label = 'Delete', className }) {
  const [step, setStep] = useState('idle'); // idle | confirm | loading

  const handleClick = async () => {
    if (step === 'idle') { setStep('confirm'); return; }
    if (step === 'confirm') {
      setStep('loading');
      try { await onConfirm(); }
      catch { setStep('confirm'); }
    }
  };

  if (step === 'confirm') {
    return (
      <span className="inline-flex items-center gap-1">
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          <Trash2 size={12} /> Confirm
        </button>
        <button
          onClick={() => setStep('idle')}
          className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X size={12} />
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={step === 'loading'}
      className={cn(
        'p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors',
        className
      )}
      title={label}
    >
      <Trash2 size={15} />
    </button>
  );
}
