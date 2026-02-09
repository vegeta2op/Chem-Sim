import { useState, useCallback } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { useObjectiveSystem } from './hooks/useObjectiveSystem';
import { Library } from './components/Library';
import { Workbench } from './components/Workbench';
import { ObjectivePanel } from './components/ObjectivePanel';
import { CanvasBackground } from './components/CanvasBackground';
import type { ChemicalElement } from './data/elements';
import type { ReactionCondition } from './data/reactions';

function App() {
  const {
    availableElements,
    workbenchItems,
    lastDiscovery,
    addItemToWorkbench,
    clearWorkbench,
    checkReaction,
    resetProgress: resetEngine
  } = useGameEngine();

  // Initialize objective system
  const {
    progress,
    currentObjective,
    availableObjectives,
    objectivesByTier,
    stats,
    isObjectiveCompleted,
    isObjectiveUnlocked,
    selectObjective,
    completeObjective,
    validateObjective,
    resetProgress: resetObjectives
  } = useObjectiveSystem(availableElements);

  const resetAll = useCallback(() => {
    if (confirm("Reset all progress and objectives?")) {
      resetEngine();
      resetObjectives();
    }
  }, [resetEngine, resetObjectives]);

  const [showDiscovery, setShowDiscovery] = useState(false);
  const [lastDiscoveryTime, setLastDiscoveryTime] = useState<string | null>(null);
  const [objectiveValidationMessage, setObjectiveValidationMessage] = useState<string | null>(null);

  const handleDragStart = useCallback(() => { }, []);

  const handleDrop = useCallback((element: ChemicalElement) => {
    addItemToWorkbench(element);
  }, [addItemToWorkbench]);

  const handleReact = useCallback((condition: ReactionCondition) => {
    const result = checkReaction(condition);
    
    if (result) {
      setShowDiscovery(true);
      setLastDiscoveryTime(new Date().toLocaleTimeString());
      
      // Check if this completes the current objective
      if (currentObjective) {
        const validation = validateObjective(
          currentObjective,
          workbenchItems.map(el => el.id),
          false // TODO: check actual bond state
        );
        
        if (validation.completed) {
          const completed = completeObjective(currentObjective.id);
          if (completed) {
            setObjectiveValidationMessage(`Objective Complete: ${currentObjective.title}! ${currentObjective.reward}`);
            setTimeout(() => setObjectiveValidationMessage(null), 5000);
          }
        }
      }
    }
    
    return !!result;
  }, [checkReaction, currentObjective, workbenchItems, validateObjective, completeObjective]);

  // Determine if bonds are required by current objective
  const bondsRequired = currentObjective?.requiresBonds ?? false;

  return (
    <div className="app-container">
      <CanvasBackground />

      {/* Top Bar */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        display: 'flex', 
        gap: '10px',
        zIndex: 100 
      }}>
        <button
          onClick={resetAll}
          style={{ fontSize: '10px' }}
          className="btn btn-ghost"
        >
          Reset Progress
        </button>
      </div>

      {/* Objective Validation Message */}
      {objectiveValidationMessage && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(74, 222, 128, 0.9)',
          color: '#000',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: 'bold',
          zIndex: 100,
          animation: 'slideDown 0.3s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          {objectiveValidationMessage}
        </div>
      )}

      {/* Main Layout */}
      <Library elements={availableElements} onDragStart={handleDragStart} />

      <div className="main-content">
        <Workbench
          placedElements={workbenchItems}
          onDrop={handleDrop}
          onClear={clearWorkbench}
          onReact={handleReact}
          bondsRequired={bondsRequired}
        />

        <div className="glass-panel" style={{ height: '100px', padding: '16px' }}>
          <h3 style={{ 
            fontSize: '10px', 
            opacity: 0.5, 
            textTransform: 'uppercase', 
            marginBottom: '8px', 
            letterSpacing: '1px' 
          }}>
            Reaction Log
          </h3>
          <div style={{ fontFamily: 'monospace', color: '#4ade80', fontSize: '13px' }}>
            {lastDiscovery ? (
              <span>[{lastDiscoveryTime ?? '--:--:--'}] SYNTHESIS: {lastDiscovery.equation}</span>
            ) : (
              <span style={{ opacity: 0.3 }}>Wait for a successful reaction...</span>
            )}
          </div>
        </div>
      </div>

      <ObjectivePanel
        objectives={availableObjectives}
        objectivesByTier={objectivesByTier}
        currentObjective={currentObjective}
        progress={progress}
        stats={stats}
        isObjectiveCompleted={isObjectiveCompleted}
        isObjectiveUnlocked={isObjectiveUnlocked}
        onSelectObjective={selectObjective}
        onResetProgress={resetObjectives}
      />

      {/* Discovery Modal */}
      {showDiscovery && lastDiscovery && (
        <div className="modal-overlay">
          <div className="glass-panel animate-float" style={{ 
            padding: '40px', 
            maxWidth: '440px', 
            width: '90%', 
            textAlign: 'center', 
            border: '1px solid var(--accent-blue)', 
            boxShadow: '0 0 50px rgba(59, 130, 246, 0.3)' 
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#60a5fa', fontWeight: '800' }}>
              REACTION SUCCESS
            </h2>
            <div style={{ fontSize: '4rem', margin: '20px 0' }}>🧪</div>
            <div style={{ 
              background: 'rgba(0,0,0,0.4)', 
              padding: '16px', 
              borderRadius: '12px', 
              fontFamily: 'monospace', 
              color: '#86efac', 
              marginBottom: '20px', 
              border: '1px solid rgba(134, 239, 172, 0.3)', 
              fontSize: '1.2rem' 
            }}>
              {lastDiscovery.equation}
            </div>
            <p style={{ color: '#94a3b8', marginBottom: '30px', fontStyle: 'italic', lineHeight: '1.6' }}>
              {lastDiscovery.description}
            </p>
            <button
              onClick={() => {
                setShowDiscovery(false);
                clearWorkbench();
              }}
              className="btn btn-primary"
              style={{ width: '100%', height: '50px' }}
            >
              Back to Laboratory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
