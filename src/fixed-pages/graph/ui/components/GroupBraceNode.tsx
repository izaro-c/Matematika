export function GroupBraceNode({ data }: { data: { width: number; label: string } }) {
  const w = data.width;
  return (
    <div style={{ width: w, position: 'relative', textAlign: 'center' }} className="pointer-events-none">
      <div className="font-serif italic text-carbon/75 mb-1 tracking-wide" style={{ fontSize: 30 }}>
        {/* Fondo de papel: las aristas de los primitivos pasan por detrás del rótulo. */}
        <span className="bg-lienzo px-3 rounded-[4px]">{data.label}</span>
      </div>
      <svg width={w} height={30} viewBox={`0 0 ${w} 30`} preserveAspectRatio="none" className="overflow-visible">
        <path d={`M0,0 Q${w / 2},30 ${w},0`} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-carbon/40" />
      </svg>
    </div>
  );
}
