import { useEffect, useState } from "react";
import { api } from "../api/client.js";

/**
 * Polls GET /api/health so the UI can show whether it's talking to the
 * live backend or running off local mock data.
 * Returns "checking" | "online" | "offline".
 */
export function useBackendStatus(pollMs = 15000) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    let timer;

    async function check() {
      try {
        await api.getHealth();
        if (!cancelled) setStatus("online");
      } catch {
        if (!cancelled) setStatus("offline");
      } finally {
        if (!cancelled) timer = setTimeout(check, pollMs);
      }
    }

    check();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pollMs]);

  return status;
}
