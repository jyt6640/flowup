import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { ProjectCreatePage } from "./pages/ProjectCreatePage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { InterviewResultPage } from "./pages/InterviewResultPage";
import { createDemoState, createEmptyState, createProjectState } from "./data/mockData";
import { recordButtonClick, recordPageEntry } from "./lib/analytics";
import { clearAppState, loadAppState, saveAppState } from "./lib/storage";
import type { AppState, ProjectType } from "./types";

type ProjectInput = {
  readonly name: string;
  readonly description: string;
  readonly initialIdea: string;
  readonly type: ProjectType;
  readonly duration: string;
  readonly memberNames: readonly string[];
};

const RouterContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<AppState>(() => loadAppState() ?? createEmptyState());

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  useEffect(() => {
    setState((current) => recordPageEntry(current, location.pathname));
  }, [location.pathname]);

  const handleStartProject = (idea: string) => {
    setState((current) => recordButtonClick(current, "프로토타입 시작하기"));
    navigate("/create", { state: { initialIdea: idea } });
  };

  const handleLoadDemo = () => {
    setState(recordButtonClick(createDemoState(), "샘플 프로젝트 보기"));
    navigate("/workspace/2");
  };

  const handleCreateProject = (input: ProjectInput) => {
    const nextState = createProjectState({
      name: input.name,
      description: input.description,
      initialIdea: input.initialIdea,
      type: input.type,
      duration: input.duration,
    });
    const project = nextState.project;
    const namedProject = project
      ? {
          ...project,
          members: project.members.map((member, index) => ({
            ...member,
            nickname: input.memberNames[index] ?? member.nickname,
          })),
        }
      : null;
    setState(recordButtonClick({ ...nextState, project: namedProject }, "프로젝트 시작하기"));
    navigate("/workspace/1");
  };

  const handleReset = () => {
    if (typeof window !== "undefined" && !window.confirm("현재 프로젝트와 인터뷰 기록을 모두 초기화할까요?")) return;
    clearAppState();
    setState(createEmptyState());
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLoadDemo={handleLoadDemo} onStartProject={handleStartProject} />} />
      <Route path="/create" element={<ProjectCreatePage onCreate={handleCreateProject} />} />
      <Route
        path="/workspace"
        element={<Navigate to={state.project ? `/workspace/${state.project.currentStep}` : "/create"} replace />}
      />
      <Route path="/workspace/:stepId" element={<WorkspacePage state={state} setState={setState} onReset={handleReset} />} />
      <Route path="/interview-results" element={<InterviewResultPage state={state} project={state.project} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App = (): ReactNode => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <RouterContent />
  </BrowserRouter>
);
