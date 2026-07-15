import { Check, GripVertical, Pencil, Plus, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { DragEvent } from "react";
import type { AppState, Feature, Project } from "../../types";
import { Badge, Button, EmptyState, Surface } from "../../components/ui";

export type FeatureDraft = {
  readonly title: string;
  readonly description: string;
  readonly problem: string;
  readonly userValue: number;
  readonly difficulty: number;
};

type MvpFeaturesStepProps = {
  readonly state: AppState;
  readonly project: Project;
  readonly currentMemberId: string;
  readonly onAddFeature: (draft: FeatureDraft) => void;
  readonly onUpdateFeature: (featureId: string, patch: Partial<Feature>) => void;
  readonly onDeleteFeature: (featureId: string) => void;
  readonly onToggleFeature: (featureId: string) => void;
  readonly onMoveFeature: (featureId: string, userValue: number, difficulty: number) => void;
  readonly onComplete: () => void;
};

const emptyDraft: FeatureDraft = {
  title: "",
  description: "",
  problem: "",
  userValue: 3,
  difficulty: 3,
};

const matrixCells = [
  { key: "high-low", label: "빠르게 만들고 가치가 큰 기능", userValue: 5, difficulty: 2, tone: "bg-success/8 border-success/25" },
  { key: "high-high", label: "가치가 크지만 신중히 만들 기능", userValue: 5, difficulty: 5, tone: "bg-problem/8 border-problem/25" },
  { key: "low-low", label: "여유가 생기면 검토할 기능", userValue: 2, difficulty: 2, tone: "bg-goal/8 border-goal/25" },
  { key: "low-high", label: "지금은 보류할 기능", userValue: 2, difficulty: 5, tone: "bg-surface-soft border-line-soft" },
] as const;

const getCellKey = (feature: Feature): string => {
  const value = feature.userValue >= 4 ? "high" : "low";
  const difficulty = feature.difficulty >= 4 ? "high" : "low";
  return `${value}-${difficulty}`;
};

const FeatureCard = ({
  feature,
  onEdit,
  onDelete,
  onToggle,
  onDragStart,
}: {
  readonly feature: Feature;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onToggle: () => void;
  readonly onDragStart: (event: DragEvent<HTMLDivElement>) => void;
}) => (
  <div
    draggable
    onDragStart={onDragStart}
    className={`group rounded-app-md border p-4 transition hover:-translate-y-0.5 hover:shadow-soft ${feature.includedInMvp ? "border-mvp/50 bg-elevated" : "border-line-soft bg-surface-soft/70"}`}
  >
    <div className="flex items-start gap-2">
      <button type="button" aria-label={`${feature.title} 이동`} className="mt-0.5 cursor-grab text-muted active:cursor-grabbing">
        <GripVertical aria-hidden="true" className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="break-words text-sm font-medium text-ink">{feature.title}</p>
          {feature.includedInMvp && <Badge className="bg-mvp/25 text-ink">MVP 포함</Badge>}
        </div>
        <p className="mt-2 break-words text-xs leading-5 text-ink-soft">{feature.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <button type="button" aria-label={`${feature.title} 수정`} className="rounded-full p-1.5 text-muted hover:bg-surface-soft hover:text-ink" onClick={onEdit}>
          <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
        <button type="button" aria-label={`${feature.title} 삭제`} className="rounded-full p-1.5 text-muted hover:bg-danger/10 hover:text-danger" onClick={onDelete}>
          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-3">
      <div className="flex gap-3 text-[11px] text-muted">
        <span>가치 {feature.userValue}/5</span>
        <span>난이도 {feature.difficulty}/5</span>
      </div>
      <button
        type="button"
        aria-pressed={feature.includedInMvp}
        className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1.5 text-[11px] font-medium transition ${feature.includedInMvp ? "bg-ink text-white" : "bg-surface-soft text-ink-soft hover:bg-line"}`}
        onClick={onToggle}
      >
        {feature.includedInMvp && <Check aria-hidden="true" className="h-3 w-3" />}
        {feature.includedInMvp ? "선정됨" : "MVP에 포함"}
      </button>
    </div>
  </div>
);

export const MvpFeaturesStep = ({
  state,
  project,
  currentMemberId,
  onAddFeature,
  onUpdateFeature,
  onDeleteFeature,
  onToggleFeature,
  onMoveFeature,
  onComplete,
}: MvpFeaturesStepProps) => {
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<FeatureDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [draggingId, setDraggingId] = useState<string | undefined>();

  const includedCount = state.features.filter((feature) => feature.includedInMvp).length;
  const updateDraft = (key: keyof FeatureDraft, value: string | number) => setDraft((current) => ({ ...current, [key]: value }));

  const submitFeature = () => {
    if (!draft.title.trim() || !draft.description.trim()) return;
    if (editingId) {
      onUpdateFeature(editingId, {
        title: draft.title.trim(),
        description: draft.description.trim(),
        problem: draft.problem.trim(),
        userValue: draft.userValue,
        difficulty: draft.difficulty,
      });
    } else {
      onAddFeature({
        title: draft.title.trim(),
        description: draft.description.trim(),
        problem: draft.problem.trim(),
        userValue: draft.userValue,
        difficulty: draft.difficulty,
      });
    }
    setDraft(emptyDraft);
    setEditingId(undefined);
    setShowForm(false);
  };

  const beginEdit = (feature: Feature) => {
    setDraft({
      title: feature.title,
      description: feature.description,
      problem: feature.problem,
      userValue: feature.userValue,
      difficulty: feature.difficulty,
    });
    setEditingId(feature.id);
    setShowForm(true);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, userValue: number, difficulty: number) => {
    event.preventDefault();
    if (draggingId) onMoveFeature(draggingId, userValue, difficulty);
    setDraggingId(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge className="bg-mvp/30 text-ink">4단계 · MVP 기능 선정</Badge>
          <h1 className="mt-4 text-3xl font-normal tracking-tight text-ink sm:text-4xl">이번에 꼭 필요한 기능만 남겨볼게요.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">기능을 카드로 만들고 가치와 난이도를 비교해, 팀이 함께 만들 수 있는 첫 버전을 정합니다.</p>
        </div>
        <div className="rounded-app-md bg-mvp/20 px-4 py-3 text-right">
          <p className="text-[11px] text-ink-soft">MVP 선정</p>
          <p className="mt-1 text-2xl font-medium text-ink">{includedCount}개</p>
        </div>
      </div>

      <Surface tone="elevated" className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-mvp" />
              <h2 className="text-lg font-medium text-ink">가치 × 난이도 매트릭스</h2>
            </div>
            <p className="mt-1 text-xs text-ink-soft">카드를 드래그해서 위치를 바꿔보세요.</p>
          </div>
          <span className="text-[11px] text-muted">세로축 가치 · 가로축 난이도</span>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {matrixCells.map((cell) => (
            <div
              key={cell.key}
              className={`min-h-36 rounded-app-sm border p-3 ${cell.tone}`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, cell.userValue, cell.difficulty)}
            >
              <p className="text-[11px] font-medium text-ink">{cell.label}</p>
              <div className="mt-3 space-y-2">
                {state.features.filter((feature) => getCellKey(feature) === cell.key).map((feature) => (
                  <div key={feature.id} className="flex items-center gap-2 rounded-lg bg-elevated/75 px-2.5 py-2 text-xs text-ink shadow-sm">
                    <GripVertical aria-hidden="true" className="h-3 w-3 shrink-0 text-muted" />
                    <span className="min-w-0 flex-1 truncate">{feature.title}</span>
                    {feature.includedInMvp && <Check aria-hidden="true" className="h-3 w-3 shrink-0 text-success" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Surface>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-ink">기능 카드</h2>
          <p className="mt-1 text-xs text-ink-soft">팀이 제안한 기능을 편집하거나 MVP에 포함하세요.</p>
        </div>
        <Button icon={showForm ? <X aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4" />} onClick={() => { setShowForm((open) => !open); setEditingId(undefined); setDraft(emptyDraft); }}>
          {showForm ? "닫기" : "새 기능 추가"}
        </Button>
      </div>

      {showForm && (
        <Surface tone="muted" className="p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="text-xs font-medium text-ink">기능명</span>
              <input className="mt-2 w-full rounded-app-sm border border-line bg-elevated px-3 py-2.5 text-sm outline-none focus:border-mvp focus:ring-2 focus:ring-mvp/20" placeholder="예: 회의 시작 질문" value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} />
            </label>
            <label>
              <span className="text-xs font-medium text-ink">해결하는 문제</span>
              <input className="mt-2 w-full rounded-app-sm border border-line bg-elevated px-3 py-2.5 text-sm outline-none focus:border-mvp focus:ring-2 focus:ring-mvp/20" placeholder="어떤 문제를 줄이나요?" value={draft.problem} onChange={(event) => updateDraft("problem", event.target.value)} />
            </label>
            <label className="md:col-span-2">
              <span className="text-xs font-medium text-ink">설명</span>
              <textarea className="mt-2 min-h-24 w-full resize-y rounded-app-sm border border-line bg-elevated px-3 py-2.5 text-sm leading-6 outline-none focus:border-mvp focus:ring-2 focus:ring-mvp/20" placeholder="사용자가 이 기능으로 무엇을 할 수 있나요?" value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} />
            </label>
            <label>
              <span className="text-xs font-medium text-ink">사용자 가치 {draft.userValue}/5</span>
              <input className="mt-3 w-full accent-ink" type="range" min="1" max="5" value={draft.userValue} onChange={(event) => updateDraft("userValue", Number(event.target.value))} />
            </label>
            <label>
              <span className="text-xs font-medium text-ink">구현 난이도 {draft.difficulty}/5</span>
              <input className="mt-3 w-full accent-ink" type="range" min="1" max="5" value={draft.difficulty} onChange={(event) => updateDraft("difficulty", Number(event.target.value))} />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => { setShowForm(false); setEditingId(undefined); }}>취소</Button>
            <Button disabled={!draft.title.trim() || !draft.description.trim()} onClick={submitFeature}>{editingId ? "기능 수정하기" : "기능 카드 만들기"}</Button>
          </div>
        </Surface>
      )}

      {state.features.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {state.features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              onEdit={() => beginEdit(feature)}
              onDelete={() => onDeleteFeature(feature.id)}
              onToggle={() => onToggleFeature(feature.id)}
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", feature.id);
                setDraggingId(feature.id);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="아직 기능 카드가 없습니다." description="팀이 해결하고 싶은 문제를 기능 카드로 하나씩 옮겨보세요." action={<Button onClick={() => setShowForm(true)}>첫 기능 추가하기</Button>} />
      )}

      <div className="flex justify-end">
        <Button icon={<Check aria-hidden="true" className="h-4 w-4" />} disabled={includedCount === 0 || !project.members.some((member) => member.id === currentMemberId)} onClick={onComplete}>
          최종 기능 목록 확정하기
        </Button>
      </div>
    </div>
  );
};
