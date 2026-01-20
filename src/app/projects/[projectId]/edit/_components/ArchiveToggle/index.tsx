"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import s from "@/app/projects/_components/ProjectForm/styles.module.css";
import { archiveProject, unarchiveProject } from "../../_helpers/api";

export default function Index({
                                        projectId,
                                        archivedAt,
                                      }: {
  projectId: string;
  archivedAt: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setError(null);
    setLoading(true);
    try {
      if (archivedAt) await unarchiveProject(projectId);
      else await archiveProject(projectId);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.block}>
      <div className={s.title}>State</div>
      <button className={archivedAt ? s.btn : s.dangerBtn} type="button" onClick={toggle} disabled={loading}>
        {archivedAt ? "Make active" : "Archive"}
      </button>
      {error ? <div className={s.error}>{error}</div> : null}
    </section>
  );
}
