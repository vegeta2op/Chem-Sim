import { memo, useCallback } from 'react';
import type { ChemicalElement } from '../data/elements';
import { ElementCard } from './ElementCard';

interface Props {
    elements: ChemicalElement[];
    onDragStart: (e: React.DragEvent, element: ChemicalElement) => void;
}

export const Library = memo(function Library({ elements, onDragStart }: Props) {
    const handleCardDragStart = useCallback((e: React.DragEvent, element: ChemicalElement) => {
        e.dataTransfer.setData('application/json', JSON.stringify(element));
        e.dataTransfer.effectAllowed = 'copy';
        onDragStart(e, element);
    }, [onDragStart]);

    return (
        <div className="glass-panel library-sidebar">
            <h2 style={{ textAlign: 'center', marginBottom: '20px', letterSpacing: '2px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', fontSize: '1.2rem' }}>
                ELEMENTS
            </h2>

            <div className="library-grid">
                {elements.map(el => (
                    <ElementCard
                        key={el.id}
                        element={el}
                        onDragStart={handleCardDragStart}
                        size="md"
                    />
                ))}
            </div>

            <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', opacity: 0.4 }}>
                Drag and drop to combine
            </p>
        </div>
    );
});
