import Link from "next/link";
import styles from "./styles.module.css";
import { TagChip, TagChipData } from "../TagChip";

type Photo = { uri: string; alt?: string | null; caption?: string };

export type ProjectListItem = {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
  tags: TagChipData[];
  cover: Photo | null;
};

export function ProjectCard({ p }: { p: ProjectListItem }) {
  return (
    <Link className={styles.card} href={`/projects/${p.id}`}>
      <div className={styles.media}>
        {p.cover?.uri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.cover}
            src={p.cover.uri}
            alt={p.cover.alt ?? p.cover.caption ?? p.title}
          />
        ) : (
          <div className={styles.placeholder}>No cover</div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <div className={styles.title}>{p.title}</div>
          <span className={styles.status}>{p.status}</span>
        </div>

        <div className={styles.tags}>
          {p.tags.slice(0, 4).map((t) => (
            <TagChip key={t.id} tag={t} />
          ))}
          {p.tags.length > 4 ? (
            <span className={styles.more}>+{p.tags.length - 4}</span>
          ) : null}
        </div>

        <div className={styles.meta}>
          Updated {new Date(p.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
