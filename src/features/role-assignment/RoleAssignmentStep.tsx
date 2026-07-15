import { AlertTriangle, Check, UserRound, Users } from "lucide-react";
import type { AppState, MemberRole, Project } from "../../types";
import { MEMBER_ROLES } from "../../types";
import { Avatar, Badge, Button, Surface } from "../../components/ui";

type RoleAssignmentStepProps = {
  readonly state: AppState;
  readonly project: Project;
  readonly onRoleChange: (memberId: string, role: MemberRole) => void;
  readonly onAssigneeChange: (featureId: string, memberId: string) => void;
  readonly onComplete: () => void;
};

export const RoleAssignmentStep = ({ state, project, onRoleChange, onAssigneeChange, onComplete }: RoleAssignmentStepProps) => {
  const includedFeatures = state.features.filter((feature) => feature.includedInMvp);
  const workload = project.members.map((member) => ({
    member,
    count: includedFeatures.filter((feature) => feature.assigneeId === member.id).length,
  }));
  const overloaded = workload.filter((item) => item.count > 2);
  const canComplete = includedFeatures.length > 0 && includedFeatures.every((feature) => Boolean(feature.assigneeId)) && project.members.every((member) => Boolean(member.role));

  return (
    <div className="space-y-6">
      <div>
        <Badge className="bg-roles/35 text-ink">5단계 · 역할 분담</Badge>
        <h1 className="mt-4 text-3xl font-normal tracking-tight text-ink sm:text-4xl">누가 어떤 기능을 움직일지 연결해요.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">역할을 정하고, 선정된 기능을 담당자에게 배정하세요. 한 사람에게 일이 몰리면 바로 알 수 있습니다.</p>
      </div>

      {overloaded.length > 0 && (
        <div className="flex items-start gap-3 rounded-app-md border border-warning/30 bg-warning/10 p-4 text-warning">
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">{overloaded.map((item) => item.member.nickname).join(", ")}님에게 작업이 집중되어 있습니다.</p>
            <p className="mt-1 text-xs leading-5 text-warning/80">담당자를 분산하면 팀이 더 안전하게 진행할 수 있어요.</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {workload.map(({ member, count }) => (
          <Surface key={member.id} tone="elevated" className="p-5">
            <div className="flex items-center gap-3">
              <Avatar name={member.nickname} size="lg" tone={count > 2 ? "bg-warning/20" : "bg-roles/35"} online={member.online} />
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium text-ink">{member.nickname}</p>
                <p className="mt-1 text-xs text-muted">현재 배정 작업 {count}개</p>
              </div>
              <UserRound aria-hidden="true" className="h-4 w-4 text-muted" />
            </div>
            <label className="mt-5 block">
              <span className="text-xs font-medium text-ink">역할</span>
              <select
                className="mt-2 w-full rounded-app-sm border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-roles focus:ring-2 focus:ring-roles/20"
                value={member.role ?? ""}
                onChange={(event) => {
                  const role = MEMBER_ROLES.find((item) => item === event.target.value);
                  if (role) onRoleChange(member.id, role);
                }}
              >
                <option value="">역할 선택</option>
                {MEMBER_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </label>
          </Surface>
        ))}
      </div>

      <Surface tone="muted" className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users aria-hidden="true" className="h-4 w-4 text-roles" />
              <h2 className="text-lg font-medium text-ink">MVP 기능 담당자</h2>
            </div>
            <p className="mt-1 text-xs text-ink-soft">기능 카드를 한 사람에게 배정해 바로 이슈로 넘길 준비를 합니다.</p>
          </div>
          <Badge>{includedFeatures.length}개 기능</Badge>
        </div>
        <div className="mt-5 space-y-3">
          {includedFeatures.map((feature) => (
            <div key={feature.id} className="grid gap-3 rounded-app-sm border border-line-soft bg-elevated p-3 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-center">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{feature.title}</p>
                <p className="mt-1 truncate text-xs text-muted">{feature.description}</p>
              </div>
              <select
                className="w-full rounded-app-sm border border-line bg-surface px-3 py-2 text-xs text-ink outline-none focus:border-roles focus:ring-2 focus:ring-roles/20"
                value={feature.assigneeId ?? ""}
                onChange={(event) => onAssigneeChange(feature.id, event.target.value)}
              >
                <option value="">담당자 선택</option>
                {project.members.map((member) => <option key={member.id} value={member.id}>{member.nickname}</option>)}
              </select>
            </div>
          ))}
          {includedFeatures.length === 0 && <p className="py-6 text-center text-sm text-muted">먼저 MVP 기능을 선정해주세요.</p>}
        </div>
      </Surface>

      <div className="flex justify-end">
        <Button icon={<Check aria-hidden="true" className="h-4 w-4" />} disabled={!canComplete} onClick={onComplete}>
          역할 배정 완료하기
        </Button>
      </div>
    </div>
  );
};
