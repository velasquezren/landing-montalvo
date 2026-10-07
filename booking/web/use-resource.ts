"use client";
import { useEffect, useState } from "react";

/** Ignora respuestas anteriores cuando el usuario cambia rápidamente de selección. */
export function useResource<T>(
  key: string,
  loader: (attempt: number) => Promise<T>,
) {
  const [retryState, setRetryState] = useState({ key, attempt: 0 });
  const attempt = retryState.key === key ? retryState.attempt : 0;
  const requestKey = `${key}:${attempt}`;
  const [result, setResult] = useState<{
    key: string;
    data?: T;
    error?: boolean;
  }>();
  useEffect(() => {
    let active = true;
    loader(attempt).then(
      (data) => {
        if (active) setResult({ key: requestKey, data });
      },
      () => {
        if (active) setResult({ key: requestKey, error: true });
      },
    );
    return () => {
      active = false;
    };
  }, [loader, attempt, requestKey]);
  return {
    loading: result?.key !== requestKey,
    error: result?.key === requestKey && result.error,
    data: result?.key === requestKey ? result.data : undefined,
    retry: () => setRetryState({ key, attempt: attempt + 1 }),
  };
}
