import { ArrowLeft, ArrowRight, Bookmark, Check, Circle, Lightbulb } from "lucide-react";
import { useMemo, useState } from "react";
import { IDEA_QUESTIONS, STEP_DEFINITIONS } from "../../data/mockData";
import type { AppState, Project } from "../../types";
import { Avatar, Badge, Button, Surface } from "../../components/ui";

type IdeaExplorationStepProps = {
  readonly state: AppState;
  readonly project: Project;
  readonly onAnswerChange: (questionId: string, answer: string) => void;
  readonly onSaveDraft: () => void;
  readonly onComplete: () => void;
};

export const IdeaExplorationStep = ({
  state,
  project,
  onAnswerChange,
  onSaveDraft,
  onComplete,
}: IdeaExplorationStepProps) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = IDEA_QUESTIONS[questionIndex] ?? IDEA_QUESTIONS[0];
  const answer = state.ideaAnswers[`idea-${questionIndex}`] ?? "";
  const answeredCount = useMemo(
    () => IDEA_QUESTIONS.filter((_, index) => (state.ideaAnswers[`idea-${index}`] ?? "").trim().length > 0).length,
    [state.ideaAnswers],
  );
  const isLastQuestion = questionIndex === IDEA_QUESTIONS.length - 1;
  const currentStep = STEP_DEFINITIONS[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge className="bg-idea/25 text-ink">1단계 · 아이디어 탐색</Badge>
          <h1 className="mt-4 text-3xl font-normal tracking-tight text-ink sm:text-4xl">먼저, 이미 알고 있는 경험에서 시작해요.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">
            빈 문서 대신 질문 하나씩 답하면서 팀이 실제로 공감할 수 있는 문제의 재료를 모아봅니다.
          </p>
        </div>
        <div className="rounded-app-md bg-idea/20 px-4 py-3 text-right">
          <p className="text-[11px] text-ink-soft">답변 진행률</p>
          <p className="mt-1 text-2xl font-medium text-ink">{answeredCount}/5</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)]">
        <Surface tone="elevated" className="p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lightbulb aria-hidden="true" className="h-4 w-4 text-idea" />
              <p className="text-sm font-medium text-ink">질문 {questionIndex + 1}</p>
            </div>
            <span className="text-xs text-muted">{questionIndex + 1} / {IDEA_QUESTIONS.length}</span>
          </div>
          <div className="mt-8">
            <h2 className="max-w-xl text-2xl font-normal leading-9 tracking-tight text-ink">{question}</h2>
            <textarea
              autoFocus
              aria-label={question}
              className="mt-7 min-h-44 w-full resize-y rounded-app-md border border-line bg-surface px-4 py-3 text-sm leading-7 text-ink outline-none placeholder:text-muted focus:border-idea focus:ring-2 focus:ring-idea/20"
              placeholder="정답보다 지금 떠오르는 장면을 적어보세요."
              value={answer}
              onChange={(event) => onAnswerChange(`idea-${questionIndex}`, event.target.value)}
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="ghost"
              icon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />}
              disabled={questionIndex === 0}
              onClick={() => setQuestionIndex((index) => Math.max(0, index - 1))}
            >
              이전 질문
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="secondary" icon={<Bookmark aria-hidden="true" className="h-4 w-4" />} onClick={onSaveDraft}>
                임시 저장
              </Button>
              <Button
                icon={isLastQuestion ? <Check aria-hidden="true" className="h-4 w-4" /> : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
                disabled={!answer.trim()}
                onClick={() => {
                  if (isLastQuestion) onComplete();
                  else setQuestionIndex((index) => Math.min(IDEA_QUESTIONS.length - 1, index + 1));
                }}
              >
                {isLastQuestion ? "아이디어 카드 만들기" : "다음 질문"}
              </Button>
            </div>
          </div>
        </Surface>

        <div className="space-y-4">
          <Surface tone="muted" className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">우리 팀</p>
                <p className="mt-1 text-sm text-ink-soft">각자의 답변 상태를 확인하세요.</p>
              </div>
              <span className="text-xs text-muted">{project.members.length}명</span>
            </div>
            <div className="mt-5 space-y-3">
              {project.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar name={member.nickname} size="sm" online={member.online} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{member.nickname}</p>
                    <p className="text-[11px] text-muted">{member.id === project.members[0]?.id ? "내 답변" : "답변을 작성하고 있어요"}</p>
                  </div>
                  <span className={`h-2 w-2 rounded-full ${member.id === project.members[0]?.id && answeredCount > 0 ? "bg-success" : "bg-line"}`} />
                </div>
              ))}
            </div>
          </Surface>
          <Surface className="p-5">
            <div className="flex items-center gap-2">
              <Circle aria-hidden="true" className="h-3.5 w-3.5 text-idea" />
              <p className="text-sm font-medium text-ink">이번 단계의 결과</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{currentStep.description}</p>
            <div className="mt-4 rounded-app-sm bg-surface-soft px-3 py-2.5 text-xs leading-5 text-ink-soft">
              모든 질문에 답하면 다음 단계에서 팀원의 생각을 비교할 수 있어요.
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};
