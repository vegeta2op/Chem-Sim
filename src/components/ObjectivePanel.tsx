import { memo, useState, useCallback } from 'react';
import type { Objective, ObjectiveTier } from '../data/objectives';
import type { UserProgress } from '../hooks/useObjectiveSystem';

interface Props {
  objectives: Objective[];
  objectivesByTier: Record<number, Objective[]>;
  _unused?: string;
  currentObjective: Objective | null;
  progress: UserProgress;
  stats: {
    totalCompleted: number;
    totalAvailable: number;
    percentage: number;
    currentTier: ObjectiveTier;
    currentObjective: Objective | null;
  };
  isObjectiveCompleted: (id: string) => boolean;
  isObjectiveUnlocked: (obj: Objective) => boolean;
  onSelectObjective: (id: string) => void;
  onResetProgress: () => void;
}

const TIER_COLORS: Record<number, string> = {
  1: '#4ade80', // Green - Basic
  2: '#60a5fa', // Blue - Bond mastery
  3: '#facc15', // Yellow - Advanced bonds
  4: '#f97316', // Orange - Complex structures
  5: '#a855f7', // Purple - Multi-step
  6: '#ef4444', // Red - Master
};

const TIER_NAMES: Record<number, string> = {
  1: 'Tier 1: Basic Synthesis',
  2: 'Tier 2: Bond Mastery',
  3: 'Tier 3: Double & Triple Bonds',
  4: 'Tier 4: Advanced Structures',
  5: 'Tier 5: Multi-Step Synthesis',
  6: 'Tier 6: Master Challenges',
};

export const ObjectivePanel = memo(function ObjectivePanel({
  objectives: _objectives,
  objectivesByTier,
  currentObjective,
  progress,
  stats,
  isObjectiveCompleted,
  isObjectiveUnlocked,
  onSelectObjective,
  onResetProgress,
}: Props) {
  const [expandedTier, setExpandedTier] = useState<number | null>(1);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleTierToggle = useCallback((tier: number) => {
    setExpandedTier(prev => prev === tier ? null : tier);
  }, []);

  const getObjectiveStatus = (objective: Objective): 'locked' | 'unlocked' | 'completed' => {
    if (isObjectiveCompleted(objective.id)) return 'completed';
    if (isObjectiveUnlocked(objective)) return 'unlocked';
    return 'locked';
  };

  return (
    <div className="glass-panel" style={{ 
      width: '320px', 
      padding: '20px', 
      display: 'flex', 
      flexDirection: 'column',
      maxHeight: 'calc(100vh - 40px)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '2px' }}>OBJECTIVES</h2>
        <div style={{ 
          fontSize: '11px', 
          color: 'var(--text-secondary)',
          marginTop: '4px'
        }}>
          {stats.totalCompleted}/{stats.totalAvailable} Completed ({stats.percentage}%)
        </div>
        
        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          marginTop: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${stats.percentage}%`,
            height: '100%',
            background: `linear-gradient(90deg, #4ade80, #60a5fa)`,
            borderRadius: '2px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Current Objective Detail */}
      {currentObjective && (
        <div style={{
          padding: '12px',
          background: 'rgba(79, 195, 247, 0.1)',
          border: '1px solid rgba(79, 195, 247, 0.3)',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <div style={{ 
            fontSize: '10px', 
            color: '#4FC3F7',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '4px'
          }}>
            Currently Selected
          </div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
            {currentObjective.title}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {currentObjective.description}
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: currentObjective.requiresBonds ? 'rgba(79, 195, 247, 0.2)' : 'rgba(148, 163, 184, 0.2)',
              color: currentObjective.requiresBonds ? '#4FC3F7' : '#94a3b8'
            }}>
              {currentObjective.requiresBonds ? '⚛ Bonds Required' : '⚡ REACT Only'}
            </span>
          </div>
        </div>
      )}

      {/* Tier List */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {[1, 2, 3, 4, 5, 6].map(tier => {
          const tierObjectives = objectivesByTier[tier] || [];
          const tierProgress = progress.tierProgress[tier as ObjectiveTier];
          const isExpanded = expandedTier === tier;
          const tierColor = TIER_COLORS[tier];
          
          if (tierObjectives.length === 0) return null;

          return (
            <div key={tier} style={{
              border: `1px solid ${tierColor}30`,
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {/* Tier Header */}
              <button
                onClick={() => handleTierToggle(tier)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: isExpanded ? `${tierColor}20` : 'rgba(0,0,0,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'white',
                  textAlign: 'left'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: tierColor }}>
                    {TIER_NAMES[tier]}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    {tierProgress.completed}/{tierProgress.total} Complete
                  </div>
                </div>
                <span style={{ 
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  fontSize: '12px'
                }}>
                  ▼
                </span>
              </button>

              {/* Tier Objectives */}
              {isExpanded && (
                <div style={{ padding: '8px' }}>
                  {tierObjectives.map(objective => {
                    const status = getObjectiveStatus(objective);
                    const isSelected = currentObjective?.id === objective.id;
                    
                    return (
                      <button
                        key={objective.id}
                        onClick={() => status !== 'locked' && onSelectObjective(objective.id)}
                        disabled={status === 'locked'}
                        style={{
                          width: '100%',
                          padding: '8px',
                          marginBottom: '4px',
                          background: isSelected ? `${tierColor}30` : 
                                     status === 'completed' ? 'rgba(74, 222, 128, 0.1)' :
                                     status === 'locked' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)',
                          border: `1px solid ${isSelected ? tierColor : 
                                               status === 'completed' ? '#4ade80' :
                                               status === 'locked' ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '6px',
                          cursor: status === 'locked' ? 'not-allowed' : 'pointer',
                          opacity: status === 'locked' ? 0.5 : 1,
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        {/* Status Icon */}
                        <span style={{ fontSize: '12px' }}>
                          {status === 'completed' ? '✓' :
                           status === 'locked' ? '🔒' :
                           '○'}
                        </span>
                        
                        {/* Objective Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '11px', 
                            fontWeight: isSelected ? 'bold' : 'normal',
                            color: isSelected ? tierColor : 'white'
                          }}>
                            #{objective.order}. {objective.title}
                          </div>
                          <div style={{ 
                            fontSize: '9px', 
                            color: 'var(--text-secondary)',
                            marginTop: '2px'
                          }}>
                            {status === 'locked' ? 'Complete previous to unlock' :
                             objective.requiresBonds ? '⚛ Bonds' : '⚡ REACT'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset Button */}
      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="btn btn-ghost"
            style={{ width: '100%', fontSize: '11px', padding: '8px' }}
          >
            Reset All Progress
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowConfirmReset(false)}
              className="btn btn-ghost"
              style={{ flex: 1, fontSize: '11px' }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onResetProgress();
                setShowConfirmReset(false);
              }}
              className="btn"
              style={{ 
                flex: 1, 
                fontSize: '11px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid #ef4444'
              }}
            >
              Confirm Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default ObjectivePanel;
