"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import PreviewPic from "@/app/_components/Image/PreviewPic";
import {
  createProject,
  updateProject,
  createProjectCover,
  patchPhoto,
  type ProjectInput,
} from "@/app/projects/_helpers/projectApi";

type Mode =
  | { kind: "create" }
  | { kind: "edit"; projectId: string; coverPhotoId?: string | null };

type Props = {
  mode: Mode;
  initial?: {
    title?: string;
    status?: string;
    descriptionMd?: string;
    yarnPlan?: string;
    startedAt?: string | null;
    finishedAt?: string | null;
    archivedAt?: string | null;
    cover?: { uri?: string | null; caption?: string | null; alt?: string | null } | null;
  };
  redirectTo?: string; // только для edit удобно
};

function isoToDateValue(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dateValueToIso(dateValue: string) {
  if (!dateValue) return null;
  const d = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const STATUSES = ["IDEA", "ACTIVE", "PAUSED", "FINISHED", "ABANDONED"] as const;

export default function ProjectForm({ mode, initial, redirectTo }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [status, setStatus] = useState(initial?.status ?? "IDEA");
  const [descriptionMd, setDescriptionMd] = useState(initial?.descriptionMd ?? "");
  const [yarnPlan, setYarnPlan] = useState(initial?.yarnPlan ?? "");

  const [startedAt, setStartedAt] = useState(isoToDateValue(initial?.startedAt));
  const [finishedAt, setFinishedAt] = useState(isoToDateValue(initial?.finishedAt));

  // cover
  const [coverUri, setCoverUri] = useState(initial?.cover?.uri ?? "");
  const [coverCaption, setCoverCaption] = useState(initial?.cover?.caption ?? "");
  const [coverAlt, setCoverAlt] = useState(initial?.cover?.alt ?? "");

  const coverPreview = useMemo(() => coverUri.trim(), [coverUri]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    if (!cleanTitle) return setError("Title is required");

    const payload: ProjectInput = {
      title: cleanTitle,
      status,
      descriptionMd,
      yarnPlan,
      startedAt: dateValueToIso(startedAt),
      finishedAt: dateValueToIso(finishedAt),
    };

    setLoading(true);
    try {
      let projectId =
        mode.kind === "create" ? (await createProject(payload)).id : mode.projectId;

      if (mode.kind === "edit") {
        await updateProject(projectId, payload);
      }

      const uri = coverUri.trim();
      if (uri) {
        const cover = { uri, caption: coverCaption ?? "", alt: coverAlt ?? "" };

        if (mode.kind === "edit" && mode.coverPhotoId) {
          await patchPhoto(mode.coverPhotoId, cover);
        } else {
          await createProjectCover(projectId, cover);
        }
      }

      router.refresh();

      if (mode.kind === "create") {
        router.push(`/projects/${projectId}`);
        return;
      }

      if (redirectTo) router.push(redirectTo);
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Title</label>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select
            className={styles.input}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Started</label>
          <input
            className={styles.input}
            type="date"
            value={startedAt}
            onChange={(e) => setStartedAt(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Finished</label>
          <input
            className={styles.input}
            type="date"
            value={finishedAt}
            onChange={(e) => setFinishedAt(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description (markdown)</label>
        <textarea
          className={styles.textarea}
          rows={7}
          value={descriptionMd}
          onChange={(e) => setDescriptionMd(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Yarn plan</label>
        <textarea
          className={styles.textarea}
          rows={5}
          value={yarnPlan}
          onChange={(e) => setYarnPlan(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className={styles.photoBlock}>
        <div className={styles.photoTitle}>Cover (optional)</div>

        <div className={styles.field}>
          <label className={styles.label}>Cover URL</label>
          <input
            className={styles.input}
            value={coverUri}
            onChange={(e) => setCoverUri(e.target.value)}
            placeholder="https://…"
            disabled={loading}
          />
        </div>

        {coverPreview ? (
          <PreviewPic
            mode="block"
            src={coverPreview}
            alt={coverAlt.trim() || coverCaption.trim() || title || "Cover"}
            caption={coverCaption}
            height={160}
          />
        ) : null}

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>Caption</label>
            <input
              className={styles.input}
              value={coverCaption}
              onChange={(e) => setCoverCaption(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Alt</label>
            <input
              className={styles.input}
              value={coverAlt}
              onChange={(e) => setCoverAlt(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.hint}>
          If URL is set, saving will add/replace the project cover.
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.actions}>
        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? "Saving…" : mode.kind === "create" ? "Create project" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
