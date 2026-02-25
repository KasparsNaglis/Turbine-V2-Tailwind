'use client'

import { useState } from 'react'
import SpreadOptionGrid from '@/components/SpreadOptionGrid'

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { label: string; value: T }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex items-center gap-px rounded-lg bg-white/[0.06] p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            value === opt.value
              ? 'bg-white/[0.10] text-white'
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function Home() {
  const [size, setSize] = useState<'default' | 'compact'>('default')
  const [state, setState] = useState<'ready' | 'loading'>('ready')

  return (
    <main className="min-h-screen bg-zinc-950 p-12 font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center gap-3 mb-6">
        <SegmentedControl
          value={size}
          options={[{ label: 'Default', value: 'default' }, { label: 'Compact', value: 'compact' }]}
          onChange={setSize}
        />
        <SegmentedControl
          value={state}
          options={[{ label: 'Ready', value: 'ready' }, { label: 'Loading', value: 'loading' }]}
          onChange={setState}
        />
      </div>

      <div className={size === 'compact' ? 'w-[344px]' : 'w-full max-w-[440px]'}>
        <SpreadOptionGrid size={size} state={state} />
      </div>
    </main>
  )
}
