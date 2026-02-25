'use client'

import { useState } from 'react'
import { InformationCircleIcon } from '@heroicons/react/20/solid'

type FillPriority = 'Fast' | 'Cheap' | 'Earn' | 'P2P'

interface SpreadOption {
  id: string
  spread?: string
  cost?: string
  fillPriority: FillPriority
  savings?: string
  unavailable?: boolean
}

interface SpreadSelectorProps {
  state?: 'default' | 'disabled' | 'loading' | 'compact'
  options?: SpreadOption[]
  defaultSelected?: string
  estimatedBuy?: string
  midPrice?: string
  marketSpread?: string
  platformFee?: string
  onSelect?: (id: string) => void
  onSave?: () => void
}

const defaultOptions: SpreadOption[] = [
  { id: '1', spread: '0.5%', cost: '$30.00', fillPriority: 'Fast' },
  { id: '2', spread: '0.1%', cost: '$6.00', fillPriority: 'Cheap', savings: '$24.00' },
  { id: '3', spread: '-0.005%', cost: '$130.00 gain', fillPriority: 'Earn', savings: '$60.00' },
]

const disabledOptions: SpreadOption[] = [
  { id: '1', spread: '0.5%', cost: '$30.00', fillPriority: 'Fast' },
  { id: '2', spread: '0.1%', cost: '$6.00', fillPriority: 'Cheap', savings: '$24.00' },
  { id: '3', fillPriority: 'Earn', unavailable: true },
]

const compactOptions: SpreadOption[] = [
  { id: '1', spread: '0.5%', cost: '$30.00', fillPriority: 'Fast' },
  { id: '2', spread: '0.1%', cost: '$6.00', fillPriority: 'P2P', savings: '$24.00' },
  { id: '3', spread: '-0.005%', cost: '$30.00 gain', fillPriority: 'Earn', savings: '$60.00' },
]

function InfoIcon() {
  return <InformationCircleIcon className="inline-block w-4 h-4 shrink-0 text-zinc-600 align-middle" />
}

function UsdcIcon() {
  return (
    <svg className="inline-block w-4 h-4 shrink-0 align-middle" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="10" fill="#2775CA" />
      <text x="10" y="14.5" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold" fontFamily="sans-serif">$</text>
    </svg>
  )
}

function Skeleton({ className }: { className?: string }) {
  return <span className={`inline-block rounded bg-zinc-700/60 animate-pulse ${className}`} />
}

export default function SpreadSelector({
  state = 'default',
  options,
  defaultSelected = '2',
  estimatedBuy = '5,994.00 USDC ($5,994.00)',
  midPrice = '1 ETH = 2877.41 USDC ($2,877.12)',
  marketSpread = '0.09% ($5.34)',
  platformFee = '0.01% ($0.66)',
  onSelect,
  onSave,
}: SpreadSelectorProps) {
  const [selected, setSelected] = useState(defaultSelected)

  const rows =
    options ??
    (state === 'disabled'
      ? disabledOptions
      : state === 'compact'
      ? compactOptions
      : defaultOptions)

  const isLoading = state === 'loading'
  const isCompact = state === 'compact'
  const isDisabled = state === 'disabled'

  return (
    <div
      className="w-[440px] rounded-xl overflow-hidden text-sm"
      style={{ background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <th className="text-left px-4 py-2.5 text-xs text-zinc-500 font-medium">
              Max spread <InfoIcon />
            </th>
            <th className="text-center px-4 py-2.5 text-xs text-zinc-500 font-medium">
              Fill priority
            </th>
            <th className="text-right px-4 py-2.5 text-xs text-zinc-500 font-medium w-14">
              <button onClick={onSave} className="hover:text-zinc-300 transition-colors">
                Save
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? (['Fast', 'Cheap', 'Earn'] as FillPriority[]).map((fp) => (
                <tr key={fp} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-9 h-2.5" />
                      <Skeleton className="w-14 h-2.5" />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center text-xs text-white">
                    {fp} <InfoIcon />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Skeleton className="w-11 h-2.5 ml-auto" />
                  </td>
                </tr>
              ))
            : rows.map((row) => {
                const isSelected = row.id === selected && !row.unavailable
                return (
                  <tr
                    key={row.id}
                    onClick={() => {
                      if (!row.unavailable && !isDisabled) {
                        setSelected(row.id)
                        onSelect?.(row.id)
                      }
                    }}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      borderLeft: isSelected ? '2px solid #22d3ee' : '2px solid transparent',
                      background: isSelected ? 'rgba(255,255,255,0.04)' : 'transparent',
                      cursor: row.unavailable ? 'default' : 'pointer',
                    }}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3.5">
                      {row.unavailable ? (
                        <span className="text-zinc-500 text-xs">Temporarily unavailable</span>
                      ) : (
                        <>
                          <span className="text-white font-medium">{row.spread} </span>
                          <span className="text-zinc-400 text-xs">({row.cost})</span>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center text-xs text-zinc-300">
                      {row.fillPriority} <InfoIcon />
                    </td>
                    <td className="px-4 py-3.5 text-right text-cyan-400 font-medium">
                      {row.savings ?? ''}
                    </td>
                  </tr>
                )
              })}
        </tbody>
      </table>

      {/* Footer */}
      <div className="px-4 pt-3 pb-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {isCompact && (
          <div className="mb-3 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-zinc-500">Mid-price</span>
              <span className="text-xs text-zinc-300">{midPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-zinc-500">Spread</span>
              <span className="text-xs text-zinc-300">{marketSpread}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-zinc-500">Platform fee</span>
              <span className="text-xs text-zinc-300">{platformFee}</span>
            </div>
          </div>
        )}

        {isCompact ? (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs text-zinc-400 font-medium">Est. buy</span>
              <span className="text-yellow-400 text-xs">◆</span>
            </div>
            <button className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white transition-colors">
              <UsdcIcon />
              {estimatedBuy}
              <span className="text-zinc-500">▲</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-medium">
              Est. buy
              {!isDisabled && <span className="text-yellow-400">◆</span>}
              {!isDisabled && <InfoIcon />}
            </span>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-2.5" />
                <Skeleton className="w-20 h-2.5" />
                <Skeleton className="w-4 h-2.5" />
              </div>
            ) : isDisabled ? (
              <button className="flex items-center gap-1 text-xs text-zinc-500">
                Temporarily unavailable <span className="text-zinc-600">▾</span>
              </button>
            ) : (
              <button className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white transition-colors">
                <UsdcIcon />
                {estimatedBuy}
                <span className="text-zinc-500">▾</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
