'use client';

import { useState } from 'react';

const SAMPLE_USERS = ['alice', 'bob', 'carol', 'dave'];

interface Props {
  value: string;
  onChange: (userId: string) => void;
}

export default function UserSelector({ value, onChange }: Props) {
  const [custom, setCustom] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setUseCustom(true);
      onChange('');
    } else {
      setUseCustom(false);
      onChange(val);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = custom.trim();
    if (trimmed) onChange(trimmed);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Browsing as:
      </label>

      {!useCustom ? (
        <select
          value={value || ''}
          onChange={handleSelect}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="" disabled>Select a user…</option>
          {SAMPLE_USERS.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
          <option value="__custom__">+ Custom username</option>
        </select>
      ) : (
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            autoFocus
            type="text"
            placeholder="Enter username…"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!custom.trim()}
            className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Go
          </button>
          <button
            type="button"
            onClick={() => { setUseCustom(false); setCustom(''); }}
            className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </form>
      )}

      {value && !useCustom && (
        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          {value}
        </span>
      )}
    </div>
  );
}
