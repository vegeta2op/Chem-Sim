import { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_ELEMENTS } from '../data/elements';
import type { ChemicalElement } from '../data/elements';
import { REACTIONS } from '../data/reactions';
import type { Reaction, ReactionCondition } from '../data/reactions';

const buildReactionKey = (inputs: Record<string, number>, condition: ReactionCondition): string => {
    const signature = Object.keys(inputs)
        .sort()
        .map(key => `${key}:${inputs[key]}`)
        .join('|');

    return `${condition ?? 'none'}::${signature}`;
};

const REACTION_LOOKUP = new Map<string, Reaction>(
    REACTIONS.map(reaction => [buildReactionKey(reaction.inputs, reaction.condition), reaction])
);

export const useGameEngine = () => {
    const [elements, setElements] = useState<ChemicalElement[]>(() => {
        const saved = localStorage.getItem('reaction-lab-unlocked');
        if (saved) {
            const unlockedIds = JSON.parse(saved) as string[];
            return INITIAL_ELEMENTS.map(el => ({
                ...el,
                unlocked: el.unlocked || unlockedIds.includes(el.id)
            }));
        }
        return INITIAL_ELEMENTS;
    });

    const [workbenchItems, setWorkbenchItems] = useState<ChemicalElement[]>([]);
    const [lastDiscovery, setLastDiscovery] = useState<Reaction | null>(null);

    // Save progress
    useEffect(() => {
        const unlockedIds = elements.filter(e => e.unlocked).map(e => e.id);
        localStorage.setItem('reaction-lab-unlocked', JSON.stringify(unlockedIds));
    }, [elements]);

    const availableElements = useMemo(
        () => elements.filter(e => e.unlocked),
        [elements]
    );

    const addItemToWorkbench = useCallback((element: ChemicalElement) => {
        setWorkbenchItems(prev => [...prev, element]);
    }, []);

    const clearWorkbench = useCallback(() => {
        setWorkbenchItems([]);
        setLastDiscovery(null);
    }, []);

    const checkReaction = useCallback((condition: ReactionCondition = null) => {
        const counts: Record<string, number> = {};
        for (const item of workbenchItems) {
            counts[item.id] = (counts[item.id] || 0) + 1;
        }

        const match = REACTION_LOOKUP.get(buildReactionKey(counts, condition));
        if (!match) return null;

        setElements(prev => {
            let didUnlock = false;
            const next = prev.map(e => {
                if (e.id === match.output && !e.unlocked) {
                    didUnlock = true;
                    return { ...e, unlocked: true };
                }
                return e;
            });
            return didUnlock ? next : prev;
        });

        setLastDiscovery(match);
        return match;
    }, [workbenchItems]);

    const resetProgress = useCallback(() => {
        localStorage.removeItem('reaction-lab-unlocked');
        setElements(INITIAL_ELEMENTS);
        setWorkbenchItems([]);
        setLastDiscovery(null);
    }, []);

    return {
        elements,
        availableElements,
        workbenchItems,
        lastDiscovery,
        addItemToWorkbench,
        clearWorkbench,
        checkReaction,
        resetProgress
    };
};
