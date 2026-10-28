"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "videhSaved";
const read = (): string[] => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };

export function useSaved() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setIds(read());
    sync();
    window.addEventListener("videh-saved", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("videh-saved", sync); window.removeEventListener("storage", sync); };
  }, []);
  const toggle = useCallback((id: string) => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter(x => x !== id) : [id, ...cur];
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    window.dispatchEvent(new Event("videh-saved"));
  }, []);
  return { ids, toggle, isSaved: (id: string) => ids.includes(id) };
}
