export const STEP_IDS = [1, 2, 3, 4, 5, 6] as const;
export type StepId = (typeof STEP_IDS)[number];

export const ISSUE_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const PROJECT_TYPES = [
  "웹 서비스",
  "Android 서비스",
  "해커톤",
  "졸업작품",
  "사이드 프로젝트",
  "창업 아이디어",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const MEMBER_ROLES = [
  "프론트엔드",
  "백엔드",
  "Android",
  "디자인",
  "기획",
  "인프라",
] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export type Comment = {
  readonly id: string;
  readonly authorId: string;
  readonly content: string;
  readonly createdAt: string;
};

export type Member = {
  readonly id: string;
  readonly nickname: string;
  readonly role: MemberRole | undefined;
  readonly avatar: string | undefined;
  readonly online: boolean;
  readonly currentStep: StepId;
};

export type Project = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly initialIdea: string;
  readonly type: ProjectType;
  readonly duration: string;
  readonly progress: number;
  readonly currentStep: StepId;
  readonly members: readonly Member[];
  readonly createdAt: string;
};

export type Opinion = {
  readonly id: string;
  readonly stepId: StepId;
  readonly authorId: string;
  readonly content: string;
  readonly submitted: boolean;
  readonly revealed: boolean;
  readonly votes: number;
  readonly comments: readonly Comment[];
};

export type Decision = {
  readonly id: string;
  readonly stepId: StepId;
  readonly selectedOpinionId: string;
  readonly reason: string;
  readonly decidedAt: string;
};

export type ProjectGoal = {
  readonly goal: string;
  readonly hypothesis: string;
  readonly metric: string;
  readonly outOfScope: string;
  readonly savedAt: string | undefined;
};

export type Feature = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly problem: string;
  readonly userValue: number;
  readonly difficulty: number;
  readonly proposerId: string;
  readonly includedInMvp: boolean;
  readonly assigneeId: string | undefined;
};

export type Issue = {
  readonly id: string;
  readonly featureId: string;
  readonly title: string;
  readonly description: string;
  readonly assigneeId: string | undefined;
  readonly priority: "높음" | "보통" | "낮음";
  readonly status: IssueStatus;
  readonly acceptanceCriteria: readonly string[];
  readonly testCriteria: readonly string[];
};

export type InterviewFeedback = {
  readonly stepId: StepId;
  readonly score: number;
  readonly comment: string;
  readonly startedAt: string;
  readonly completedAt: string;
};

export type Activity = {
  readonly id: string;
  readonly actorId: string;
  readonly message: string;
  readonly createdAt: string;
  readonly stepId: StepId | undefined;
};

export type AnalyticsEvent = {
  readonly id: string;
  readonly type: "page_enter" | "step_started" | "step_completed" | "button_click";
  readonly label: string;
  readonly stepId: StepId | undefined;
  readonly createdAt: string;
};

export type AppState = {
  readonly project: Project | null;
  readonly completedSteps: readonly StepId[];
  readonly ideaAnswers: Readonly<Record<string, string>>;
  readonly opinions: readonly Opinion[];
  readonly decisions: readonly Decision[];
  readonly goal: ProjectGoal;
  readonly features: readonly Feature[];
  readonly issues: readonly Issue[];
  readonly feedback: readonly InterviewFeedback[];
  readonly activities: readonly Activity[];
  readonly analytics: readonly AnalyticsEvent[];
  readonly observerNote: string;
  readonly freeComment: string;
};
