import type {
  Activity,
  AppState,
  Feature,
  Issue,
  Member,
  Opinion,
  Project,
  StepId,
} from "../types";

export const STEP_DEFINITIONS = [
  {
    id: 1,
    title: "아이디어 탐색",
    shortTitle: "아이디어",
    description: "팀이 이미 알고 있는 경험에서 출발합니다.",
    colorClass: "idea",
  },
  {
    id: 2,
    title: "문제 정의",
    shortTitle: "문제",
    description: "누구의 어떤 문제를 풀지 한 문장으로 좁힙니다.",
    colorClass: "problem",
  },
  {
    id: 3,
    title: "프로젝트 목표",
    shortTitle: "목표",
    description: "성공을 판단할 기준과 하지 않을 일을 정합니다.",
    colorClass: "goal",
  },
  {
    id: 4,
    title: "MVP 기능 선정",
    shortTitle: "MVP",
    description: "가치와 난이도를 비교해 첫 버전을 고릅니다.",
    colorClass: "mvp",
  },
  {
    id: 5,
    title: "역할 분담",
    shortTitle: "역할",
    description: "기능을 실제로 움직일 사람을 연결합니다.",
    colorClass: "roles",
  },
  {
    id: 6,
    title: "개발 이슈",
    shortTitle: "이슈",
    description: "합의한 기능을 바로 실행할 작업으로 바꿉니다.",
    colorClass: "issues",
  },
] as const;

export const LOCKED_STEPS = [
  "사용자 흐름도",
  "와이어프레임",
  "시스템 아키텍처",
  "ERD",
  "API 명세",
  "칸반 보드",
  "PR 및 코드 리뷰",
  "테스트 기록",
  "배포 문서",
  "README",
  "발표 자료",
  "사용자 피드백",
  "팀 회고",
] as const;

export const IDEA_QUESTIONS = [
  "최근 반복해서 찾아보거나 시간을 쓴 것은 무엇인가요?",
  "직접 해결하고 싶었던 문제는 무엇인가요?",
  "주변 사람도 비슷한 행동을 하나요?",
  "이번 프로젝트를 통해 배우고 싶은 것은 무엇인가요?",
  "팀이 실제로 접근할 수 있는 사용자는 누구인가요?",
] as const;

export const PROBLEM_QUESTIONS = [
  "우리가 해결하려는 문제는 무엇인가요?",
  "누가 이 문제를 겪나요?",
  "언제 가장 강하게 발생하나요?",
  "현재는 어떻게 해결하고 있나요?",
  "해결하지 않으면 어떤 손실이 발생하나요?",
] as const;

export const GOAL_FIELDS = [
  { key: "goal", label: "프로젝트 목표", placeholder: "사용자가 프로젝트 시작 전에 겪는 막막함을 줄입니다." },
  { key: "hypothesis", label: "핵심 가설", placeholder: "단계별 질문과 동시 공개가 팀의 합의를 빠르게 만들 것입니다." },
  { key: "metric", label: "성공 지표", placeholder: "첫 회의 안에 문제 정의와 MVP 기능 3개를 확정한 팀의 비율" },
  { key: "outOfScope", label: "이번 MVP에서 하지 않을 것", placeholder: "실제 채팅, 자동 문서 생성, 외부 서비스 연동" },
] as const;

const DEFAULT_MEMBER_NAMES = ["흑곰", "코브", "캐모", "모닝빵"] as const;

const makeMembers = (currentStep: StepId = 1): readonly Member[] =>
  DEFAULT_MEMBER_NAMES.map((nickname, index) => ({
    id: `member-${index + 1}`,
    nickname,
    role: undefined,
    avatar: undefined,
    online: index !== 3,
    currentStep: index === 0 ? currentStep : 1,
  }));

const makeProject = (
  overrides: Pick<Project, "name" | "description" | "initialIdea" | "type" | "duration">,
): Project => ({
  id: `project-${Date.now()}`,
  ...overrides,
  progress: 0,
  currentStep: 1,
  members: makeMembers(1),
  createdAt: new Date().toISOString(),
});

const makeSampleOpinions = (): readonly Opinion[] => [
  {
    id: "opinion-sample-1",
    stepId: 2,
    authorId: "member-2",
    content:
      "처음 팀 프로젝트를 시작할 때 각자의 생각이 흩어져서, 무엇부터 합의해야 할지 몰라 회의가 길어집니다.",
    submitted: true,
    revealed: false,
    votes: 3,
    comments: [
      {
        id: "comment-sample-1",
        authorId: "member-3",
        content: "회의가 길어지는 지점이 가장 공감돼요.",
        createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
      },
    ],
  },
  {
    id: "opinion-sample-2",
    stepId: 2,
    authorId: "member-3",
    content:
      "하고 싶은 기능은 많은데 우선순위를 정하는 기준이 없어, 결국 구현 가능한 작은 목표로 내려오지 못합니다.",
    submitted: true,
    revealed: false,
    votes: 2,
    comments: [],
  },
  {
    id: "opinion-sample-3",
    stepId: 2,
    authorId: "member-4",
    content:
      "말을 잘하는 사람의 의견이 초반 방향을 결정하는 경우가 많아서, 조용한 팀원의 생각도 안전하게 꺼낼 장치가 필요합니다.",
    submitted: true,
    revealed: false,
    votes: 1,
    comments: [],
  },
];

const makeSampleFeatures = (): readonly Feature[] => [
  {
    id: "feature-questions",
    title: "단계별 질문",
    description: "빈 화면 대신 지금 생각할 질문 하나를 보여줍니다.",
    problem: "프로젝트 시작점이 막막합니다.",
    userValue: 5,
    difficulty: 2,
    proposerId: "member-1",
    includedInMvp: true,
    assigneeId: "member-1",
  },
  {
    id: "feature-writing",
    title: "개인 의견 작성",
    description: "다른 사람의 말에 영향받기 전에 각자 답을 남깁니다.",
    problem: "회의에서 말이 빠른 사람만 먼저 결정합니다.",
    userValue: 5,
    difficulty: 3,
    proposerId: "member-2",
    includedInMvp: true,
    assigneeId: "member-2",
  },
  {
    id: "feature-reveal",
    title: "의견 동시 공개",
    description: "모두가 제출한 뒤 한 번에 카드를 열어 비교합니다.",
    problem: "팀원의 생각을 안전하게 비교하기 어렵습니다.",
    userValue: 5,
    difficulty: 3,
    proposerId: "member-3",
    includedInMvp: true,
    assigneeId: "member-1",
  },
  {
    id: "feature-vote",
    title: "익명 투표",
    description: "공감하는 방향에 가볍게 표를 보내 최종안을 좁힙니다.",
    problem: "합의가 감정이나 목소리 크기에 흔들립니다.",
    userValue: 4,
    difficulty: 2,
    proposerId: "member-4",
    includedInMvp: true,
    assigneeId: "member-3",
  },
  {
    id: "feature-decision",
    title: "최종안 확정",
    description: "선택 이유와 함께 다음 단계의 기준으로 고정합니다.",
    problem: "회의가 끝나도 결정이 다시 바뀝니다.",
    userValue: 4,
    difficulty: 2,
    proposerId: "member-1",
    includedInMvp: true,
    assigneeId: "member-2",
  },
];

const makeSampleIssues = (): readonly Issue[] => [
  {
    id: "issue-reveal",
    featureId: "feature-reveal",
    title: "팀원 의견 동시 공개 기능 구현",
    description: "모든 팀원이 제출을 마친 뒤 의견 카드를 함께 공개합니다.",
    assigneeId: "member-1",
    priority: "높음",
    status: "IN_PROGRESS",
    acceptanceCriteria: [
      "모든 팀원이 의견을 제출할 수 있다.",
      "공개 전에는 다른 팀원의 내용을 볼 수 없다.",
      "진행자가 공개하면 전체 의견이 동시에 표시된다.",
      "공개 이후에는 의견에 투표할 수 있다.",
    ],
    testCriteria: ["제출 전 비공개 상태를 확인한다.", "공개 버튼 이후 모든 카드가 나타나는지 확인한다."],
  },
  {
    id: "issue-vote",
    featureId: "feature-vote",
    title: "익명 투표 결과 집계",
    description: "공개된 의견에 투표하고 가장 많이 선택된 방향을 보여줍니다.",
    assigneeId: "member-3",
    priority: "보통",
    status: "TODO",
    acceptanceCriteria: ["한 의견에 표를 보낼 수 있다.", "표 수가 카드에 반영된다."],
    testCriteria: ["투표 후 새로고침해도 결과가 유지되는지 확인한다."],
  },
];

const makeSampleActivities = (): readonly Activity[] => [
  {
    id: "activity-1",
    actorId: "member-2",
    message: "코브님이 기능 카드에 의견을 남겼습니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    stepId: 4,
  },
  {
    id: "activity-2",
    actorId: "member-3",
    message: "캐모님이 익명 투표를 완료했습니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    stepId: 2,
  },
  {
    id: "activity-3",
    actorId: "member-4",
    message: "모닝빵님이 문제 정의서를 수정했습니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 41).toISOString(),
    stepId: 2,
  },
];

export const createEmptyState = (): AppState => ({
  project: null,
  completedSteps: [],
  ideaAnswers: {},
  opinions: [],
  decisions: [],
  goal: {
    goal: "",
    hypothesis: "",
    metric: "",
    outOfScope: "",
    savedAt: undefined,
  },
  features: [],
  issues: [],
  feedback: [],
  activities: [],
  analytics: [],
  observerNote: "",
  freeComment: "",
});

export const createProjectState = (
  overrides: Pick<Project, "name" | "description" | "initialIdea" | "type" | "duration">,
): AppState => ({
  ...createEmptyState(),
  project: makeProject(overrides),
  completedSteps: [],
  opinions: makeSampleOpinions(),
  features: makeSampleFeatures(),
  issues: makeSampleIssues(),
  activities: makeSampleActivities(),
});

export const createDemoState = (): AppState => {
  const state = createProjectState({
    name: "팀 프로젝트의 첫 단추",
    description: "아이디어를 빠르게 문제와 실행으로 연결하는 팀 협업 실험",
    initialIdea: "팀이 프로젝트 시작 전에 무엇을 먼저 합의해야 하는지 함께 정리하고 싶어요.",
    type: "사이드 프로젝트",
    duration: "4주",
  });
  return {
    ...state,
    project: state.project
      ? {
          ...state.project,
          progress: 42,
          currentStep: 2,
          members: state.project.members.map((member, index) => ({
            ...member,
            currentStep: index === 0 ? 2 : 1,
          })),
        }
      : null,
  };
};
