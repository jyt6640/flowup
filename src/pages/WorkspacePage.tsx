import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { STEP_DEFINITIONS, IDEA_QUESTIONS } from "../data/mockData";
import { recordButtonClick, recordStepStarted, recordStepCompleted } from "../lib/analytics";
import { FeedbackModal } from "../components/FeedbackModal";
import { WorkspaceLayout } from "../components/WorkspaceLayout";
import { IdeaExplorationStep } from "../features/ideation/IdeaExplorationStep";
import { ProblemDefinitionStep } from "../features/problem-definition/ProblemDefinitionStep";
import { ProjectGoalStep } from "../features/project-goal/ProjectGoalStep";
import { MvpFeaturesStep, type FeatureDraft } from "../features/mvp-features/MvpFeaturesStep";
import { RoleAssignmentStep } from "../features/role-assignment/RoleAssignmentStep";
import { DevelopmentIssuesStep } from "../features/development-issues/DevelopmentIssuesStep";
import type { AppState, Comment, Feature, Issue, IssueStatus, MemberRole, Opinion, ProjectGoal, StepId } from "../types";
import { STEP_IDS } from "../types";

type WorkspacePageProps = {
  readonly state: AppState;
  readonly setState: Dispatch<SetStateAction<AppState>>;
  readonly onReset: () => void;
};

const assertNever = (value: never): never => {
  throw new Error(`Unexpected step: ${String(value)}`);
};

const parseStepId = (value: string | undefined, fallback: StepId): StepId => {
  const numeric = Number(value);
  return STEP_IDS.find((stepId) => stepId === numeric) ?? fallback;
};

const nextStepAfter = (stepId: StepId): StepId | undefined =>
  STEP_IDS.find((candidate) => candidate > stepId);

export const WorkspacePage = ({ state, setState, onReset }: WorkspacePageProps) => {
  const navigate = useNavigate();
  const { stepId } = useParams();
  const project = state.project;
  const [interviewMode, setInterviewMode] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackStep, setFeedbackStep] = useState<StepId>(project?.currentStep ?? 1);
  const activeStep = parseStepId(stepId, project?.currentStep ?? 1);
  const currentMemberId = project?.members[0]?.id ?? "member-1";
  const currentMemberName = project?.members[0]?.nickname ?? "흑곰";

  useEffect(() => {
    if (!project) return;
    setState((current) => {
      const hasStarted = current.analytics.some(
        (event) => event.type === "step_started" && event.stepId === activeStep,
      );
      return hasStarted ? current : recordStepStarted(current, activeStep);
    });
  }, [activeStep, project, setState]);

  if (!project) return <Navigate to="/create" replace />;

  const completeStep = (completedStep: StepId) => {
    setState((current) => {
      if (!current.project) return current;
      const completedSteps = current.completedSteps.includes(completedStep)
        ? current.completedSteps
        : [...current.completedSteps, completedStep];
      const nextStep = nextStepAfter(completedStep) ?? completedStep;
      return recordStepCompleted(
        {
          ...current,
          completedSteps,
          project: {
            ...current.project,
            currentStep: nextStep,
            progress: Math.round((completedSteps.length / STEP_IDS.length) * 100),
          },
        },
        completedStep,
      );
    });
    setFeedbackStep(completedStep);
    setFeedbackOpen(true);
  };

  const handleSelectStep = (nextStep: StepId) => {
    setState((current) => {
      if (!current.project) return current;
      return recordButtonClick(
        {
          ...current,
          project: { ...current.project, currentStep: nextStep },
        },
        `단계 ${nextStep} 선택`,
        nextStep,
      );
    });
    navigate(`/workspace/${nextStep}`);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setState((current) => ({
      ...current,
      ideaAnswers: { ...current.ideaAnswers, [questionId]: answer },
    }));
  };

  const handleCompleteIdea = () => {
    const content = IDEA_QUESTIONS.map((question, index) => {
      const answer = state.ideaAnswers[`idea-${index}`] ?? "";
      return `${question}\n${answer}`;
    }).join("\n\n");
    const existing = state.opinions.find((opinion) => opinion.stepId === 1 && opinion.authorId === currentMemberId);
    const opinion: Opinion = {
      id: existing?.id ?? `opinion-idea-${Date.now()}`,
      stepId: 1,
      authorId: currentMemberId,
      content,
      submitted: true,
      revealed: true,
      votes: existing?.votes ?? 0,
      comments: existing?.comments ?? [],
    };
    setState((current) => ({
      ...current,
      opinions: existing
        ? current.opinions.map((item) => (item.id === existing.id ? opinion : item))
        : [...current.opinions, opinion],
      activities: [
        {
          id: `activity-${Date.now()}`,
          actorId: currentMemberId,
          message: `${currentMemberName}님이 아이디어 탐색 답변을 카드로 만들었습니다.`,
          createdAt: new Date().toISOString(),
          stepId: 1,
        },
        ...current.activities,
      ],
    }));
    completeStep(1);
  };

  const handleSubmitOpinion = (content: string) => {
    setState((current) => {
      const existing = current.opinions.find((opinion) => opinion.stepId === 2 && opinion.authorId === currentMemberId);
      const opinion: Opinion = {
        id: existing?.id ?? `opinion-problem-${Date.now()}`,
        stepId: 2,
        authorId: currentMemberId,
        content,
        submitted: true,
        revealed: existing?.revealed ?? false,
        votes: existing?.votes ?? 0,
        comments: existing?.comments ?? [],
      };
      return {
        ...current,
        opinions: existing
          ? current.opinions.map((item) => (item.id === existing.id ? opinion : item))
          : [...current.opinions, opinion],
        activities: [
          {
            id: `activity-${Date.now()}`,
            actorId: currentMemberId,
            message: `${currentMemberName}님이 문제 정의 의견을 제출했습니다.`,
            createdAt: new Date().toISOString(),
            stepId: 2,
          },
          ...current.activities,
        ],
      };
    });
  };

  const handleRevealOpinions = () => {
    setState((current) => ({
      ...recordButtonClick(current, "전체 의견 공개", 2),
      opinions: current.opinions.map((opinion) => (opinion.stepId === 2 ? { ...opinion, revealed: true } : opinion)),
      activities: [
        {
          id: `activity-${Date.now()}`,
          actorId: currentMemberId,
          message: `${currentMemberName}님이 모든 의견을 동시에 공개했습니다.`,
          createdAt: new Date().toISOString(),
          stepId: 2,
        },
        ...current.activities,
      ],
    }));
  };

  const handleVote = (opinionId: string) => {
    setState((current) => ({
      ...recordButtonClick(current, "의견 공감", 2),
      opinions: current.opinions.map((opinion) => (opinion.id === opinionId ? { ...opinion, votes: opinion.votes + 1 } : opinion)),
    }));
  };

  const handleComment = (opinionId: string, content: string) => {
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      authorId: currentMemberId,
      content,
      createdAt: new Date().toISOString(),
    };
    setState((current) => ({
      ...current,
      opinions: current.opinions.map((opinion) => (opinion.id === opinionId ? { ...opinion, comments: [...opinion.comments, comment] } : opinion)),
    }));
  };

  const handleFinalizeProblem = (opinionId: string, reason: string) => {
    setState((current) => ({
      ...recordButtonClick(current, "문제 정의 최종안 확정", 2),
      decisions: [
        ...current.decisions.filter((decision) => decision.stepId !== 2),
        { id: `decision-${Date.now()}`, stepId: 2, selectedOpinionId: opinionId, reason, decidedAt: new Date().toISOString() },
      ],
    }));
    completeStep(2);
  };

  const handleGoalChange = (field: keyof ProjectGoal, value: string) => {
    setState((current) => ({ ...current, goal: { ...current.goal, [field]: value } }));
  };

  const handleSaveGoal = () => {
    setState((current) => ({
      ...recordButtonClick(current, "프로젝트 목표 저장", 3),
      goal: { ...current.goal, savedAt: new Date().toISOString() },
    }));
  };

  const handleAddFeature = (draft: FeatureDraft) => {
    const feature: Feature = {
      id: `feature-${Date.now()}`,
      ...draft,
      proposerId: currentMemberId,
      includedInMvp: false,
      assigneeId: undefined,
    };
    setState((current) => ({
      ...recordButtonClick(current, "새 MVP 기능 추가", 4),
      features: [...current.features, feature],
    }));
  };

  const handleUpdateFeature = (featureId: string, patch: Partial<Feature>) => {
    setState((current) => ({
      ...current,
      features: current.features.map((feature) => (feature.id === featureId ? { ...feature, ...patch } : feature)),
    }));
  };

  const handleDeleteFeature = (featureId: string) => {
    setState((current) => ({
      ...recordButtonClick(current, "MVP 기능 삭제", 4),
      features: current.features.filter((feature) => feature.id !== featureId),
      issues: current.issues.filter((issue) => issue.featureId !== featureId),
    }));
  };

  const handleToggleFeature = (featureId: string) => {
    setState((current) => ({
      ...recordButtonClick(current, "MVP 포함 여부 변경", 4),
      features: current.features.map((feature) => (feature.id === featureId ? { ...feature, includedInMvp: !feature.includedInMvp } : feature)),
    }));
  };

  const handleMoveFeature = (featureId: string, userValue: number, difficulty: number) => {
    setState((current) => ({
      ...current,
      features: current.features.map((feature) => (feature.id === featureId ? { ...feature, userValue, difficulty } : feature)),
    }));
  };

  const handleRoleChange = (memberId: string, role: MemberRole) => {
    setState((current) => {
      if (!current.project) return current;
      return {
        ...recordButtonClick(current, "팀원 역할 변경", 5),
        project: { ...current.project, members: current.project.members.map((member) => (member.id === memberId ? { ...member, role } : member)) },
      };
    });
  };

  const handleAssigneeChange = (featureId: string, memberId: string) => {
    setState((current) => ({
      ...recordButtonClick(current, "MVP 기능 담당자 배정", 5),
      features: current.features.map((feature) => (feature.id === featureId ? { ...feature, assigneeId: memberId } : feature)),
    }));
  };

  const handleCreateIssues = () => {
    setState((current) => {
      const createdIssues: readonly Issue[] = current.features
        .filter((feature) => feature.includedInMvp && !current.issues.some((issue) => issue.featureId === feature.id))
        .map((feature) => ({
          id: `issue-${feature.id}-${Date.now()}`,
          featureId: feature.id,
          title: `${feature.title} 기능 구현`,
          description: feature.description,
          assigneeId: feature.assigneeId,
          priority: feature.userValue >= 5 ? "높음" : "보통",
          status: "TODO",
          acceptanceCriteria: [
            `${feature.title}을(를) 사용자가 실행할 수 있다.`,
            `${feature.title}의 결과가 다음 단계에 반영된다.`,
            "새로고침 후에도 결과가 유지된다.",
          ],
          testCriteria: [`${feature.title}의 기본 흐름을 직접 실행한다.`, "완료 조건을 모두 확인한다."],
        }));
      return {
        ...recordButtonClick(current, "선정된 기능으로 이슈 생성", 6),
        issues: [...current.issues, ...createdIssues],
      };
    });
  };

  const handleStatusChange = (issueId: string, status: IssueStatus) => {
    setState((current) => ({
      ...recordButtonClick(current, "개발 이슈 상태 변경", 6),
      issues: current.issues.map((issue) => (issue.id === issueId ? { ...issue, status } : issue)),
    }));
  };

  const handleObserverNoteChange = (note: string) => {
    setState((current) => ({ ...current, observerNote: note }));
  };

  const saveFeedback = (score: number, comment: string) => {
    const completedAt = new Date().toISOString();
    setState((current) => {
      const started = current.analytics.find((event) => event.type === "step_started" && event.stepId === feedbackStep);
      return {
        ...current,
        freeComment: comment,
        feedback: [
          ...current.feedback.filter((item) => item.stepId !== feedbackStep),
          {
            stepId: feedbackStep,
            score,
            comment,
            startedAt: started?.createdAt ?? completedAt,
            completedAt,
          },
        ],
      };
    });
    setFeedbackOpen(false);
    const nextStep = nextStepAfter(feedbackStep);
    if (nextStep) navigate(`/workspace/${nextStep}`);
    else navigate("/interview-results");
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <IdeaExplorationStep state={state} project={project} onAnswerChange={handleAnswerChange} onSaveDraft={() => setState((current) => recordButtonClick(current, "아이디어 답변 임시 저장", 1))} onComplete={handleCompleteIdea} />;
      case 2:
        return <ProblemDefinitionStep state={state} project={project} currentMemberId={currentMemberId} onSubmitOpinion={handleSubmitOpinion} onReveal={handleRevealOpinions} onVote={handleVote} onComment={handleComment} onFinalize={handleFinalizeProblem} />;
      case 3:
        return <ProjectGoalStep state={state} confirmedProblem={state.opinions.find((opinion) => opinion.id === state.decisions.find((decision) => decision.stepId === 2)?.selectedOpinionId)?.content ?? ""} onChange={handleGoalChange} onSave={handleSaveGoal} onComplete={() => { handleSaveGoal(); completeStep(3); }} />;
      case 4:
        return <MvpFeaturesStep state={state} project={project} currentMemberId={currentMemberId} onAddFeature={handleAddFeature} onUpdateFeature={handleUpdateFeature} onDeleteFeature={handleDeleteFeature} onToggleFeature={handleToggleFeature} onMoveFeature={handleMoveFeature} onComplete={() => completeStep(4)} />;
      case 5:
        return <RoleAssignmentStep state={state} project={project} onRoleChange={handleRoleChange} onAssigneeChange={handleAssigneeChange} onComplete={() => completeStep(5)} />;
      case 6:
        return <DevelopmentIssuesStep state={state} project={project} onCreateIssues={handleCreateIssues} onStatusChange={handleStatusChange} onComplete={() => completeStep(6)} />;
      default:
        return assertNever(activeStep);
    }
  };

  return (
    <>
      <WorkspaceLayout
        state={state}
        project={project}
        activeStep={activeStep}
        interviewMode={interviewMode}
        onObserverNoteChange={handleObserverNoteChange}
        onSelectStep={handleSelectStep}
        onToggleInterview={() => setInterviewMode((mode) => !mode)}
        onReset={onReset}
        onRequestFeedback={() => {
          setFeedbackStep(activeStep);
          setFeedbackOpen(true);
        }}
        onOpenResults={() => navigate("/interview-results")}
      >
        {renderStep()}
      </WorkspaceLayout>
      <FeedbackModal open={feedbackOpen} stepId={feedbackStep} onClose={() => setFeedbackOpen(false)} onSave={saveFeedback} />
    </>
  );
};
