"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import s from "@/app/projects/_components/ProjectForm/styles.module.css";
import { patchProject } from "../../_helpers/api";

function isoToDateValue(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dateValueToIso(v: string) {
  if (!v) return null;
  const d = new Date(`${v}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export default function ProjectDates({
                                       projectId,
                                       initial,
                                     }: {
  projectId: string;
  initial: { startedAt: string | null; finishedAt: string | null };
}) {
  const router = useRouter();
  const [startedAt, setStartedAt] = useState(isoToDateValue(initial.startedAt));
  const [finishedAt, setFinishedAt] = useState(isoToDateValue(initial.finishedAt));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    setLoading(true);
    try {
      await patchProject(projectId, {
        startedAt: dateValueToIso(startedAt),
        finishedAt: dateValueToIso(finishedAt),
      });
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.block}>
      <div className={s.title}>Dates</div>

      <div className={s.row2}>
        <div className={s.field}>
          <label className={s.label}>Started</label>
          <input className={s.input} type="date" value={startedAt} onChange={(e) => setStartedAt(e.target.value)} disabled={loading} />
        </div>
        <div className={s.field}>
          <label className={s.label}>Finished</label>
          <input className={s.input} type="date" value={finishedAt} onChange={(e) => setFinishedAt(e.target.value)} disabled={loading} />
        </div>
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
