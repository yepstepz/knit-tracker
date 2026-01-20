"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import s from "@/app/projects/_components/ProjectForm/styles.module.css";
import { patchProject } from "../../_helpers/api";

const STATUSES = ["IDEA", "ACTIVE", "PAUSED", "FINISHED", "ABANDONED"] as const;

export default function ProjectBasics({
                                        projectId,
                                        initial,
                                      }: {
  projectId: string;
  initial: { title: string; status: string };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title ?? "");
  const [status, setStatus] = useState(initial.status ?? "IDEA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    if (!title.trim()) return setError("Title is required");

    setLoading(true);
    try {
      await patchProject(projectId, { title: title.trim(), status });
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.block}>
      <div className={s.title}>Basics</div>

      <div className={s.field}>
        <label className={s.label}>Title</label>
        <input className={s.input} value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
      </div>

      <div className={s.field}>
        <label className={s.label}>Status</label>
        <select className={s.select} value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
          {STATUSES.map((x) => (
            <option key={x} value={x}>{x}</option>
          ))}
        </select>
      </div>

      <div className={s.actions}>
        <button className={s.btn} type="button" onClick={save} disabled={loading}>
          {loading ? "Saving…" : "Save"}
        </button>
      </div>

      {error ? <div className={s.error}>{error}</div> : null}
    </section>
  );
}
