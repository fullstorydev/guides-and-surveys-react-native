import { create } from 'zustand';
import { THEME_DEFAULT } from '../constants';
import type { ActiveExperience, Theme } from '../types';

/**
 * Orchestrator Store - Manages which experience is currently active
 * Handles shared state that applies to all experience types (theme, selfClosed)
 */
interface ActiveExperienceStoreState {
  activeExperience: ActiveExperience;

  // Shared UI state (applies to all types)
  theme: Theme;
  selfClosed: boolean;

  // Orchestration actions
  setActiveExperience: (experience: ActiveExperience) => void;
  setSelfClosed: (closed: boolean) => void;
}

export const useActiveExperienceStore = create<ActiveExperienceStoreState>(
  (set) => ({
    activeExperience: null,
    theme: THEME_DEFAULT,
    selfClosed: false,

    setActiveExperience: (experience) => {
      set({
        activeExperience: experience,
        theme: THEME_DEFAULT,
        selfClosed: false,
      });
    },

    setSelfClosed: (closed) => set({ selfClosed: closed }),
  })
);
