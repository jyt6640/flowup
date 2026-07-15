import type { AppState } from "../types";

const STORAGE_KEY = "flowup:app-state:v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isAppState = (value: unknown): value is AppState => {
  if (!isRecord(value)) return false;
  return (
    "project" in value &&
    "ideaAnswers" in value &&
    "opinions" in value &&
    "decisions" in value &&
    "goal" in value &&
    "features" in value &&
    "issues" in value &&
    "feedback" in value &&
    "activities" in value &&
    "analytics" in value
  );
};

export const loadAppState = (): AppState | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isAppState(parsed) ? parsed : null;
  } catch (error) {
    if (error instanceof SyntaxError) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    throw error;
  }
};

export const saveAppState = (state: AppState): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clearAppState = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
};
