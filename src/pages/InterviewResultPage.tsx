import { ArrowLeft, ArrowRight, Clock3, MessageSquareText, RotateCcw, Star, TrendingDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { STEP_DEFINITIONS } from "../data/mockData";
import { getStepDurationMinutes } from "../lib/analytics";
import type { AppState, Project } from "../types";
import { Badge, Button, EmptyState, Surface } from "../components/ui";

type InterviewResultPageProps = {
  readonly state: AppState;
  readonly project: Project | null;
};

export const InterviewResultPage = ({ state, project }: InterviewResultPageProps) => {
  const navigate = useNavigate();
  const feedbackCount = state.feedback.length;
  const averageScore = feedbackCount === 0 ? 0 : (state.feedback.reduce((total, item) => total + item.score, 0) / feedbackCount).toFixed(1);
  const durations = STEP_DEFINITIONS.map((step) => ({ step, minutes: getStepDurationMinutes(state, step.id) }));
  const longest = durations.reduce((current, item) => (item.minutes > current.minutes ? item : current), durations[0] ?? { step: STEP_DEFINITIONS[0], minutes: 0 });
  const clickCounts = STEP_DEFINITIONS.map((step) => ({
    step,
    count: state.analytics.filter((event) => event.type === "button_click" && event.stepId === step.id).length,
  })).sort((left, right) => right.count - left.count);

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <header className="flex items-center justify-between border-b border-line-soft bg-surface/80 px-5 py-5 backdrop-blur sm:px-8 lg:px-10">
        <button type="button" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink" onClick={() => navigate(project ? `/workspace/${project.currentStep}` : "/")}>
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {project ? "워크스페이스로" : "홈으로"}
        </button>
        <Link to="/" className="text-sm font-medium text-ink">FlowUp</Link>
      </header>
      <main className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Badge tone="info">Interview results</Badge>
            <h1 className="mt-4 text-4xl font-normal tracking-tight text-ink sm:text-6xl">인터뷰 결과 보기</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-ink-soft">한 명의 사용자가 FlowUp을 지나간 기록입니다. 어떤 단계에서 머물렀는지와 어떤 말을 남겼는지 확인하세요.</p>
          </div>
          {project && <Button icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />} onClick={() => navigate(`/workspace/${project.currentStep}`)}>워크스페이스 열기</Button>}
        </div>

        {feedbackCount === 0 ? (
          <div className="mt-12">
            <EmptyState title="아직 저장된 피드백이 없습니다." description="워크스페이스에서 단계를 완료하거나 오른쪽 패널의 피드백 버튼으로 첫 기록을 남겨보세요." action={<Button onClick={() => navigate(project ? `/workspace/${project.currentStep}` : "/create")}>{project ? "워크스페이스에서 남기기" : "프로젝트 만들기"}</Button>} />
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <Surface tone="elevated" className="p-5">
                <div className="flex items-center justify-between"><p className="text-xs text-muted">평균 만족도</p><Star aria-hidden="true" className="h-4 w-4 text-warning" /></div>
                <p className="mt-5 text-4xl font-normal text-ink">{averageScore}<span className="ml-1 text-base text-muted">/5</span></p>
              </Surface>
              <Surface tone="elevated" className="p-5">
                <div className="flex items-center justify-between"><p className="text-xs text-muted">가장 오래 걸린 단계</p><Clock3 aria-hidden="true" className="h-4 w-4 text-info" /></div>
                <p className="mt-5 text-xl font-medium text-ink">{longest.step.title}</p>
                <p className="mt-1 text-xs text-muted">{longest.minutes > 0 ? `${longest.minutes}분 기록됨` : "시간 기록 없음"}</p>
              </Surface>
              <Surface tone="elevated" className="p-5">
                <div className="flex items-center justify-between"><p className="text-xs text-muted">많이 되돌아간 단계</p><TrendingDown aria-hidden="true" className="h-4 w-4 text-problem" /></div>
                <p className="mt-5 text-xl font-medium text-ink">{clickCounts[0]?.step.title ?? "기록 없음"}</p>
                <p className="mt-1 text-xs text-muted">{clickCounts[0]?.count ?? 0}회 주요 클릭</p>
              </Surface>
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
              <Surface className="p-5 sm:p-7">
                <div className="flex items-center gap-2"><MessageSquareText aria-hidden="true" className="h-4 w-4 text-info" /><h2 className="text-lg font-medium text-ink">단계별 만족도</h2></div>
                <div className="mt-6 space-y-4">
                  {STEP_DEFINITIONS.map((step) => {
                    const item = state.feedback.find((feedback) => feedback.stepId === step.id);
                    return (
                      <div key={step.id} className="flex items-center gap-4">
                        <span className="w-28 shrink-0 text-xs font-medium text-ink">{step.title}</span>
                        <div className="h-2 flex-1 rounded-pill bg-surface-soft"><div className="h-full rounded-pill bg-info transition-all" style={{ width: `${((item?.score ?? 0) / 5) * 100}%` }} /></div>
                        <span className="w-8 text-right text-xs font-medium text-ink">{item?.score ?? "-"}</span>
                      </div>
                    );
                  })}
                </div>
              </Surface>
              <Surface tone="muted" className="p-5 sm:p-7">
                <div className="flex items-center gap-2"><RotateCcw aria-hidden="true" className="h-4 w-4 text-problem" /><h2 className="text-lg font-medium text-ink">자유 의견</h2></div>
                <div className="mt-5 space-y-3">
                  {state.feedback.filter((feedback) => feedback.comment).map((feedback) => (
                    <div key={`${feedback.stepId}-${feedback.completedAt}`} className="rounded-app-sm border border-line-soft bg-elevated p-4">
                      <p className="text-xs font-medium text-ink">{STEP_DEFINITIONS.find((step) => step.id === feedback.stepId)?.title}</p>
                      <p className="mt-2 text-sm leading-6 text-ink-soft">{feedback.comment}</p>
                    </div>
                  ))}
                  {!state.feedback.some((feedback) => feedback.comment) && <p className="text-sm leading-6 text-muted">남겨진 자유 의견이 없습니다.</p>}
                </div>
              </Surface>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
