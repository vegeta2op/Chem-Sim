import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Objective, ObjectiveTier } from '../data/objectives';
import { ALL_OBJECTIVES, getObjectiveById } from '../data/objectives';
import type { ChemicalElement } from '../data/elements';

export interface UserProgress {
  currentTier: ObjectiveTier;
  completedObjectiveIds: string[];
  currentObjectiveId: string | null;
  tierProgress: Record<ObjectiveTier, { completed: number; total: number }>;
}

export interface ObjectiveValidationResult {
  success: boolean;
  message: string;
  completed: boolean;
}

const OBJECTIVES_PER_TIER = 50;

export const useObjectiveSystem = (_unlockedElements: ChemicalElement[]) => {
  // Load progress from localStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('reaction-lab-objective-progress');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      currentTier: 1,
      completedObjectiveIds: [],
      currentObjectiveId: 't1_obj1', // Start with first objective
      tierProgress: {
        1: { completed: 0, total: OBJECTIVES_PER_TIER },
        2: { completed: 0, total: OBJECTIVES_PER_TIER },
        3: { completed: 0, total: OBJECTIVES_PER_TIER },
        4: { completed: 0, total: OBJECTIVES_PER_TIER },
        5: { completed: 0, total: OBJECTIVES_PER_TIER },
        6: { completed: 0, total: OBJECTIVES_PER_TIER },
      }
    };
  });

  // Save progress whenever it changes
  useEffect(() => {
    localStorage.setItem('reaction-lab-objective-progress', JSON.stringify(progress));
  }, [progress]);

  // Get all available objectives for the current tier and below
  const availableObjectives = useMemo(() => {
    return ALL_OBJECTIVES.filter(obj => obj.tier <= progress.currentTier);
  }, [progress.currentTier]);

  // Get the currently selected objective
  const currentObjective = useMemo(() => {
    if (!progress.currentObjectiveId) return null;
    return getObjectiveById(progress.currentObjectiveId) ?? null;
  }, [progress.currentObjectiveId]);

  // Get objectives grouped by tier
  const objectivesByTier = useMemo(() => {
    const grouped: Record<number, Objective[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    ALL_OBJECTIVES.forEach(obj => {
      if (obj.tier <= progress.currentTier) {
        grouped[obj.tier].push(obj);
      }
    });
    return grouped;
  }, [progress.currentTier]);

  // Check if an objective is completed
  const isObjectiveCompleted = useCallback((objectiveId: string): boolean => {
    return progress.completedObjectiveIds.includes(objectiveId);
  }, [progress.completedObjectiveIds]);

  // Check if an objective is unlocked (available to attempt)
  const isObjectiveUnlocked = useCallback((objective: Objective): boolean => {
    // First objective of tier 1 is always unlocked
    if (objective.id === 't1_obj1') return true;
    
    // If objective is in current tier, check if previous objective is completed
    if (objective.tier === progress.currentTier) {
      const prevOrder = objective.order - 1;
      const prevObjective = ALL_OBJECTIVES.find(obj => 
        obj.tier === objective.tier && obj.order === prevOrder
      );
      if (!prevObjective) return true; // First in tier
      return progress.completedObjectiveIds.includes(prevObjective.id);
    }
    
    // Objectives from previous tiers are all unlocked
    return objective.tier < progress.currentTier;
  }, [progress.currentTier, progress.completedObjectiveIds]);

  // Select an objective
  const selectObjective = useCallback((objectiveId: string) => {
    const objective = getObjectiveById(objectiveId);
    if (objective && isObjectiveUnlocked(objective)) {
      setProgress(prev => ({ ...prev, currentObjectiveId: objectiveId }));
    }
  }, [isObjectiveUnlocked]);

  // Complete an objective
  const completeObjective = useCallback((objectiveId: string): boolean => {
    const objective = getObjectiveById(objectiveId);
    if (!objective) return false;
    
    if (progress.completedObjectiveIds.includes(objectiveId)) {
      return false; // Already completed
    }

    setProgress(prev => {
      const newCompleted = [...prev.completedObjectiveIds, objectiveId];
      const tierProgress = { ...prev.tierProgress };
      tierProgress[objective.tier] = {
        ...tierProgress[objective.tier],
        completed: tierProgress[objective.tier].completed + 1
      };

      // Check if tier is complete
      let newTier = prev.currentTier;
      let newCurrentObjectiveId = objectiveId;
      
      if (tierProgress[objective.tier].completed >= OBJECTIVES_PER_TIER && objective.tier < 6) {
        newTier = (objective.tier + 1) as ObjectiveTier;
        // Set next objective to first of new tier
        newCurrentObjectiveId = `t${newTier}_obj1`;
      } else {
        // Set next objective to next in current tier
        const nextOrder = objective.order + 1;
        const nextObjective = ALL_OBJECTIVES.find(obj => 
          obj.tier === objective.tier && obj.order === nextOrder
        );
        if (nextObjective) {
          newCurrentObjectiveId = nextObjective.id;
        }
      }

      return {
        ...prev,
        completedObjectiveIds: newCompleted,
        currentTier: newTier,
        currentObjectiveId: newCurrentObjectiveId,
        tierProgress
      };
    });

    return true;
  }, [progress.completedObjectiveIds]);

  // Validate if workbench state matches objective requirements
  const validateObjective = useCallback((
    objective: Objective,
    elements: string[],
    hasRequiredBonds: boolean
  ): ObjectiveValidationResult => {
    // For simple objectives, check element counts
    if (objective.type === 'simple') {
      // Parse target compound to get required elements
      // This is a simplified check - in production, use proper parsing
      const targetId = objective.targetCompound.toLowerCase();
      const hasTarget = elements.some(el => el.toLowerCase() === targetId);
      
      if (hasTarget) {
        return {
          success: true,
          message: `Objective complete! Created ${objective.targetCompound}`,
          completed: true
        };
      }
    }
    
    // For bond objectives, check if bonds are required and present
    if (objective.requiresBonds && !hasRequiredBonds) {
      return {
        success: false,
        message: 'This objective requires specific bonds. Use the Bonds button to create them!',
        completed: false
      };
    }

    // For multistep, check current step
    if (objective.type === 'multistep') {
      const currentStep = objective.steps?.find(step => {
        // Check if step requirements are met
        const stepElements = step.requiredElements;
        return stepElements.every(el => elements.includes(el));
      });
      
      if (currentStep) {
        return {
          success: true,
          message: `Step ${currentStep.stepNumber} complete: ${currentStep.description}`,
          completed: currentStep.stepNumber === (objective.steps?.length || 1)
        };
      }
    }

    return {
      success: false,
      message: 'Objective requirements not met. Check the description and try again!',
      completed: false
    };
  }, []);

  // Reset all progress
  const resetProgress = useCallback(() => {
    setProgress({
      currentTier: 1,
      completedObjectiveIds: [],
      currentObjectiveId: 't1_obj1',
      tierProgress: {
        1: { completed: 0, total: OBJECTIVES_PER_TIER },
        2: { completed: 0, total: OBJECTIVES_PER_TIER },
        3: { completed: 0, total: OBJECTIVES_PER_TIER },
        4: { completed: 0, total: OBJECTIVES_PER_TIER },
        5: { completed: 0, total: OBJECTIVES_PER_TIER },
        6: { completed: 0, total: OBJECTIVES_PER_TIER },
      }
    });
    localStorage.removeItem('reaction-lab-objective-progress');
  }, []);

  // Get progress stats
  const stats = useMemo(() => {
    const totalCompleted = progress.completedObjectiveIds.length;
    const totalAvailable = ALL_OBJECTIVES.filter(obj => obj.tier <= progress.currentTier).length;
    const percentage = totalAvailable > 0 ? (totalCompleted / totalAvailable) * 100 : 0;
    
    return {
      totalCompleted,
      totalAvailable,
      percentage: Math.round(percentage),
      currentTier: progress.currentTier,
      currentObjective: currentObjective
    };
  }, [progress, currentObjective]);

  return {
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
    resetProgress
  };
};

export default useObjectiveSystem;
