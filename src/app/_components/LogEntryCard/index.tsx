import styles from "./styles.module.css";
import PreviewPic from "../Image/PreviewPic";
import { fmtDate } from "@/app/_lib/format";

type LogEntry = {
  id: string;
  happenedAt: string;
  title: string;
  contentMd: string;
  photo?: { uri: string; alt?: string | null; caption?: string | null } | null;
};

type Props = {
  entry: LogEntry;
  mode?: "preview" | "full";
};

function excerpt(text: string, n = 140) {
  const t = (text ?? "").trim();
  if (!t) return "";
  return t.length > n ? t.slice(0, n).trimEnd() + "…" : t;
}

export function LogEntryCard({ entry, mode = "preview" }: Props) {
  const hasPhoto = Boolean(entry.photo?.uri);

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.title}>{entry.title}</div>
        <div className={styles.date}>{fmtDate(entry.happenedAt)}</div>
      </div>

      {mode === "preview" ? (
        <div className={styles.previewRow}>
          {hasPhoto ? (
            <PreviewPic
              mode="thumb"
              src={entry.photo!.uri}
              alt={entry.photo?.alt || entry.photo?.caption || entry.title}
              thumbSize={56}
            />
          ) : null}

          <div className={styles.previewBody}>
            {entry.contentMd?.trim() ? (
              <div className={styles.text}>{excerpt(entry.contentMd)}</div>
            ) : (
              <div className={styles.muted}>No notes.</div>
            )}
          </div>
        </div>
      ) : (
        <>
          {hasPhoto ? (
            <div className={styles.blockPic}>
              <PreviewPic
                mode="block"
                src={entry.photo!.uri}
                alt={entry.photo?.alt || entry.photo?.caption || entry.title}
                caption={entry.photo?.caption ?? undefined}
                height={180}
              />
            </div>
          ) : null}

          {entry.contentMd?.trim() ? (
            <div className={styles.textFull}>{entry.contentMd}</div>
          ) : (
            <div className={styles.muted}>No notes.</div>
          )}
        </>
      )}
    </article>
  );
}
