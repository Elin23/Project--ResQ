import { useCallback, useEffect, useMemo, useState } from "react";

export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const reset = useCallback(
    (nextSeconds = initialSeconds) => setSeconds(nextSeconds),
    [initialSeconds],
  );

  const formatted = useMemo(() => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  }, [seconds]);

  return { seconds, formatted, reset, isFinished: seconds === 0 };
}
