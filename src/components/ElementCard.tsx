import { memo } from 'react';
import type { ChemicalElement } from '../data/elements';

interface Props {
    element: ChemicalElement;
    onClick?: () => void;
    onDragStart?: (e: React.DragEvent, element: ChemicalElement) => void;
    size?: 'sm' | 'md' | 'lg';
}

export const ElementCard = memo(function ElementCard({ element, onClick, onDragStart, size = 'md' }: Props) {
    return (
        <div
            className={`glass-panel element-card element-${size}`}
            style={{
                borderColor: element.color,
                boxShadow: `0 0 15px ${element.color}20`
            }}
            draggable={!!onDragStart}
            onDragStart={(e) => onDragStart && onDragStart(e, element)}
            onClick={onClick}
        >
            <span className="atomic-number">
                {element.atomicNumber > 0 ? element.atomicNumber : ''}
            </span>

            <div
                className="symbol"
                style={{ color: element.color, textShadow: `0 0 10px ${element.color}60` }}
            >
                {element.symbol}
            </div>

            <div className="name">
                {element.name}
            </div>
        </div>
    );
});
