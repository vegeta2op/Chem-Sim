import { memo, useMemo } from 'react';
import type { ChemicalElement, BondType } from '../data/elements';

interface Props {
  element: ChemicalElement;
  size?: number;
  showLabels?: boolean;
}

const ELEMENT_COLORS: Record<string, string> = {
  H: '#FFFFFF',
  C: '#333333',
  O: '#FF4444',
  N: '#4444FF',
  Na: '#AA44AA',
  Cl: '#44AA44',
  S: '#FFFF44',
  Fe: '#AA5500',
  Mg: '#44AAAA',
};

const ELEMENT_SIZES: Record<string, number> = {
  H: 0.6,
  C: 1.0,
  O: 0.95,
  N: 0.95,
  Na: 1.2,
  Cl: 1.1,
  S: 1.15,
  Fe: 1.2,
  Mg: 1.15,
};

function getBondOffset(type: BondType): number {
  switch (type) {
    case 'double': return 0.08;
    case 'triple': return 0.12;
    default: return 0;
  }
}

export const StructuralFormula = memo(function StructuralFormula({ 
  element, 
  size = 120
}: Props) {
  const structure = element.structure;
  
  const renderData = useMemo(() => {
    if (!structure) return null;
    
    const atoms = structure.atoms;
    const scale = size / 4;
    const center = size / 2;
    
    // Calculate bounds
    const xs = atoms.map(a => a.x);
    const ys = atoms.map(a => a.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    const width = maxX - minX || 1;
    const height = maxY - minY || 1;
    const padding = 20;
    
    // Adjust scale to fit
    const scaleX = (size - padding * 2) / (width + 1);
    const scaleY = (size - padding * 2) / (height + 1);
    const finalScale = Math.min(scaleX, scaleY, scale / 2);
    
    const offsetX = center - ((minX + maxX) / 2) * finalScale;
    const offsetY = center - ((minY + maxY) / 2) * finalScale;
    
    return { atoms, finalScale, offsetX, offsetY };
  }, [structure, size]);
  
  if (!renderData) {
    return (
      <div 
        style={{ 
          width: size, 
          height: size, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: size * 0.4,
          color: element.color 
        }}
      >
        {element.symbol}
      </div>
    );
  }
  
  const { atoms, finalScale, offsetX, offsetY } = renderData;
  
  // Collect bonds
  const bonds: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    type: BondType;
  }> = [];
  
  atoms.forEach((atom, fromIdx) => {
    atom.bonds?.forEach(bond => {
      if (bond.to > fromIdx) { // Only add once
        const toAtom = atoms[bond.to];
        bonds.push({
          x1: atom.x * finalScale + offsetX,
          y1: atom.y * finalScale + offsetY,
          x2: toAtom.x * finalScale + offsetX,
          y2: toAtom.y * finalScale + offsetY,
          type: bond.type,
        });
      }
    });
  });
  
  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {/* Render bonds */}
      {bonds.map((bond, idx) => {
        const dx = bond.x2 - bond.x1;
        const dy = bond.y2 - bond.y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / length;
        const ny = dx / length;
        const offset = getBondOffset(bond.type) * finalScale;
        
        if (bond.type === 'single') {
          return (
            <line
              key={idx}
              x1={bond.x1}
              y1={bond.y1}
              x2={bond.x2}
              y2={bond.y2}
              stroke="#888"
              strokeWidth={3}
            />
          );
        } else if (bond.type === 'double') {
          return (
            <g key={idx}>
              <line
                x1={bond.x1 + nx * offset}
                y1={bond.y1 + ny * offset}
                x2={bond.x2 + nx * offset}
                y2={bond.y2 + ny * offset}
                stroke="#888"
                strokeWidth={2}
              />
              <line
                x1={bond.x1 - nx * offset}
                y1={bond.y1 - ny * offset}
                x2={bond.x2 - nx * offset}
                y2={bond.y2 - ny * offset}
                stroke="#888"
                strokeWidth={2}
              />
            </g>
          );
        } else if (bond.type === 'triple') {
          return (
            <g key={idx}>
              <line
                x1={bond.x1 + nx * offset}
                y1={bond.y1 + ny * offset}
                x2={bond.x2 + nx * offset}
                y2={bond.y2 + ny * offset}
                stroke="#888"
                strokeWidth={2}
              />
              <line
                x1={bond.x1}
                y1={bond.y1}
                x2={bond.x2}
                y2={bond.y2}
                stroke="#888"
                strokeWidth={2}
              />
              <line
                x1={bond.x1 - nx * offset}
                y1={bond.y1 - ny * offset}
                x2={bond.x2 - nx * offset}
                y2={bond.y2 - ny * offset}
                stroke="#888"
                strokeWidth={2}
              />
            </g>
          );
        }
        return null;
      })}
      
      {/* Render atoms */}
      {atoms.map((atom, idx) => {
        const x = atom.x * finalScale + offsetX;
        const y = atom.y * finalScale + offsetY;
        const radius = (ELEMENT_SIZES[atom.element] || 0.8) * finalScale * 0.35;
        const color = ELEMENT_COLORS[atom.element] || '#888';
        const isLight = color === '#FFFFFF' || color === '#FFFF44';
        
        return (
          <g key={idx}>
            <circle
              cx={x}
              cy={y}
              r={radius}
              fill={color}
              stroke={isLight ? '#666' : '#333'}
              strokeWidth={isLight ? 2 : 1}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={radius * 0.9}
              fontWeight="bold"
              fill={isLight ? '#333' : '#FFF'}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {atom.element}
            </text>
          </g>
        );
      })}
    </svg>
  );
});
