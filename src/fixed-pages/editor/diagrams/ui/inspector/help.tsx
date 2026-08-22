import React from 'react';

export const PointLabelHelp: React.FC = () => (
  <div className="mt-2 p-2.5 bg-canela/5 rounded-xl border border-canela/20 text-[10px] text-carbon/80 space-y-1 font-serif">
    <div className="flex items-center space-x-1">
      <span className="font-bold text-canela text-[11px]">Formato de Etiqueta de Punto</span>
    </div>
    <ul className="list-disc pl-4 space-y-1 leading-tight text-carbon/75">
      <li><strong>Fórmulas Matemáticas (KaTeX):</strong> Encierra entre <code>$A$</code>, <code>$P_1$</code> o <code>$\alpha$</code> para renderizar notación matemática.</li>
      <li><strong>Texto Plano:</strong> Puedes usar etiquetas simples como <code>A</code>, <code>B</code> o <code>C</code>.</li>
    </ul>
  </div>
);

export const TextContentHelp: React.FC = () => (
  <div className="mt-2 p-2.5 bg-canela/5 rounded-xl border border-canela/20 text-[10px] text-carbon/80 space-y-1.5 font-serif">
    <div className="flex items-center space-x-1">
      <span className="font-bold text-canela text-[11px]">Guía de Formato de Texto & Fórmulas</span>
    </div>
    <ul className="list-disc pl-4 space-y-1 leading-tight text-carbon/75">
      <li><strong>Fórmulas Matemáticas (KaTeX):</strong> Usa <code>$A$</code> o <code>$\alpha + \beta$</code> inline, o <code>$$a^2 + b^2 = c^2$$</code> en bloque.</li>
      <li><strong>Lectura de Puntos en Vivo:</strong> Usa <code>{'{= x(A)}'}</code> o <code>{'{= y(B)}'}</code> para mostrar coordenadas dinámicas de puntos.</li>
      <li><strong>Interpolación de Medidas Reactivas:</strong> Usa <code>{'{= segAB | precision: 2 | unit: "cm"}'}</code> para distancias o medidas evaluadas en vivo.</li>
    </ul>
  </div>
);
