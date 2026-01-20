"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import s from "@/app/projects/_components/ProjectForm/styles.module.css";
import { patchProject } from "../../_helpers/api";

export default function ProjectNotes({
                                       projectId,
                                       initial,
                                     }: {
  projectId: string;
  initial: { descriptionMd: string; yarnPlan: string };
}) {
  const router = useRouter();
  const [descriptionMd, setDescriptionMd] = useState(initial.descriptionMd ?? "");
  const [yarnPlan, setYarnPlan] = useState(initial.yarnPlan ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    setLoading(true);
    try {
      await patchProject(projectId, { descriptionMd, yarnPlan });
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.block}>
      <div className={s.title}>Notes</div>

      <div className={s.field}>
        <label className={s.label}>Description</label>
        <textarea className={s.textarea} rows={6} value={descriptionMd} onChange={(e) => setDescriptionMd(e.target.value)} disabled={loading} />
      </div>

      <div className={s.field}>
        <label className={s.label}>Yarn plan</label>
        <textarea className={s.textarea} rows={4} value={yarnPlan} onChange={(e) => setYarnPlan(e.target.value)} disabled={loading} />
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
