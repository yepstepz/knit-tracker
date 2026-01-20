"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import s from "@/app/projects/_components/ProjectForm/styles.module.css";
import { addProjectTag, removeProjectTag } from "../../_helpers/api";

type Tag = { id: string; name: string; color?: string | null };

export default function ProjectTags({
                                      projectId,
                                      allTags,
                                      initialSelectedIds,
                                    }: {
  projectId: string;
  allTags: Tag[];
  initialSelectedIds: string[];
}) {
  const router = useRouter();
  const initial = useMemo(() => new Set(initialSelectedIds), [initialSelectedIds]);
  const [selected, setSelected] = useState<string[]>(initialSelectedIds);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(tagId: string) {
    setSelected((prev) => (prev.includes(tagId) ? prev.filter((x) => x !== tagId) : [...prev, tagId]));
  }

  async function save() {
    setError(null);
    setLoading(true);
    try {
      const next = new Set(selected);
      const toAdd: string[] = [];
      const toRemove: string[] = [];

      for (const id of next) if (!initial.has(id)) toAdd.push(id);
      for (const id of initial) if (!next.has(id)) toRemove.push(id);

      await Promise.all([
        ...toAdd.map((id) => addProjectTag(projectId, id)),
        ...toRemove.map((id) => removeProjectTag(projectId, id)),
      ]);

      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.block}>
      <div className={s.title}>Tags</div>

      <div className={s.field}>
        <div className={s.muted}>Tap to select. Then save.</div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {allTags.map((t) => {
          const on = selected.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => toggle(t.id)}
              disabled={loading}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 999,
                padding: "6px 10px",
                background: on ? "var(--accentSoft)" : "transparent",
                color: on ? "var(--text)" : "var(--muted)",
                cursor: "pointer",
                fontSize: 13,
              }}
              title={on ? "Selected" : "Not selected"}
            >
              {t.name}
            </button>
          );
        })}
      </div>

      <div className={s.actions}>
        <button className={s.btn} type="button" onClick={save} disabled={loading}>
          {loading ? "Saving…" : "Save tags"}
        </button>
      </div>

      {error ? <div className={s.error}>{error}</div> : null}
    </section>
  );
}
