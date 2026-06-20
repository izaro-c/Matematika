import React from 'react';

export const SubtleSeparator: React.FC<{ ornament?: string }> = ({ ornament = '✦' }) => (
  <div className="subtle-separator" aria-hidden>
    <span className="subtle-separator-ornament">{ornament}</span>
  </div>
);
