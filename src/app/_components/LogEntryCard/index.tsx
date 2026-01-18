import styles from "./styles.module.css";
import { fmtDate, markdownPreview } from "../../_lib/format";

type Photo = { uri: string; alt?: string | null; caption?: string | null };

export type LogEntry = {
  id: string;
  happenedAt: string;
  title: string;
  contentMd: string;
  photo?: Photo | null;
};

export function LogEntryCard({
                               entry,
                               mode = "preview",
                             }: {
  entry: LogEntry;
  mode?: "preview" | "full";
}) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.title}>{entry.title}</div>
        <div className={styles.date}>{fmtDate(entry.happenedAt)}</div>
      </div>

      {entry.photo?.uri ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.photo}
          src={entry.photo.uri}
          alt={entry.photo.alt ?? entry.photo.caption ?? entry.title}
        />
      ) : null}

      {entry.contentMd?.trim() ? (
        <div className={styles.text}>
          {mode === "preview" ? markdownPreview(entry.contentMd, 220) : entry.contentMd}
        </div>
      ) : (
        <div className={styles.muted}>No content.</div>
      )}
    </div>
  );
}
