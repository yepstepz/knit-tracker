"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import {
  createLogEntry,
  updateLogEntry,
  upsertLogEntryPhoto,
  type PhotoInput,
} from "../../_helpers/logEntryApi";
import PreviewPic from "@/app/_components/Image/PreviewPic";

type Mode = { kind: "create" } | { kind: "edit"; logEntryId: string };

type Props = {
  projectId: string;
  mode: Mode;
  initial?: {
    title?: string;
    contentMd?: string;
    happenedAt?: string; // ISO
    photo?: { uri?: string | null; caption?: string | null; alt?: string | null } | null;
  };
  redirectTo?: string;
};

function toLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

export function LogEntryForm({ projectId, mode, initial, redirectTo }: Props) {
  const router = useRouter();

  const defaultHappenedAt = useMemo(
    () => toLocal(initial?.happenedAt ?? new Date().toISOString()),
    [initial?.happenedAt]
  );

  const [title, setTitle] = useState(initial?.title ?? "");
  const [contentMd, setContentMd] = useState(initial?.contentMd ?? "");
  const [happenedAt, setHappenedAt] = useState(defaultHappenedAt);

  const [photoUri, setPhotoUri] = useState(initial?.photo?.uri ?? "");
  const [photoCaption, setPhotoCaption] = useState(initial?.photo?.caption ?? "");
  const [photoAlt, setPhotoAlt] = useState(initial?.photo?.alt ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    if (!cleanTitle) return setError("Title is required");

    setLoading(true);
    try {
      const logInput = {
        title: cleanTitle,
        contentMd,
        happenedAt: happenedAt ? new Date(happenedAt).toISOString() : undefined,
      };

      const logEntryId =
        mode.kind === "create"
          ? (await createLogEntry(projectId, logInput)).id
          : mode.logEntryId;

      if (mode.kind === "edit") {
        await updateLogEntry(projectId, logEntryId, logInput);
      }

      const uri = photoUri.trim();
      if (uri) {
        const photo: PhotoInput = { uri, caption: photoCaption ?? "", alt: photoAlt?.trim() || undefined };
        await upsertLogEntryPhoto(projectId, logEntryId, photo);
      }

      router.refresh();
      if (redirectTo) router.push(redirectTo);
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Title</label>
        <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Happened at</label>
        <input
          className={styles.input}
          type="datetime-local"
          value={happenedAt}
          onChange={(e) => setHappenedAt(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Notes</label>
        <textarea
          className={styles.textarea}
          rows={7}
          value={contentMd}
          onChange={(e) => setContentMd(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className={styles.photo}>
        <div className={styles.photoTitle}>Photo (optional)</div>

        <div className={styles.field}>
          <label className={styles.label}>URL</label>
          <input
            className={styles.input}
            value={photoUri}
            onChange={(e) => setPhotoUri(e.target.value)}
            placeholder="https://…"
            disabled={loading}
          />
        </div>
        {photoUri.trim() ? (
          <PreviewPic
            mode="block"
            src={photoUri.trim()}
            alt={photoAlt.trim() || photoCaption.trim() || title || "Log photo"}
            caption={photoCaption}
            height={140}
          />
        ) : null}

        <div className={styles.field}>
          <label className={styles.label}>Caption</label>
          <input className={styles.input} value={photoCaption} onChange={(e) => setPhotoCaption(e.target.value)} disabled={loading} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Alt</label>
          <input className={styles.input} value={photoAlt} onChange={(e) => setPhotoAlt(e.target.value)} disabled={loading} />
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.actions}>
        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? "Saving…" : mode.kind === "create" ? "Create" : "Save"}
        </button>
      </div>
    </form>
  );
}
