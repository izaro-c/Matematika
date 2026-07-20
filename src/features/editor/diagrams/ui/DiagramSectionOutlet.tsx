import React from 'react';

interface DiagramSectionOutletProps {
  active: boolean;
  children: React.ReactNode;
}

export const DiagramSectionOutlet: React.FC<DiagramSectionOutletProps> = ({ active, children }) => (
  active ? children : null
);
