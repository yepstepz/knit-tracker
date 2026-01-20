"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./styles.module.css";

export function DeleteLogEntryButton({
                                               projectId,
                                               logEntryId,
                                               redirectTo,
                                             }: {
  projectId: string;
  logEntryId: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    const ok = window.confirm("Delete this log entry? This cannot be undone.");
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/log/${logEntryId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      router.push(redirectTo);
      router.refresh();
    } catch (e: any) {
      window.alert(e?.message ?? "Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className={styles.danger} type="button" onClick={onDelete} disabled={loading}>
      {loading ? "Deleting…" : "Delete"}
    </button>
  );
}
