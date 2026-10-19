import React, { useRef } from 'react';
import { cx } from './classNames';
import { rovingTargetIndex } from './rovingFocus';

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  'aria-label': string;
  className?: string;
}

/**
 * Printed index (`☞ Visual · Código · Previa`): a radio group whose checked
 * option carries the manicule. Arrow keys move and select, as in a radio group.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const enabled = options.filter(option => !option.disabled);
  const checkedIndex = Math.max(0, enabled.findIndex(option => option.value === value));

  const onKeyDown = (event: React.KeyboardEvent) => {
    const next = rovingTargetIndex(event, checkedIndex, enabled.length);
    if (next === null) return;
    event.preventDefault();
    const target = enabled[next];
    onChange(target.value);
    refs.current[options.indexOf(target)]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx('ed-segmented', className)} onKeyDown={onKeyDown}>
      {options.map((option, index) => {
        const checked = option.value === value;
        return (
          <React.Fragment key={option.value}>
            {index > 0 && <span className="ed-segmented__sep" aria-hidden="true">·</span>}
            <button
              ref={element => { refs.current[index] = element; }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={option === enabled[checkedIndex] ? 0 : -1}
              disabled={option.disabled}
              className="ed-segmented__option"
              onClick={() => { if (!checked) onChange(option.value); }}
            >
              <span className="ed-segmented__label">{option.label}</span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
