import { Check, Eye, LockKeyhole, MessageCircle, Send, Users, Vote } from "lucide-react";
import { useMemo, useState } from "react";
import { PROBLEM_QUESTIONS } from "../../data/mockData";
import type { AppState, Member, Opinion, Project } from "../../types";
import { OpinionCard } from "../../components/OpinionCard";
import { VotePanel } from "../../components/VotePanel";
import { Badge, Button, Surface } from "../../components/ui";

type ProblemDefinitionStepProps = {
  readonly state: AppState;
  readonly project: Project;
  readonly currentMemberId: string;
  readonly onSubmitOpinion: (content: string) => void;
  readonly onReveal: () => void;
  readonly onVote: (opinionId: string) => void;
  readonly onComment: (opinionId: string, content: string) => void;
  readonly onFinalize: (opinionId: string, reason: string) => void;
};

export const ProblemDefinitionStep = ({
  state,
  project,
  currentMemberId,
  onSubmitOpinion,
  onReveal,
  onVote,
  onComment,
  onFinalize,
}: ProblemDefinitionStepProps) => {
  const ownOpinion = state.opinions.find((opinion) => opinion.stepId === 2 && opinion.authorId === currentMemberId);
  const opinions = state.opinions.filter((opinion) => opinion.stepId === 2);
  const revealed = opinions.some((opinion) => opinion.revealed);
  const allSubmitted = opinions.filter((opinion) => opinion.submitted).length >= Math.min(4, project.members.length);
  const decision = state.decisions.find((item) => item.stepId === 2);
  const [draft, setDraft] = useState(ownOpinion?.content ?? "");
  const [selectedOpinionId, setSelectedOpinionId] = useState<string | undefined>(decision?.selectedOpinionId);
  const [reason, setReason] = useState(decision?.reason ?? "");
  const visibleOpinions = useMemo(() => opinions.filter((opinion) => opinion.revealed || opinion.authorId === currentMemberId), [currentMemberId, opinions]);

  const getAuthor = (opinion: Opinion): Member | undefined => project.members.find((member) => member.id === opinion.authorId);

  return (
    <div className="space-y-6">
      <div>
        <Badge className="bg-problem/25 text-ink">2단계 · 문제 정의</Badge>
        <h1 className="mt-4 text-3xl font-normal tracking-tight text-ink sm:text-4xl">각자의 답을 먼저 쓰고, 함께 열어볼게요.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">
          다른 사람의 답을 보기 전에 각자 문제를 적습니다. 제출이 끝나면 한 번에 공개하고, 투표로 다음 단계의 기준을 정합니다.
        </p>
      </div>

      {!ownOpinion?.submitted && (
        <Surface tone="elevated" className="p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <LockKeyhole aria-hidden="true" className="h-4 w-4 text-problem" />
                <p className="text-sm font-medium text-ink">내 의견 작성</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-ink-soft">아래 질문을 참고해 우리 팀이 해결할 문제를 한 번에 적어보세요.</p>
            </div>
            <Badge tone="info">작성 전에는 비공개</Badge>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {PROBLEM_QUESTIONS.map((question) => (
              <div key={question} className="rounded-app-sm bg-surface-soft px-3 py-2.5 text-xs leading-5 text-ink-soft">
                {question}
              </div>
            ))}
          </div>
          <textarea
            className="mt-5 min-h-40 w-full resize-y rounded-app-md border border-line bg-surface px-4 py-3 text-sm leading-7 text-ink outline-none placeholder:text-muted focus:border-problem focus:ring-2 focus:ring-problem/20"
            placeholder="예: 처음 프로젝트를 시작하는 팀은 합의해야 할 순서를 몰라 회의가 길어지고, 조용한 팀원의 생각이 묻힙니다."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <Button icon={<Send aria-hidden="true" className="h-4 w-4" />} disabled={!draft.trim()} onClick={() => onSubmitOpinion(draft.trim())}>
              제출 완료
            </Button>
          </div>
        </Surface>
      )}

      {ownOpinion?.submitted && !revealed && (
        <Surface tone="muted" className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
                <Check aria-hidden="true" className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">내 의견을 제출했어요.</p>
                <p className="mt-1 text-xs text-ink-soft">{allSubmitted ? "모든 팀원이 제출했습니다." : "다른 팀원의 제출을 기다리고 있어요."}</p>
              </div>
            </div>
            <Button icon={<Eye aria-hidden="true" className="h-4 w-4" />} disabled={!allSubmitted} onClick={onReveal}>
              전체 의견 공개하기
            </Button>
          </div>
        </Surface>
      )}

      {revealed && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]">
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Users aria-hidden="true" className="h-4 w-4 text-problem" />
                  <h2 className="text-lg font-medium text-ink">동시에 공개된 의견</h2>
                </div>
                <p className="mt-1 text-xs text-ink-soft">카드를 읽고 공감이나 댓글로 반응해보세요.</p>
              </div>
              <Badge tone="success"><Eye aria-hidden="true" className="h-3 w-3" /> 전체 공개</Badge>
            </div>
            {visibleOpinions.map((opinion) => (
              <OpinionCard
                key={opinion.id}
                opinion={opinion}
                author={getAuthor(opinion)}
                currentMemberId={currentMemberId}
                onVote={() => onVote(opinion.id)}
                onComment={(content) => onComment(opinion.id, content)}
              />
            ))}
          </div>
          <VotePanel
            opinions={visibleOpinions}
            selectedOpinionId={selectedOpinionId}
            reason={reason}
            onSelect={setSelectedOpinionId}
            onReasonChange={setReason}
            onFinalize={() => {
              if (selectedOpinionId) onFinalize(selectedOpinionId, reason.trim());
            }}
          />
        </div>
      )}

      {decision && (
        <Surface className="border-success/30 bg-success/8 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <Vote aria-hidden="true" className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">문제 정의가 확정되었습니다.</p>
              <p className="mt-2 text-sm leading-7 text-ink-soft">
                {opinions.find((opinion) => opinion.id === decision.selectedOpinionId)?.content ?? "선택한 의견"}
              </p>
              <p className="mt-3 flex items-center gap-2 text-xs text-muted">
                <MessageCircle aria-hidden="true" className="h-3.5 w-3.5" />
                선택 이유: {decision.reason}
              </p>
            </div>
          </div>
        </Surface>
      )}
    </div>
  );
};
