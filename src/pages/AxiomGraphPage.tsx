import React from 'react';
import { AxiomaticTree } from '../components/graph/AxiomaticTree';

export const AxiomGraphPage: React.FC = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <AxiomaticTree />
    </div>
  );
};
