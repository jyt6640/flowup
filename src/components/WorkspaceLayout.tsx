import { ChevronDown, LogOut, MessageSquareText, PanelRight, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { AppState, Project, StepId } from "../types";
import { STEP_DEFINITIONS } from "../data/mockData";
import { Logo } from "./Logo";
import { StepSidebar } from "./StepSidebar";
import { TeamPanel } from "./TeamPanel";
import { Avatar, Badge, Button } from "./ui";

type WorkspaceLayoutProps = {
  readonly state: AppState;
  readonly project: Project;
  readonly activeStep: StepId;
  readonly interviewMode: boolean;
  readonly onObserverNoteChange: (note: string) => void;
  readonly onSelectStep: (stepId: StepId) => void;
  readonly onToggleInterview: () => void;
  readonly onReset: () => void;
  readonly onRequestFeedback: () => void;
  readonly onOpenResults: () => void;
  readonly children: ReactNode;
};

const avatarTones = ["bg-problem", "bg-goal", "bg-mvp", "bg-roles"] as const;

export const WorkspaceLayout = ({
  state,
  project,
  activeStep,
  interviewMode,
  onObserverNoteChange,
  onSelectStep,
  onToggleInterview,
  onReset,
  onRequestFeedback,
  onOpenResults,
  children,
}: WorkspaceLayoutProps) => {
  const [mobileRailOpen, setMobileRailOpen] = useState(false);
  const currentStep = STEP_DEFINITIONS.find((step) => step.id === activeStep) ?? STEP_DEFINITIONS[0];

  return (
    <div className="grid min-h-[100dvh] grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-canvas">
      <header className="relative z-20 border-b border-line-soft bg-surface/90 backdrop-blur">
        <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Logo compact />
            <span className="h-6 w-px bg-line" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-ink">{project.name}</p>
                <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted" />
              </div>
              <p className="mt-0.5 truncate text-[11px] text-muted">{project.type} · {project.duration}</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Badge tone="info">{project.progress}% 진행</Badge>
            <div className="flex -space-x-2">
              {project.members.map((member, index) => (
                <Avatar key={member.id} name={member.nickname} size="sm" tone={avatarTones[index % avatarTones.length] ?? "bg-surface-soft"} online={member.online} />
              ))}
            </div>
            <Button
              variant={interviewMode ? "primary" : "secondary"}
              className="min-h-9 px-3 text-xs"
              icon={<MessageSquareText aria-hidden="true" className="h-3.5 w-3.5" />}
              onClick={onToggleInterview}
            >
              인터뷰 모드
            </Button>
            <button
              type="button"
              aria-label="프로젝트 초기화"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-soft hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info/50"
              title="프로젝트 초기화"
              onClick={onReset}
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            aria-label="컨텍스트 패널 열기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-elevated text-ink-soft md:hidden"
            onClick={() => setMobileRailOpen((open) => !open)}
          >
            <PanelRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line-soft px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-problem" />
            <span className="text-xs font-medium text-ink">{currentStep.title}</span>
            <Badge tone="info">{project.progress}%</Badge>
          </div>
          <button type="button" className="text-xs font-medium text-ink-soft" onClick={onToggleInterview}>
            {interviewMode ? "인터뷰 닫기" : "인터뷰 모드"}
          </button>
        </div>
      </header>
      <div className="grid min-h-0 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
        <div className="hidden min-h-0 overflow-y-auto border-r border-line-soft bg-surface-soft/55 lg:block">
          <StepSidebar activeStep={activeStep} completedSteps={state.completedSteps} onSelectStep={onSelectStep} />
        </div>
        <main className="scrollbar-subtle min-h-0 overflow-y-auto bg-canvas">
          <div className="mx-auto w-full max-w-[920px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</div>
        </main>
        <div className={`${mobileRailOpen ? "block" : "hidden"} border-l border-line-soft bg-surface-soft/55 lg:block lg:min-h-0 lg:overflow-y-auto`}>
          <TeamPanel
            state={state}
            project={project}
            activeStep={activeStep}
            interviewMode={interviewMode}
            onObserverNoteChange={onObserverNoteChange}
            onRequestFeedback={onRequestFeedback}
            onOpenResults={onOpenResults}
          />
        </div>
      </div>
      <div className="fixed bottom-4 left-4 z-30 lg:hidden">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-pill border border-line bg-elevated px-3 py-2 text-xs font-medium text-ink-soft shadow-soft"
        >
          <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
          홈으로
        </Link>
      </div>
    </div>
  );
};
