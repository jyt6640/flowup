import { useEffect, useRef, useState } from "react";
import { DashboardMockup } from "./DashboardMockup";

const DESIGN_WIDTH = 896;
const DESIGN_HEIGHT = 620;

export const ScaledDashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(DESIGN_WIDTH);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width;
      if (nextWidth !== undefined && nextWidth > 0) setContainerWidth(nextWidth);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min(containerWidth / DESIGN_WIDTH, 1);

  return (
    <div
      ref={containerRef}
      className="w-full"
    >
      <div
        data-testid="scaled-dashboard"
        className="relative mx-auto overflow-hidden rounded-t-[22px] bg-preview-canvas shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10"
        style={{ width: DESIGN_WIDTH * scale, height: DESIGN_HEIGHT * scale }}
      >
        <div
          className="origin-top-left"
          style={{ transform: `scale(${scale})`, width: DESIGN_WIDTH, height: DESIGN_HEIGHT }}
        >
          <DashboardMockup />
        </div>
      </div>
    </div>
  );
};
