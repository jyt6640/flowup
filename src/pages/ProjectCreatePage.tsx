import { ArrowLeft, ArrowRight, CalendarDays, Check, Lightbulb, Users } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PROJECT_TYPES } from "../types";
import type { ProjectType } from "../types";
import { Logo } from "../components/Logo";
import { Button, Surface } from "../components/ui";

type ProjectCreatePageProps = {
  readonly onCreate: (input: {
    readonly name: string;
    readonly description: string;
    readonly initialIdea: string;
    readonly type: ProjectType;
    readonly duration: string;
    readonly memberNames: readonly string[];
  }) => void;
};

const getInitialIdea = (state: unknown): string => {
  if (typeof state !== "object" || state === null || !("initialIdea" in state)) return "";
  const value = state.initialIdea;
  return typeof value === "string" ? value : "";
};

export const ProjectCreatePage = ({ onCreate }: ProjectCreatePageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [initialIdea, setInitialIdea] = useState(getInitialIdea(location.state));
  const [type, setType] = useState<ProjectType>("사이드 프로젝트");
  const [duration, setDuration] = useState("4주");
  const [memberNames, setMemberNames] = useState(["흑곰", "코브", "캐모", "모닝빵"]);
  const canSubmit = Boolean(name.trim() && description.trim() && initialIdea.trim());

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Logo />
        <button type="button" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink" onClick={() => navigate("/")}>
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          홈으로
        </button>
      </header>
      <main className="mx-auto max-w-[1120px] px-5 pb-16 pt-8 sm:px-8 sm:pt-12 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">New project</p>
          <h1 className="mt-4 text-4xl font-normal leading-tight tracking-tight text-ink sm:text-6xl">팀이 함께 시작할 프로젝트를 적어주세요.</h1>
          <p className="mt-5 text-base leading-7 text-ink-soft">아직 완벽한 기획서가 아니어도 괜찮습니다. 지금 가진 생각을 다음 단계의 질문으로 바꿔볼게요.</p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Surface tone="elevated" className="p-5 sm:p-8">
            <div className="space-y-6">
              <label className="block">
                <span className="text-sm font-medium text-ink">프로젝트 이름</span>
                <input className="mt-2 w-full rounded-app-sm border border-line bg-surface px-3.5 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-ink focus:ring-2 focus:ring-ink/10" placeholder="예: 팀 프로젝트의 첫 단추" value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">프로젝트 설명</span>
                <textarea className="mt-2 min-h-28 w-full resize-y rounded-app-sm border border-line bg-surface px-3.5 py-3 text-sm leading-6 text-ink outline-none placeholder:text-muted focus:border-ink focus:ring-2 focus:ring-ink/10" placeholder="이 프로젝트로 무엇을 시도하려 하나요?" value={description} onChange={(event) => setDescription(event.target.value)} />
              </label>
              <label className="block">
                <span className="flex items-center gap-2 text-sm font-medium text-ink"><Lightbulb aria-hidden="true" className="h-4 w-4 text-problem" />현재 가지고 있는 아이디어</span>
                <textarea className="mt-2 min-h-36 w-full resize-y rounded-app-sm border border-line bg-surface px-3.5 py-3 text-sm leading-6 text-ink outline-none placeholder:text-muted focus:border-problem focus:ring-2 focus:ring-problem/20" placeholder="어떤 장면에서 이 아이디어가 떠올랐나요?" value={initialIdea} onChange={(event) => setInitialIdea(event.target.value)} />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-ink">프로젝트 유형</span>
                  <select className="mt-2 w-full rounded-app-sm border border-line bg-surface px-3.5 py-3 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/10" value={type} onChange={(event) => {
                    const nextType = PROJECT_TYPES.find((projectType) => projectType === event.target.value);
                    if (nextType) setType(nextType);
                  }}>
                    {PROJECT_TYPES.map((projectType) => <option key={projectType} value={projectType}>{projectType}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="flex items-center gap-2 text-sm font-medium text-ink"><CalendarDays aria-hidden="true" className="h-4 w-4 text-goal" />예상 기간</span>
                  <select className="mt-2 w-full rounded-app-sm border border-line bg-surface px-3.5 py-3 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/10" value={duration} onChange={(event) => setDuration(event.target.value)}>
                    {["2주", "4주", "6주", "8주 이상"].map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
              </div>
            </div>
          </Surface>
          <div className="space-y-5">
            <Surface tone="muted" className="p-5">
              <div className="flex items-center gap-2">
                <Users aria-hidden="true" className="h-4 w-4 text-roles" />
                <p className="text-sm font-medium text-ink">함께할 팀원</p>
              </div>
              <p className="mt-1 text-xs leading-5 text-ink-soft">기본 이름은 인터뷰용 샘플입니다. 팀에 맞게 바꿔보세요.</p>
              <div className="mt-4 space-y-2">
                {memberNames.map((memberName, index) => (
                  <input key={`${index}-${memberName}`} aria-label={`팀원 ${index + 1} 이름`} className="w-full rounded-app-sm border border-line bg-elevated px-3 py-2.5 text-sm text-ink outline-none focus:border-roles focus:ring-2 focus:ring-roles/20" value={memberName} onChange={(event) => setMemberNames((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} />
                ))}
              </div>
            </Surface>
            <Surface className="p-5">
              <p className="text-sm font-medium text-ink">시작하면 바로 할 수 있는 것</p>
              <ul className="mt-4 space-y-3">
                {["아이디어 질문에 답하기", "팀원의 의견을 동시에 공개하기", "투표로 문제 정의 확정하기"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-ink-soft"><Check aria-hidden="true" className="h-3.5 w-3.5 text-success" />{item}</li>
                ))}
              </ul>
            </Surface>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Button icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />} disabled={!canSubmit} onClick={() => onCreate({ name: name.trim(), description: description.trim(), initialIdea: initialIdea.trim(), type, duration, memberNames: memberNames.map((item) => item.trim() || "팀원") })}>
            프로젝트 시작하기
          </Button>
        </div>
      </main>
    </div>
  );
};
