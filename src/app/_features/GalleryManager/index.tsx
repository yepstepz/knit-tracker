"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import s from "@/app/projects/_components/ProjectForm/styles.module.css";
import PreviewPic from "@/app/_components/Image/PreviewPic";
import { addGalleryPhoto, deletePhoto } from "@/app/projects/_helpers/projectApi";

type Photo = { id: string; uri: string; caption: string; alt?: string | null };

export default function GalleryManager({
                                         projectId,
                                         photos,
                                       }: {
  projectId: string;
  photos: Photo[];
}) {
  const router = useRouter();
  const [uri, setUri] = useState("");
  const [caption, setCaption] = useState("");
  const [alt, setAlt] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await addGalleryPhoto({ projectId, uri, caption, alt });
      setUri("");
      setCaption("");
      setAlt("");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function remove(photoId: string) {
    const ok = window.confirm("Delete photo?");
    if (!ok) return;

    setError(null);
    setLoading(true);
    try {
      await deletePhoto(photoId);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.block}>
      <div className={s.title}>Gallery</div>

      <form onSubmit={add}>
        <div className={s.field}>
          <label className={s.label}>Photo URL</label>
          <input className={s.input} value={uri} onChange={(e) => setUri(e.target.value)} disabled={loading} />
        </div>

        {uri.trim() ? (
          <PreviewPic
            mode="block"
            src={uri.trim()}
            alt={alt.trim() || caption.trim() || "Gallery photo"}
            caption={caption}
            height={120}
          />
        ) : null}

        <div className={s.row2}>
          <div className={s.field}>
            <label className={s.label}>Caption</label>
            <input className={s.input} value={caption} onChange={(e) => setCaption(e.target.value)} disabled={loading} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Alt</label>
            <input className={s.input} value={alt} onChange={(e) => setAlt(e.target.value)} disabled={loading} />
          </div>
        </div>

        <div className={s.actions}>
          <button className={s.btn} type="submit" disabled={loading}>
            {loading ? "Adding…" : "Add photo"}
          </button>
        </div>
      </form>

      {photos.length ? (
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {photos.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 10,
                display: "grid",
                gridTemplateColumns: "auto minmax(0, 1fr)",
                gap: 10,
                alignItems: "start",
              }}
            >
              <PreviewPic mode="thumb" src={p.uri} alt={p.alt || p.caption || "Photo"} thumbSize={56} />
              <div style={{ minWidth: 0, display: "grid", gap: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.caption || "Untitled"}
                </div>
                <button className={s.dangerBtn} type="button" onClick={() => remove(p.id)} disabled={loading}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.muted}>No gallery photos.</div>
      )}

      {error ? <div className={s.error}>{error}</div> : null}
    </section>
  );
}
