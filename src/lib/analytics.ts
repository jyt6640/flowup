import type { AnalyticsEvent, AppState, StepId } from "../types";

const createEvent = (
  type: AnalyticsEvent["type"],
  label: string,
  stepId: StepId | undefined,
): AnalyticsEvent => ({
  id: `event-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  type,
  label,
  stepId,
  createdAt: new Date().toISOString(),
});

export const recordEvent = (
  state: AppState,
  type: AnalyticsEvent["type"],
  label: string,
  stepId: StepId | undefined = undefined,
): AppState => ({
  ...state,
  analytics: [...state.analytics, createEvent(type, label, stepId)].slice(-200),
});

export const recordPageEntry = (state: AppState, label: string): AppState =>
  recordEvent(state, "page_enter", label);

export const recordButtonClick = (state: AppState, label: string, stepId?: StepId): AppState =>
  recordEvent(state, "button_click", label, stepId);

export const recordStepStarted = (state: AppState, stepId: StepId): AppState =>
  recordEvent(state, "step_started", `단계 ${stepId} 시작`, stepId);

export const recordStepCompleted = (state: AppState, stepId: StepId): AppState =>
  recordEvent(state, "step_completed", `단계 ${stepId} 완료`, stepId);

export const formatRelativeTime = (iso: string): string => {
  const elapsedMinutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (elapsedMinutes < 1) return "방금 전";
  if (elapsedMinutes < 60) return `${elapsedMinutes}분 전`;
  const elapsedHours = Math.round(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}시간 전`;
  return `${Math.round(elapsedHours / 24)}일 전`;
};

export const getStepDurationMinutes = (state: AppState, stepId: StepId): number => {
  const starts = state.analytics
    .filter((event) => event.stepId === stepId && event.type === "step_started")
    .map((event) => new Date(event.createdAt).getTime());
  const completed = state.analytics
    .filter((event) => event.stepId === stepId && event.type === "step_completed")
    .map((event) => new Date(event.createdAt).getTime());
  const start = starts[0];
  const end = completed[completed.length - 1];
  if (start === undefined || end === undefined || end < start) return 0;
  return Math.max(1, Math.round((end - start) / 60000));
};
