"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PreviewPic from "@/app/_components/Image/PreviewPic";
import s from "@/app/projects/_components/ProjectForm/styles.module.css";
import { upsertCoverPhoto } from "../../_helpers/api";

type Photo = { id: string; uri: string; caption: string; alt?: string | null };

export default function CoverEditor({
                                      projectId,
                                      cover,
                                    }: {
  projectId: string;
  cover: Photo | null;
}) {
  const router = useRouter();
  const [uri, setUri] = useState(cover?.uri ?? "");
  const [caption, setCaption] = useState(cover?.caption ?? "");
  const [alt, setAlt] = useState(cover?.alt ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    setLoading(true);
    try {
      await upsertCoverPhoto({
        projectId,
        coverPhotoId: cover?.id ?? null,
        uri,
        caption,
        alt,
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
      <div className={s.title}>Cover</div>

      <div className={s.field}>
        <label className={s.label}>Cover URL</label>
        <input className={s.input} value={uri} onChange={(e) => setUri(e.target.value)} disabled={loading} />
      </div>

      {uri.trim() ? (
        <PreviewPic
          mode="block"
          src={uri.trim()}
          alt={alt?.trim() || caption?.trim() || "Cover"}
          caption={caption}
          height={160}
        />
      ) : (
        <div className={s.muted}>No cover.</div>
      )}

      <div className={s.row2}>
        <div className={s.field}>
          <label className={s.label}>Caption</label>
          <input className={s.input} value={caption} onChange={(e) => setCaption(e.target.value)} disabled={loading} />
        </div>
        <div className={s.field}>
          <label className={s.label}>Alt</label>
          <input className={s.input} value={alt ?? ""} onChange={(e) => setAlt(e.target.value)} disabled={loading} />
        </div>
      </div>

      <div className={s.actions}>
        <button className={s.btn} type="button" onClick={save} disabled={loading}>
          {loading ? "Saving…" : "Save cover"}
        </button>
      </div>

      {error ? <div className={s.error}>{error}</div> : null}
    </section>
  );
}
