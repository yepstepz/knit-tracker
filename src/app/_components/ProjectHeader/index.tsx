import styles from "./styles.module.css";
import { TagChip, TagChipData } from "../TagChip";

export function ProjectHeader({
                                title,
                                startedAt,
                                updatedAt,
                                finishedAt,
                                tags,
                              }: {
  title: string;
  startedAt: string | null;
  updatedAt: string;
  finishedAt: string | null;
  tags: TagChipData[];
}) {
  const fmt = (d: string | null) => {
    if (!d) return "—";
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString();
  };

  return (
    <header className={styles.card}>
      <h1 className={styles.title}>{title}</h1>

      {tags.length ? (
        <div className={styles.tags}>
          {tags.map((t) => (
            <TagChip key={t.id} tag={t} href={`/tags/${t.id}?page=1&limit=10`} />
          ))}
        </div>
      ) : (
        <div className={styles.tagsEmpty}>No tags yet</div>
      )}
    </header>
  );
}
