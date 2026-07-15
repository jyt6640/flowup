import { Hero } from "../components/Hero";

type LandingPageProps = {
  readonly onLoadDemo: () => void;
  readonly onStartProject: (idea: string) => void;
};

export const LandingPage = ({ onLoadDemo, onStartProject }: LandingPageProps) => (
  <div className="bg-canvas">
    <Hero onStart={onStartProject} onDemo={onLoadDemo} />
  </div>
);
