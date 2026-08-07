import React from 'react';

/** Shared published-like chrome for visual MDX blocks. */
export function PublishedEditSurface({
  children,
  active = false,
  hasError = false,
  label,
  onActivate,
}: {
  children: React.ReactNode;
  active?: boolean;
  hasError?: boolean;
  label?: string;
  onActivate?: () => void;
}) {
  return (
    <div
      role={onActivate ? 'button' : undefined}
      tabIndex={onActivate ? 0 : undefined}
      onClick={onActivate}
      onKeyDown={onActivate ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      } : undefined}
      className={`rounded-sm transition-colors ${
        hasError ? 'bg-granada/[0.04] ring-1 ring-granada/25' : ''
      } ${active ? 'ring-1 ring-terracota/30' : 'hover:bg-carbon/[0.02]'}`}
    >
      {label && (
        <div className="mb-1 select-none opacity-0 transition-opacity group-hover/block:opacity-100">
          <span className="ac-label ac-label--2xs ac-label--faint font-sans">{label}</span>
        </div>
      )}
      {children}
    </div>
  );
}
