import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ChemicalElement } from '../data/elements';
import { QUIZ_DATA, type QuizQuestion } from '../data/quiz_data';

export interface Quest {
    id: string;
    title: string;
    description: string;
    targetElementId: string;
    completed: boolean;
    rewardText: string;
}

export interface ActiveQuiz extends QuizQuestion {
    completed: boolean;
}

const QUEST_POOL: Quest[] = [
    { id: 'q1', title: 'The First Synthesis', description: 'Create Water (H2O) by combining 2 Hydrogen and 1 Oxygen.', targetElementId: 'H2O', completed: false, rewardText: 'Lab Assistant Badge' },
    { id: 'q2', title: 'Greenhouse Effect', description: 'Combine 1 Carbon and 2 Oxygen to create Carbon Dioxide (CO2).', targetElementId: 'CO2', completed: false, rewardText: 'Environmentalist Title' },
    { id: 'q3', title: 'Electric Taste', description: 'Use Electricity to combine Sodium and Chlorine into NaCl.', targetElementId: 'NaCl', completed: false, rewardText: 'Electrochemical Expert' },
    { id: 'q4', title: 'Deadly Gas', description: 'Synthesize Carbon Monoxide (CO) using Heat.', targetElementId: 'CO', completed: false, rewardText: 'Safety Consultant' },
    { id: 'q5', title: 'Welding Fuel', description: 'Create Acetylene (C2H2) with Heat.', targetElementId: 'C2H2', completed: false, rewardText: 'Industrial Chemist' },
    { id: 'q6', title: 'Fizzy Drinks', description: 'Make Carbonic Acid (H2CO3) from Water and CO2.', targetElementId: 'H2CO3', completed: false, rewardText: 'Beverage Scientist' },
    { id: 'q7', title: 'Ocean Preservation', description: 'Create Brine (NaCl solution) using Electricity.', targetElementId: 'NaCl_aq', completed: false, rewardText: 'Marine Biologist' },
    { id: 'q8', title: 'Natural Gas', description: 'Synthesize Methane (CH4).', targetElementId: 'CH4', completed: false, rewardText: 'Energy Expert' },
    { id: 'q9', title: 'BBQ Fuel', description: 'Create Propane (C3H8) using Heat.', targetElementId: 'C3H8', completed: false, rewardText: 'Camping Guru' },
    { id: 'q10', title: 'Lighter Fuel', description: 'Synthesize Butane (C4H10) with Heat.', targetElementId: 'C4H10', completed: false, rewardText: 'Combustion Specialist' },
];

const shuffle = <T,>(items: T[]): T[] => {
    const next = [...items];
    for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
};

const getRandomQuests = (count: number = 5): Quest[] => {
    return shuffle(QUEST_POOL).slice(0, count);
};

const getRandomQuizzes = (): ActiveQuiz[] => {
    const easies = shuffle(QUIZ_DATA.filter(q => q.difficulty === 'Easy')).slice(0, 5);
    const mediums = shuffle(QUIZ_DATA.filter(q => q.difficulty === 'Medium')).slice(0, 5);
    const hards = shuffle(QUIZ_DATA.filter(q => q.difficulty === 'Hard')).slice(0, 5);

    return [...easies, ...mediums, ...hards].map(q => ({ ...q, completed: false }));
};

export const useQuestSystem = (unlockedElements: ChemicalElement[]) => {
    const [questPool, setQuestPool] = useState<Quest[]>(() => {
        const saved = localStorage.getItem('reaction-lab-quests');
        if (saved) return JSON.parse(saved);
        return getRandomQuests(5);
    });

    const [activeQuizzes, setActiveQuizzes] = useState<ActiveQuiz[]>(() => {
        const saved = localStorage.getItem('reaction-lab-quizzes');
        if (saved) return JSON.parse(saved);
        return getRandomQuizzes();
    });

    const unlockedIdSet = useMemo(
        () => new Set(unlockedElements.map(el => el.id)),
        [unlockedElements]
    );

    const quests = useMemo(
        () => questPool.map(q => (
            (!q.completed && unlockedIdSet.has(q.targetElementId))
                ? { ...q, completed: true }
                : q
        )),
        [questPool, unlockedIdSet]
    );

    useEffect(() => {
        localStorage.setItem('reaction-lab-quests', JSON.stringify(quests));
    }, [quests]);

    useEffect(() => {
        localStorage.setItem('reaction-lab-quizzes', JSON.stringify(activeQuizzes));
    }, [activeQuizzes]);

    const completeQuiz = useCallback((questionId: string) => {
        setActiveQuizzes(prev => prev.map(q => q.id === questionId ? { ...q, completed: true } : q));
    }, []);

    const resetQuests = useCallback(() => {
        setQuestPool(getRandomQuests(5));
        setActiveQuizzes(getRandomQuizzes());

        localStorage.removeItem('reaction-lab-quests');
        localStorage.removeItem('reaction-lab-quizzes');
    }, []);

    return { quests, activeQuizzes, completeQuiz, resetQuests };
};
