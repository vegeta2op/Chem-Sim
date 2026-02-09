import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import type { ChemicalElement } from '../data/elements';
import { BondedElements, type Bond, type PlacedElement } from './BondedElements';
import type { ReactionCondition } from '../data/reactions';

interface Props {
    placedElements: ChemicalElement[];
    onDrop: (element: ChemicalElement) => void;
    onClear: () => void;
    onReact: (condition: ReactionCondition) => boolean;
    bondsRequired?: boolean; // Whether current objective requires bonds
}

const TOOLS: { id: ReactionCondition; label: string; icon: string; color: string }[] = [
    { id: 'Heat', label: 'Bunsen Burner', icon: '🔥', color: '#f97316' },
    { id: 'Electricity', label: 'Electrolysis', icon: '⚡', color: '#facc15' },
    { id: 'UV', label: 'UV Lamp', icon: '🔦', color: '#a855f7' },
];

export const Workbench = memo(function Workbench({ placedElements, onDrop, onClear, onReact, bondsRequired }: Props) {
    const [isShaking, setIsShaking] = useState(false);
    const [activeTool, setActiveTool] = useState<ReactionCondition>(null);
    const [isBondEditMode, setIsBondEditMode] = useState(false);
    
    // Disable bond edit mode if not required by objective
    useEffect(() => {
        if (bondsRequired === false && isBondEditMode) {
            setIsBondEditMode(false);
        }
    }, [bondsRequired, isBondEditMode]);
    
    // Store element positions
    const [elementPositions, setElementPositions] = useState<PlacedElement[]>([]);
    const [bonds, setBonds] = useState<Bond[]>([]);

    const activeToolConfig = useMemo(
        () => TOOLS.find(tool => tool.id === activeTool),
        [activeTool]
    );

    // Initialize positions when elements are added
    useEffect(() => {
        if (placedElements.length > elementPositions.length) {
            // New elements added - position them
            const newElements = placedElements.slice(elementPositions.length);
            const startX = 200;
            const startY = 200;
            const spacing = 80;
            
            const newPositions: PlacedElement[] = newElements.map((el, idx) => ({
                id: `${el.id}-${Date.now()}-${idx}`,
                element: el,
                x: startX + (elementPositions.length + idx) * spacing,
                y: startY + (idx % 2 === 0 ? 0 : 40)
            }));
            
            setElementPositions(prev => [...prev, ...newPositions]);
        } else if (placedElements.length < elementPositions.length) {
            // Elements cleared
            setElementPositions([]);
            setBonds([]);
        }
    }, [placedElements, elementPositions.length]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data && data.id) {
                onDrop(data);
            }
        } catch (err) {
            console.error("Drop failed", err);
        }
    }, [onDrop]);

    const handleReactClick = useCallback(() => {
        const success = onReact(activeTool);
        if (!success) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }
    }, [activeTool, onReact]);

    const handleToggleTool = useCallback((toolId: ReactionCondition) => {
        setActiveTool(prev => (prev === toolId ? null : toolId));
    }, []);

    const handleClear = useCallback(() => {
        setElementPositions([]);
        setBonds([]);
        onClear();
    }, [onClear]);

    const handleUpdateElements = useCallback((newElements: PlacedElement[]) => {
        setElementPositions(newElements);
    }, []);

    const handleUpdateBonds = useCallback((newBonds: Bond[]) => {
        setBonds(newBonds);
    }, []);

    // Auto-arrange elements in a smart layout
    const handleAutoArrange = useCallback(() => {
        if (elementPositions.length === 0) return;
        
        const centerX = 200;
        const centerY = 200;
        const radius = Math.min(120, elementPositions.length * 25);
        
        const arranged = elementPositions.map((el, idx) => {
            const angle = (idx / elementPositions.length) * 2 * Math.PI - Math.PI / 2;
            return {
                ...el,
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });
        
        setElementPositions(arranged);
    }, [elementPositions]);

    return (
        <div
            className={`glass-panel workbench-area ${isShaking ? 'shake' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="workbench-header" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
            }}>
                <h2 style={{ margin: 0, letterSpacing: '2px', fontSize: '1.2rem' }}>WORKBENCH</h2>

                <div className="tools-tray" style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    background: 'rgba(0,0,0,0.2)', 
                    padding: '6px', 
                    borderRadius: '12px' 
                }}>
                    {TOOLS.map(tool => (
                        <button
                            key={tool.id}
                            onClick={() => handleToggleTool(tool.id)}
                            className={`btn ${activeTool === tool.id ? 'active' : 'btn-ghost'}`}
                            style={{
                                padding: '8px',
                                minWidth: '40px',
                                fontSize: '18px',
                                background: activeTool === tool.id ? `${tool.color}30` : 'transparent',
                                border: activeTool === tool.id ? `1px solid ${tool.color}` : '1px solid transparent',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                            title={tool.label}
                        >
                            {tool.icon}
                        </button>
                    ))}
                </div>

                <div className="button-group" style={{ display: 'flex', gap: '8px' }}>
                    {elementPositions.length > 0 && (
                        <>
                            <button 
                                onClick={() => bondsRequired !== false && setIsBondEditMode(!isBondEditMode)}
                                className="btn"
                                disabled={bondsRequired === false}
                                style={{
                                    background: isBondEditMode ? 'rgba(79, 195, 247, 0.3)' : 
                                               bondsRequired === false ? 'rgba(100, 100, 100, 0.2)' : 'transparent',
                                    border: isBondEditMode ? '1px solid #4FC3F7' : 
                                            bondsRequired === false ? '1px solid rgba(100,100,100,0.3)' : '1px solid rgba(255,255,255,0.2)',
                                    color: isBondEditMode ? '#4FC3F7' : 
                                           bondsRequired === false ? '#666' : '#94a3b8',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    cursor: bondsRequired === false ? 'not-allowed' : 'pointer',
                                    opacity: bondsRequired === false ? 0.5 : 1
                                }}
                                title={bondsRequired === false ? 'Bonds not required for this objective' : 'Edit Bonds'}
                            >
                                {isBondEditMode ? '✓ Done' : bondsRequired === false ? '⚛ Bonds (N/A)' : '⚛ Bonds'}
                            </button>
                            <button 
                                onClick={handleAutoArrange}
                                className="btn btn-ghost"
                                style={{ padding: '8px 16px' }}
                                title="Auto Arrange"
                            >
                                ⟲
                            </button>
                        </>
                    )}
                    <button onClick={handleClear} className="btn btn-ghost">Clear</button>
                    <button onClick={handleReactClick} className="btn btn-primary">REACT</button>
                </div>
            </div>

            <div className="workbench-drop-zone" style={{
                position: 'relative',
                background: activeToolConfig ? `radial-gradient(circle at center, ${activeToolConfig.color}20 0%, transparent 70%)` : '',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {activeTool && (
                    <div style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        left: '10px', 
                        fontSize: '12px', 
                        color: activeToolConfig?.color, 
                        fontWeight: 'bold' 
                    }}>
                        ACTIVE CONDITION: {activeTool.toUpperCase()}
                    </div>
                )}

                {elementPositions.length === 0 ? (
                    <div style={{ opacity: 0.3, fontSize: '1.2rem' }}>Drop elements to begin...</div>
                ) : (
                    <BondedElements 
                        elements={elementPositions}
                        bonds={bonds}
                        onUpdateElements={handleUpdateElements}
                        onUpdateBonds={handleUpdateBonds}
                        size={400}
                        isBondEditMode={isBondEditMode}
                    />
                )}
            </div>
        </div>
    );
});
