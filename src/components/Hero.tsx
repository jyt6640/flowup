import { ArrowUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { Navbar } from "./Navbar";
import { Button } from "./ui";
import { ScaledDashboard } from "./ScaledDashboard";

const HERO_IMAGE =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85";
const GRASS_IMAGE = "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png";

type HeroProps = {
  readonly onStart: (idea: string) => void;
  readonly onDemo: () => void;
};

export const Hero = ({ onStart, onDemo }: HeroProps) => {
  const [idea, setIdea] = useState("");

  const submitIdea = () => onStart(idea.trim());

  return (
    <section
      id="preview"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(244,241,234,0.08), rgba(244,241,234,0.38)), url(${HERO_IMAGE})` }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.58),transparent_34%),linear-gradient(90deg,rgba(244,241,234,0.76),transparent_54%)]" />
      <div className="relative z-30">
        <Navbar onStart={() => onStart("")} />
      </div>
      <div className="relative z-0 flex flex-1 flex-col">
        <div className="flex min-h-8 flex-1 shrink-0 sm:min-h-12 lg:min-h-16" />
        <div className="mx-auto flex w-full max-w-[1280px] shrink-0 flex-col items-center px-5 text-center sm:px-8 lg:px-10">
          <div className="flex w-full max-w-4xl flex-col items-center">
            <h1 className="animate-fade-up text-[clamp(2.25rem,7.2vw,6.5rem)] font-normal leading-[1.04] tracking-[-0.03em] text-ink [animation-delay:160ms]">
              <span className="block whitespace-nowrap">막연한 아이디어를</span>
              <span className="block whitespace-nowrap text-ink/80">완성된 프로젝트로.</span>
            </h1>
            <div className="glass-surface mt-12 flex w-full max-w-3xl items-center gap-3 rounded-pill p-2 pl-5 animate-fade-up [animation-delay:320ms] sm:mt-14">
              <input
                aria-label="해결하고 싶은 문제"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-soft/70 sm:text-base"
                placeholder="해결하고 싶은 문제가 무엇인가요?"
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") submitIdea();
                }}
              />
              <button
                type="button"
                aria-label="입력한 아이디어로 프로젝트 생성하기"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info/50"
                onClick={submitIdea}
              >
                <ArrowUp aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-7 max-w-xl animate-fade-up text-sm leading-7 text-ink-soft [animation-delay:420ms] sm:text-base lg:text-lg">
              단계별 질문에 답하고, 팀원들과 합의하며
              <br />
              아이디어를 실제 서비스로 <Sparkles aria-hidden="true" className="mx-1 inline h-4 w-4 text-warning sm:h-5 sm:w-5" /> 구축하세요.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 animate-fade-up [animation-delay:500ms]">
              <Button onClick={onDemo}>샘플 프로젝트 체험</Button>
              <Button variant="secondary" onClick={() => onStart("")}>
                새 프로젝트 시작
              </Button>
            </div>
          </div>
        </div>
        <div className="flex min-h-10 flex-1 shrink-0 sm:min-h-12 lg:min-h-16" />
        <div className="relative z-0 mx-auto w-[92%] max-w-4xl shrink-0 -mb-10 sm:w-[84%] sm:-mb-20 lg:w-[72%] lg:-mb-32">
          <div className="animate-hero-rise [animation-delay:600ms]">
            <ScaledDashboard />
          </div>
        </div>
      </div>
      <img
        src={GRASS_IMAGE}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none"
      />
    </section>
  );
};
