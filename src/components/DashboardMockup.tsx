import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  Grid2X2,
  Layers3,
  ListChecks,
  Monitor,
  Plus,
  RotateCw,
  Share,
  Sparkles,
} from "lucide-react";
import { Logo } from "./Logo";

const previewNavigation = [
  { label: "문제 정의", icon: Compass },
  { label: "MVP 기능 선정", icon: Layers3 },
  { label: "칸반 보드", icon: ListChecks },
] as const;

const previewStats = [
  { label: "TOTAL TASKS", value: "24", accent: false },
  { label: "IN PROGRESS", value: "8", accent: false },
  { label: "COMPLETED", value: "12", accent: false },
  { label: "PROGRESS", value: "50%", accent: true },
] as const;

export const DashboardMockup = () => (
  <div className="flex h-[620px] w-[896px] flex-col overflow-hidden rounded-[22px] border border-white/10 bg-preview-canvas text-left text-white">
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.04] px-4">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-danger" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning" />
        <span className="h-2.5 w-2.5 rounded-full bg-success" />
        <div className="ml-4 flex items-center gap-3 text-white/40">
          <Grid2X2 aria-hidden="true" className="h-3.5 w-3.5" />
          <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-white/25" />
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-black/20 px-6 py-1 text-[10px] text-white/60 shadow-inner">
        <Monitor aria-hidden="true" className="h-3 w-3" />
        flowup.app
      </div>
      <div className="flex items-center gap-3 text-white/40">
        <RotateCw aria-hidden="true" className="h-3.5 w-3.5" />
        <Share aria-hidden="true" className="h-3.5 w-3.5" />
        <Plus aria-hidden="true" className="h-3.5 w-3.5" />
        <Copy aria-hidden="true" className="h-3.5 w-3.5" />
      </div>
    </div>

    <div className="flex min-h-0 flex-1">
      <aside className="flex w-[194px] shrink-0 flex-col border-r border-white/10 bg-preview-sidebar px-4 py-5">
        <div className="flex items-center justify-between">
          <Logo tone="light" compact />
          <Grid2X2 aria-hidden="true" className="h-3.5 w-3.5 text-white/45" />
        </div>
        <div className="mt-6 flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-preview-brand text-[10px] font-semibold text-white">B</span>
          <span className="truncate text-[11px] font-medium text-white/85">Black Bear Team</span>
        </div>
        <nav className="mt-7 space-y-1.5" aria-label="미리보기 프로젝트 메뉴">
          {previewNavigation.map(({ icon: Icon, label }, index) => (
            <div
              key={label}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[10px] ${index === 2 ? "bg-white/10 text-white" : "text-white/50"}`}
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 bg-preview-main px-5 py-5">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-preview-brand text-xl font-medium text-white">B</span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-medium text-white/95">크루 공동구매 서비스</h3>
              <p className="mt-0.5 text-[10px] text-white/40">개발 단계 진행 중</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-white/10 px-3 py-2 text-[10px] font-medium text-white/85"
          >
            <Sparkles aria-hidden="true" className="h-3 w-3 text-warning" />
            AI 조언 받기
          </button>
        </div>

        <div className="mt-5 grid grid-cols-4 rounded-xl border border-white/[0.06] bg-black/10 px-3 py-4">
          {previewStats.map(({ label, value, accent }, index) => (
            <div key={label} className={`px-3 ${index > 0 ? "border-l border-white/[0.06]" : ""}`}>
              <p className="text-[9px] font-medium tracking-[0.04em] text-white/35">{label}</p>
              <p className={`mt-2 text-2xl font-normal ${accent ? "text-success" : "text-white/90"}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex min-h-[356px] gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-3">
          {["To do", "In progress", "Done"].map((label) => (
            <div key={label} className="min-w-0 flex-1 rounded-lg border border-white/[0.06] bg-white/[0.025] p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-white/55">{label}</p>
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              </div>
              <div className="mt-4 h-20 rounded-md border border-white/[0.05] bg-white/[0.02]" />
              <div className="mt-3 h-14 rounded-md border border-white/[0.05] bg-white/[0.02]" />
            </div>
          ))}
        </div>
      </main>
    </div>
  </div>
);
