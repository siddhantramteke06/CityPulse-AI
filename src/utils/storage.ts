import { HazardReport, GeneratedPlan } from '../types';
import { INITIAL_HAZARD_REPORTS } from '../data/puneData';

const STORAGE_KEYS = {
  REPORTS: 'citypulse_pune_hazard_reports',
  FAVOURITES: 'citypulse_pune_favourite_place_ids',
  SAVED_PLANS: 'citypulse_pune_saved_itineraries',
  USER_VOTES: 'citypulse_pune_user_votes'
};

export const getStoredReports = (): HazardReport[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_HAZARD_REPORTS));
      return INITIAL_HAZARD_REPORTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage read error, returning initial reports', err);
    return INITIAL_HAZARD_REPORTS;
  }
};

export const saveNewReport = (newReport: HazardReport): HazardReport[] => {
  try {
    const current = getStoredReports();
    const updated = [newReport, ...current];
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save report to localStorage', err);
    return [newReport, ...getStoredReports()];
  }
};

export const toggleVoteReport = (reportId: string): { reports: HazardReport[]; hasVoted: boolean } => {
  try {
    const current = getStoredReports();
    const votesRaw = localStorage.getItem(STORAGE_KEYS.USER_VOTES) || '{}';
    const votes: Record<string, boolean> = JSON.parse(votesRaw);
    const currentlyVoted = !!votes[reportId];

    const updatedVotes = { ...votes, [reportId]: !currentlyVoted };
    localStorage.setItem(STORAGE_KEYS.USER_VOTES, JSON.stringify(updatedVotes));

    const updated = current.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          upvotes: currentlyVoted ? Math.max(0, rep.upvotes - 1) : rep.upvotes + 1,
          userVoted: !currentlyVoted
        };
      }
      return rep;
    });

    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
    return { reports: updated, hasVoted: !currentlyVoted };
  } catch (err) {
    console.error('Error toggling vote', err);
    return { reports: getStoredReports(), hasVoted: false };
  }
};

export const getFavouritePlaceIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
    if (!raw) return ['shaniwar-wada', 'fc-road']; // default initial favourites
    return JSON.parse(raw);
  } catch (err) {
    return ['shaniwar-wada', 'fc-road'];
  }
};

export const toggleFavouritePlaceId = (placeId: string): string[] => {
  try {
    const current = getFavouritePlaceIds();
    const exists = current.includes(placeId);
    const updated = exists ? current.filter(id => id !== placeId) : [...current, placeId];
    localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to update favourite places', err);
    return [];
  }
};

export const getSavedPlans = (): GeneratedPlan[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_PLANS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
};

export const savePlanToStorage = (plan: GeneratedPlan): GeneratedPlan[] => {
  try {
    const current = getSavedPlans();
    // remove if already exists with same id, then prepend
    const filtered = current.filter(p => p.id !== plan.id);
    const updated = [{ ...plan, savedAt: new Date().toISOString() }, ...filtered];
    localStorage.setItem(STORAGE_KEYS.SAVED_PLANS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save plan', err);
    return [plan];
  }
};

export const deleteSavedPlan = (planId: string): GeneratedPlan[] => {
  try {
    const current = getSavedPlans();
    const updated = current.filter(p => p.id !== planId);
    localStorage.setItem(STORAGE_KEYS.SAVED_PLANS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete plan', err);
    return [];
  }
};
