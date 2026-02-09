import { memo, useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type { ChemicalElement, BondType } from '../data/elements';

// Valency rules for chemical bonding logic
export const ELEMENT_VALENCY: Record<string, number> = {
  H: 1,
  C: 4,
  O: 2,
  N: 3,
  Na: 1,
  Cl: 1,
  S: 2,
  Mg: 2,
  Fe: 2,
};

export interface Bond {
  fromIndex: number;
  toIndex: number;
  type: BondType;
}

export interface PlacedElement {
  id: string;
  element: ChemicalElement;
  x: number;
  y: number;
}

interface Props {
  elements: PlacedElement[];
  bonds: Bond[];
  onUpdateElements: (elements: PlacedElement[]) => void;
  onUpdateBonds: (bonds: Bond[]) => void;
  size?: number;
  isBondEditMode?: boolean;
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

function lighten(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function getBondTypeString(type: BondType): string {
  switch (type) {
    case 'double': return '=';
    case 'triple': return '≡';
    default: return '-';
  }
}

export const BondedElements = memo(function BondedElements({ 
  elements, 
  bonds,
  onUpdateElements,
  onUpdateBonds,
  size = 400,
  isBondEditMode = false
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [hoveredBond, setHoveredBond] = useState<number | null>(null);
  
  // Calculate remaining valency for each element
  const valencyStatus = useMemo(() => {
    const status: Record<number, { used: number; max: number }> = {};
    
    elements.forEach((el, idx) => {
      const maxValency = ELEMENT_VALENCY[el.element.symbol] || 1;
      status[idx] = { used: 0, max: maxValency };
    });
    
    bonds.forEach(bond => {
      const bondValue = bond.type === 'single' ? 1 : bond.type === 'double' ? 2 : 3;
      status[bond.fromIndex].used += bondValue;
      status[bond.toIndex].used += bondValue;
    });
    
    return status;
  }, [elements, bonds]);

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBondEditMode) {
      // In bond edit mode, clicking selects elements
      setSelectedIndices(prev => {
        if (prev.includes(index)) {
          return prev.filter(i => i !== index);
        }
        if (prev.length >= 2) {
          return [index];
        }
        return [...prev, index];
      });
    } else {
      // In drag mode
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        setDraggingIndex(index);
        setDragOffset({
          x: e.clientX - rect.left - elements[index].x,
          y: e.clientY - rect.top - elements[index].y
        });
      }
    }
  }, [elements, isBondEditMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingIndex !== null && !isBondEditMode) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const newX = Math.max(40, Math.min(size - 40, e.clientX - rect.left - dragOffset.x));
        const newY = Math.max(40, Math.min(size - 40, e.clientY - rect.top - dragOffset.y));
        
        const newElements = [...elements];
        newElements[draggingIndex] = {
          ...newElements[draggingIndex],
          x: newX,
          y: newY
        };
        onUpdateElements(newElements);
      }
    }
  }, [draggingIndex, elements, dragOffset, size, onUpdateElements, isBondEditMode]);

  const handleMouseUp = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  const handleBondClick = useCallback((bondIndex: number) => {
    if (!isBondEditMode) return;
    
    const bond = bonds[bondIndex];
    const cycleType = (type: BondType): BondType => {
      switch (type) {
        case 'single': return 'double';
        case 'double': return 'triple';
        case 'triple': return 'single';
      }
    };
    
    // Check if changing bond type is valid
    const newType = cycleType(bond.type);
    const newBondValue = newType === 'single' ? 1 : newType === 'double' ? 2 : 3;
    const currentBondValue = bond.type === 'single' ? 1 : bond.type === 'double' ? 2 : 3;
    const bondDiff = newBondValue - currentBondValue;
    
    const fromStatus = valencyStatus[bond.fromIndex];
    const toStatus = valencyStatus[bond.toIndex];
    
    if (fromStatus.used + bondDiff <= fromStatus.max && 
        toStatus.used + bondDiff <= toStatus.max) {
      const newBonds = [...bonds];
      newBonds[bondIndex] = { ...bond, type: newType };
      onUpdateBonds(newBonds);
    }
  }, [bonds, isBondEditMode, onUpdateBonds, valencyStatus]);

  // Create bond when 2 elements are selected
  useEffect(() => {
    if (isBondEditMode && selectedIndices.length === 2) {
      const [idx1, idx2] = selectedIndices;
      
      // Check if bond already exists
      const existingBondIndex = bonds.findIndex(
        b => (b.fromIndex === idx1 && b.toIndex === idx2) || 
             (b.fromIndex === idx2 && b.toIndex === idx1)
      );
      
      if (existingBondIndex >= 0) {
        // Cycle existing bond type
        handleBondClick(existingBondIndex);
      } else {
        // Create new single bond if valency allows
        const fromStatus = valencyStatus[idx1];
        const toStatus = valencyStatus[idx2];
        
        if (fromStatus.used < fromStatus.max && toStatus.used < toStatus.max) {
          const newBond: Bond = {
            fromIndex: idx1,
            toIndex: idx2,
            type: 'single'
          };
          onUpdateBonds([...bonds, newBond]);
        }
      }
      
      setSelectedIndices([]);
    }
  }, [selectedIndices, isBondEditMode, bonds, valencyStatus, onUpdateBonds]);

  const handleSvgClick = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setSelectedIndices([]);
    }
  }, []);

  const radius = 30;

  return (
    <div style={{ position: 'relative' }}>
      {isBondEditMode && (
        <div style={{
          position: 'absolute',
          top: -30,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '12px',
          color: '#4FC3F7',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}>
          Click two elements to create a bond. Click a bond to cycle types.
        </div>
      )}
      
      <svg 
        ref={svgRef}
        width={size} 
        height={size} 
        style={{ 
          overflow: 'visible',
          cursor: isBondEditMode ? 'crosshair' : draggingIndex !== null ? 'grabbing' : 'default',
          userSelect: 'none'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleSvgClick}
      >
        <defs>
          <linearGradient id="bondGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#81D4FA" stopOpacity="1" />
            <stop offset="100%" stopColor="#4FC3F7" stopOpacity="0.8" />
          </linearGradient>
          
          <filter id="atomGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Render bonds */}
        {bonds.map((bond, idx) => {
          const fromEl = elements[bond.fromIndex];
          const toEl = elements[bond.toIndex];
          if (!fromEl || !toEl) return null;
          
          const dx = toEl.x - fromEl.x;
          const dy = toEl.y - fromEl.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const nx = -dy / length;
          const ny = dx / length;
          const offset = bond.type === 'double' ? 4 : bond.type === 'triple' ? 6 : 0;
          
          const isHovered = hoveredBond === idx;
          
          return (
            <g 
              key={`bond-${idx}`}
              onMouseEnter={() => setHoveredBond(idx)}
              onMouseLeave={() => setHoveredBond(null)}
              onClick={(e) => {
                e.stopPropagation();
                handleBondClick(idx);
              }}
              style={{ cursor: isBondEditMode ? 'pointer' : 'default' }}
            >
              {/* Bond glow */}
              <line
                x1={fromEl.x}
                y1={fromEl.y}
                x2={toEl.x}
                y2={toEl.y}
                stroke={isBondEditMode ? "rgba(100, 200, 255, 0.3)" : "rgba(100, 200, 255, 0.2)"}
                strokeWidth={isHovered ? 16 : 12}
                strokeLinecap="round"
                filter="blur(4px)"
              />
              
              {/* Bond lines based on type */}
              {bond.type === 'single' && (
                <line
                  x1={fromEl.x}
                  y1={fromEl.y}
                  x2={toEl.x}
                  y2={toEl.y}
                  stroke="url(#bondGradient)"
                  strokeWidth={isHovered ? 5 : 3}
                  strokeLinecap="round"
                  className="bond-line"
                />
              )}
              
              {bond.type === 'double' && (
                <>
                  <line
                    x1={fromEl.x + nx * offset}
                    y1={fromEl.y + ny * offset}
                    x2={toEl.x + nx * offset}
                    y2={toEl.y + ny * offset}
                    stroke="url(#bondGradient)"
                    strokeWidth={isHovered ? 4 : 2}
                    strokeLinecap="round"
                  />
                  <line
                    x1={fromEl.x - nx * offset}
                    y1={fromEl.y - ny * offset}
                    x2={toEl.x - nx * offset}
                    y2={toEl.y - ny * offset}
                    stroke="url(#bondGradient)"
                    strokeWidth={isHovered ? 4 : 2}
                    strokeLinecap="round"
                  />
                </>
              )}
              
              {bond.type === 'triple' && (
                <>
                  <line
                    x1={fromEl.x + nx * offset}
                    y1={fromEl.y + ny * offset}
                    x2={toEl.x + nx * offset}
                    y2={toEl.y + ny * offset}
                    stroke="url(#bondGradient)"
                    strokeWidth={isHovered ? 4 : 2}
                    strokeLinecap="round"
                  />
                  <line
                    x1={fromEl.x}
                    y1={fromEl.y}
                    x2={toEl.x}
                    y2={toEl.y}
                    stroke="url(#bondGradient)"
                    strokeWidth={isHovered ? 4 : 2}
                    strokeLinecap="round"
                  />
                  <line
                    x1={fromEl.x - nx * offset}
                    y1={fromEl.y - ny * offset}
                    x2={toEl.x - nx * offset}
                    y2={toEl.y - ny * offset}
                    stroke="url(#bondGradient)"
                    strokeWidth={isHovered ? 4 : 2}
                    strokeLinecap="round"
                  />
                </>
              )}
              
              {/* Bond type label (visible in edit mode) */}
              {isBondEditMode && (
                <text
                  x={(fromEl.x + toEl.x) / 2}
                  y={(fromEl.y + toEl.y) / 2 - 10}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#4FC3F7"
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {getBondTypeString(bond.type)}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Render elements */}
        {elements.map((el, idx) => {
          const color = ELEMENT_COLORS[el.element.symbol] || el.element.color;
          const isLight = color === '#FFFFFF' || color === '#FFFF44';
          const isSelected = selectedIndices.includes(idx);
          const status = valencyStatus[idx];
          const remaining = status.max - status.used;
          const isSaturated = remaining === 0;
          
          return (
            <g 
              key={`atom-${idx}`}
              transform={`translate(${el.x}, ${el.y})`}
              onMouseDown={(e) => handleMouseDown(e, idx)}
              style={{ 
                cursor: isBondEditMode ? (isSaturated ? 'not-allowed' : 'pointer') : 'grab'
              }}
            >
              {/* Selection ring */}
              {isSelected && (
                <circle
                  r={radius + 8}
                  fill="none"
                  stroke="#4FC3F7"
                  strokeWidth={3}
                  strokeDasharray="5,5"
                />
              )}
              
              {/* Valency indicator ring */}
              <circle
                r={radius + 4}
                fill="none"
                stroke={isSaturated ? '#44AA44' : '#FF4444'}
                strokeWidth={2}
                opacity={isBondEditMode ? 0.8 : 0.3}
              />
              
              {/* Glow effect */}
              <circle
                r={radius + 2}
                fill={color}
                opacity={0.2}
                filter="url(#atomGlow)"
              />
              
              {/* Main atom circle */}
              <defs>
                <radialGradient id={`atomGradient-${idx}`} cx="30%" cy="30%">
                  <stop offset="0%" stopColor={isLight ? '#fff' : lighten(color, 30)} />
                  <stop offset="100%" stopColor={color} />
                </radialGradient>
              </defs>
              
              <circle
                r={radius}
                fill={`url(#atomGradient-${idx})`}
                stroke={isLight ? '#999' : 'rgba(255,255,255,0.5)'}
                strokeWidth={isLight ? 2 : 1.5}
              />
              
              {/* Highlight */}
              <ellipse
                cx={-radius * 0.3}
                cy={-radius * 0.3}
                rx={radius * 0.25}
                ry={radius * 0.2}
                fill="rgba(255, 255, 255, 0.4)"
              />
              
              {/* Element symbol */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={radius * 0.7}
                fontWeight="bold"
                fill={isLight ? '#333' : '#fff'}
                style={{ pointerEvents: 'none' }}
              >
                {el.element.symbol}
              </text>
              
              {/* Valency counter (in edit mode) */}
              {isBondEditMode && (
                <text
                  y={radius + 14}
                  textAnchor="middle"
                  fontSize={10}
                  fill={isSaturated ? '#44AA44' : '#FFAA44'}
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {status.used}/{status.max}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Legend for valency */}
      {isBondEditMode && (
        <div style={{
          position: 'absolute',
          bottom: -40,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          fontSize: '11px',
          color: '#888'
        }}>
          <span style={{ color: '#44AA44' }}>● Fully bonded</span>
          <span style={{ color: '#FFAA44' }}>● Can bond more</span>
        </div>
      )}
    </div>
  );
});

export default BondedElements;
