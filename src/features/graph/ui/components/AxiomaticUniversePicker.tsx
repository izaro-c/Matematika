import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import type { ModelInfo, SystemInfo } from '@/entities/graph/graphTypes';

interface AxiomaticUniversePickerProps {
  systems: SystemInfo[];
  inactiveSystems: string[];
  onToggleSystem: (id: string) => void;
  models: ModelInfo[];
  inactiveModels: string[];
  onToggleModel: (id: string) => void;
}

interface FrameworkMenuProps<T extends ModelInfo | SystemInfo> {
  label: string;
  placeholder: string;
  options: T[];
  activeId?: string;
  color: string;
  onSelect: (id: string) => void;
}

function FrameworkMenu<T extends ModelInfo | SystemInfo>({
  label,
  placeholder,
  options,
  activeId,
  color,
  onSelect,
}: FrameworkMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const activeOption = options.find(option => option.id === activeId);
  const menuStyle = { '--framework-color': color } as CSSProperties;

  const focusOption = (index: number) => {
    const optionButtons = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]');
    if (!optionButtons || optionButtons.length === 0) return;
    const wrappedIndex = (index + optionButtons.length) % optionButtons.length;
    optionButtons[wrappedIndex].focus();
  };

  const openAndFocus = () => {
    setIsOpen(true);
    requestAnimationFrame(() => {
      const selectedIndex = Math.max(0, options.findIndex(option => option.id === activeId));
      focusOption(selectedIndex);
    });
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openAndFocus();
    }
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption(index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption(index - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      className="relative"
      style={menuStyle}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOpen(false);
      }}
    >
      <span className="mb-1.5 block font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-carbon/55">
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-controls={menuId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
        onKeyDown={handleTriggerKeyDown}
        className={`flex min-h-12 w-full items-center gap-3 border border-carbon/15 border-l-2 border-l-[var(--framework-color)] bg-lienzo px-3 text-left transition-colors hover:border-carbon/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota ${
          isOpen ? 'border-carbon/30 bg-carbon/[0.025]' : ''
        }`}
      >
        <span
          aria-hidden="true"
          className={`flex size-4 shrink-0 items-center justify-center rounded-full border border-[var(--framework-color)] ${activeOption ? 'bg-[var(--framework-color)]' : ''}`}
        >
          {activeOption && <span className="size-1.5 rounded-full bg-lienzo" />}
        </span>
        <span className={`min-w-0 flex-1 truncate font-serif text-xs ${activeOption ? 'font-semibold text-carbon' : 'italic text-carbon/55'}`}>
          {activeOption?.title ?? placeholder}
        </span>
        {activeOption && (
          <span className="shrink-0 font-sans text-[8px] tabular-nums text-carbon/40">
            {activeOption.axioms.length} ax.
          </span>
        )}
        <span aria-hidden="true" className={`shrink-0 text-xs text-carbon/45 transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="listbox"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-30 max-h-64 overflow-y-auto border border-carbon/20 bg-lienzo p-1 shadow-[var(--theme-shadow-classic)]"
        >
          {options.map((option, index) => {
            const isSelected = option.id === activeId;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelect(option.id);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                onKeyDown={event => handleOptionKeyDown(event, index)}
                className={`flex min-h-10 w-full items-center gap-2.5 border-l-2 px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-terracota ${
                  isSelected
                    ? 'border-l-[var(--framework-color)] bg-[color-mix(in_srgb,var(--framework-color)_8%,transparent)] text-carbon'
                    : 'border-l-transparent text-carbon/65 hover:bg-carbon/[0.035] hover:text-carbon'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`size-2.5 shrink-0 rounded-full border border-[var(--framework-color)] ${isSelected ? 'bg-[var(--framework-color)]' : ''}`}
                />
                <span className="min-w-0 flex-1 font-serif text-[11px] leading-tight">{option.title}</span>
                <span className="shrink-0 font-sans text-[8px] tabular-nums text-carbon/40">{option.axioms.length}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AxiomaticUniversePicker({
  systems,
  inactiveSystems,
  onToggleSystem,
  models,
  inactiveModels,
  onToggleModel,
}: AxiomaticUniversePickerProps) {
  const activeSystem = systems.find(system => !inactiveSystems.includes(system.id));
  const activeModel = models.find(model => !inactiveModels.includes(model.id));

  return (
    <section aria-labelledby="framework-picker-title">
      <div className="mb-3">
        <h2 id="framework-picker-title" className="font-serif text-base font-semibold text-carbon">
          Partir de un marco
        </h2>
        <p className="mt-1 font-sans text-[10px] leading-relaxed text-carbon/60">
          Elegir una opción reemplaza la selección axiomática actual.
        </p>
      </div>

      <div className="space-y-3">
        <FrameworkMenu
          label="Sistema axiomático"
          placeholder="Elegir un sistema…"
          options={systems}
          activeId={activeSystem?.id}
          color="var(--theme-terracota)"
          onSelect={onToggleSystem}
        />
        <FrameworkMenu
          label="Modelo concreto"
          placeholder="Elegir un modelo…"
          options={models}
          activeId={activeModel?.id}
          color="var(--theme-pavo)"
          onSelect={onToggleModel}
        />
      </div>
    </section>
  );
}
