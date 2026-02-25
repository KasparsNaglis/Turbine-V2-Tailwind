'use client'

import { useState } from 'react'
import HelpBtn from '@/components/HelpBtn'

type FillPriority = 'Fast' | 'Cheap' | 'Earn' | 'P2P'

interface SpreadOption {
  id: string
  spread: string
  cost: string
  fillPriority: FillPriority
  savings?: string
}

interface SpreadOptionGridProps {
  size?: 'default' | 'compact'
  state?: 'ready' | 'loading'
  options?: SpreadOption[]
  defaultSelected?: string
  onSelect?: (id: string) => void
  onSave?: () => void
}

const defaultOptions: SpreadOption[] = [
  { id: '1', spread: '0.5%',    cost: '$30.00',       fillPriority: 'Fast' },
  { id: '2', spread: '0.1%',    cost: '$6.00',        fillPriority: 'P2P',  savings: '$24.00' },
  { id: '3', spread: '-0.005%', cost: '$130.00 gain', fillPriority: 'Earn', savings: '$60.00' },
]

const LOADING_ROWS: FillPriority[] = ['Fast', 'P2P', 'Earn']

// Pill geometry (matches Figma: header 44px, rows 56px, 1px gaps, pill 50px)
const HEADER_H = 44
const ROW_H = 56
const GAP = 1
const PILL_H = 50

const PILL_GRADIENT = 'linear-gradient(-88.5deg, rgb(246,209,221) 18.27%, rgb(174,194,209) 49.04%, rgb(246,209,221) 82.69%)'
const PILL_SHADOW = 'inset 0px -4px 2px 0px rgba(0,62,44,0.2), inset 0px 4px 2px 0px rgba(178,255,240,0.7)'

function Skeleton({ className }: { className?: string }) {
  return <span className={`inline-block rounded-lg bg-white/[0.06] animate-pulse ${className}`} />
}

export default function SpreadOptionGrid({
  size = 'default',
  state = 'ready',
  options = defaultOptions,
  defaultSelected = '2',
  onSelect,
  onSave,
}: SpreadOptionGridProps) {
  const [selected, setSelected] = useState(defaultSelected)
  const isLoading = state === 'loading'
  const isCompact = size === 'compact'

  // Default ready:   spread=hug (w-px),  fill-priority=fill (auto), savings=hug (w-px)
  // Default loading: spread=auto,         fill-priority=auto,        savings=hug (w-px)
  // Compact ready:   spread=fill (auto),  fill-priority=hug (w-px),  savings=hug (w-px)
  // Compact loading: spread=auto,         fill-priority=auto,        savings=hug (w-px)
  const spreadCls   = (!isLoading && !isCompact) ? 'w-px whitespace-nowrap' : ''
  const priorityCls = (!isLoading && isCompact)  ? 'w-px whitespace-nowrap' : ''

  const selectedIndex = options.findIndex(o => o.id === selected)
  const pillY = HEADER_H + GAP + selectedIndex * (ROW_H + GAP) + (ROW_H - PILL_H) / 2

  return (
    <div className="relative w-full rounded-t-xl overflow-hidden bg-[#0d0d10] font-[family-name:var(--font-geist-sans)]">

      {/* Selection pill — compact: solid mint, default: pink/lavender gradient with glow */}
      {!isLoading && (
        <div
          className="absolute left-[3px] w-1 h-[50px] rounded-full pointer-events-none z-10 transition-[top] duration-200 ease-in-out"
          style={{
            top: pillY,
            background: isCompact ? '#22e8e9' : PILL_GRADIENT,
            boxShadow: isCompact ? undefined : PILL_SHADOW,
          }}
        />
      )}

      <table className="w-full border-separate border-spacing-y-px">
        <thead>
          <tr>
            <th className={`text-left pl-4 pr-2 py-3 text-sm font-medium leading-5 text-white/60 bg-white/[0.06] ${spreadCls}`}>
              <span className="inline-flex items-center gap-0.5">
                Max spread <HelpBtn />
              </span>
            </th>
            <th className={`text-left px-2 py-3 text-sm font-medium leading-5 text-white/60 bg-white/[0.06] ${priorityCls}`}>
              Fill priority
            </th>
            <th className="text-right pr-4 pl-2 py-3 text-sm font-medium leading-5 text-white/60 bg-white/[0.06] w-px whitespace-nowrap">
              <button onClick={onSave} className="hover:text-white/80 transition-colors">
                Save
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading
            ? LOADING_ROWS.map((fp) => (
                <tr key={fp} className="h-14 bg-white/[0.06]">
                  <td className={`pl-4 pr-2 align-middle ${spreadCls}`}>
                    <span className="inline-flex items-center gap-1">
                      <Skeleton className="w-10 h-5" />
                      <Skeleton className="w-14 h-5" />
                    </span>
                  </td>
                  <td className={`px-2 align-middle ${priorityCls}`}>
                    <span className="inline-flex items-center gap-0.5 text-sm font-medium text-white">
                      {fp} <HelpBtn />
                    </span>
                  </td>
                  <td className="pl-2 pr-4 text-right align-middle w-px whitespace-nowrap">
                    <Skeleton className="w-12 h-5 ml-auto" />
                  </td>
                </tr>
              ))
            : options.map((row) => {
                const isSelected = row.id === selected
                return (
                  <tr
                    key={row.id}
                    onClick={() => { setSelected(row.id); onSelect?.(row.id) }}
                    className={`cursor-pointer h-14 transition-colors ${
                      isSelected ? 'bg-white/[0.10]' : 'bg-white/[0.06] hover:bg-white/[0.08]'
                    }`}
                  >
                    <td className={`pl-4 pr-2 align-middle ${spreadCls}`}>
                      <span className="text-base font-medium text-white">{row.spread}</span>
                      {' '}
                      <span className="text-sm text-white/60">({row.cost})</span>
                    </td>

                    <td className={`px-2 align-middle ${priorityCls}`}>
                      <span className="inline-flex items-center gap-0.5 text-sm font-medium text-white">
                        {row.fillPriority} <HelpBtn />
                      </span>
                    </td>

                    <td className="pl-2 pr-4 text-right text-sm font-medium text-[#22e8e9] align-middle w-px whitespace-nowrap">
                      {row.savings ?? ''}
                    </td>
                  </tr>
                )
              })}
        </tbody>
      </table>
    </div>
  )
}
