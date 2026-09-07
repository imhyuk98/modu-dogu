"use client";

import { useCallback, useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

/** Once per mounted page; no input values are sent. Auto results require interaction. */
export function useToolMeasurement(tool: string, resultKey: string | null = null) {
  const started = useRef(false);
  const completed = useRef(false);
  const start = useCallback(() => {
    if (!started.current) started.current = trackEvent("tool_start", { tool, measurement_version: 2 });
  }, [tool]);
  const complete = useCallback(() => {
    start();
    if (started.current && !completed.current) completed.current = trackEvent("tool_complete", { tool, measurement_version: 2 });
  }, [tool, start]);
  useEffect(() => {
    if (!started.current || resultKey === null) return;
    const timer = setTimeout(complete, 800);
    return () => clearTimeout(timer);
  }, [resultKey, complete]);
  const share = () => trackEvent("result_share", { tool, method: "clipboard", measurement_version: 2 });
  return { start, complete, share };
}
