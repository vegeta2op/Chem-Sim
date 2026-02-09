import { memo, useCallback, useState } from 'react';
import type { Quest, ActiveQuiz } from '../hooks/useQuestSystem';

interface Props {
    quests: Quest[];
    activeQuizzes: ActiveQuiz[];
    onAnswerQuiz: (quizId: string, answer: string) => boolean;
}

export const QuestPanel = memo(function QuestPanel({ quests, activeQuizzes, onAnswerQuiz }: Props) {
    const [activeTab, setActiveTab] = useState<'objectives' | 'exam'>('objectives');

    const handleQuizClick = useCallback((quiz: ActiveQuiz) => {
        if (quiz.completed) return;
        const answer = prompt(quiz.question + '\n\nOptions:\n' + quiz.options.map((o, i) => `${i + 1}. ${o}`).join('\n') + '\n\nType the exact answer:');
        if (answer) {
            if (onAnswerQuiz(quiz.id, answer)) {
                alert("Correct! Quest Completed.");
            } else {
                alert("Incorrect. Try again.");
            }
        }
    }, [onAnswerQuiz]);

    return (
        <div className="glass-panel" style={{ width: '300px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
                <button
                    className={`btn ${activeTab === 'objectives' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('objectives')}
                    style={{ fontSize: '10px', padding: '6px 12px' }}
                >
                    OBJECTIVES
                </button>
                <button
                    className={`btn ${activeTab === 'exam' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('exam')}
                    style={{ fontSize: '10px', padding: '6px 12px' }}
                >
                    LAB EXAM
                </button>
            </div>

            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeTab === 'objectives' ? (
                    quests.map(quest => (
                        <div
                            key={quest.id}
                            className="glass-panel"
                            style={{
                                padding: '12px',
                                border: quest.completed ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.1)',
                                background: quest.completed ? 'rgba(74, 222, 128, 0.1)' : 'rgba(0,0,0,0.2)',
                                opacity: quest.completed ? 0.6 : 1
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{quest.title}</span>
                                {quest.completed && <span style={{ color: '#4ade80', fontSize: '10px' }}>✓</span>}
                            </div>
                            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', margin: 0 }}>{quest.description}</p>
                        </div>
                    ))
                ) : (
                    activeQuizzes.map(quiz => (
                        <div
                            key={quiz.id}
                            onClick={() => handleQuizClick(quiz)}
                            className="glass-panel"
                            style={{
                                padding: '12px',
                                border: quiz.completed ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.1)',
                                background: quiz.completed ? 'rgba(74, 222, 128, 0.1)' : 'rgba(0,0,0,0.2)',
                                opacity: quiz.completed ? 0.6 : 1,
                                cursor: quiz.completed ? 'default' : 'pointer'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 'bold', color: quiz.difficulty === 'Easy' ? '#86efac' : quiz.difficulty === 'Medium' ? '#facc15' : '#f87171' }}>
                                    {quiz.difficulty.toUpperCase()}
                                </span>
                                {quiz.completed && <span style={{ color: '#4ade80', fontSize: '10px' }}>✓</span>}
                            </div>
                            <p style={{ fontSize: '11px', color: 'white', margin: 0 }}>{quiz.question}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});
