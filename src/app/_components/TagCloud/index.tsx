import Link from "next/link";
import styles from "./styles.module.css";
import { Tag } from "@/types";

export type TagCloudTag = {
  id: string;
  name: string;
  color?: string | null;
};

export function TagCloud({
                           tags,
                           activeTagId,
                           archived,
                           limit,
                         }: {
  tags: Tag[];
  activeTagId?: string;
  archived?: "1";
  limit?: string;
}) {
  return (
    <div className={styles.cloud}>
      {tags.map((t) => {
        const active = activeTagId === t.id;

        const s = new URLSearchParams();
        s.set("page", "1");
        if (limit) s.set("limit", limit);
        if (archived === "1") s.set("archived", "1");
        s.set("tagId", t.id);

        return (
          <Link
            key={t.id}
            href={`/?${s.toString()}`}
            className={active ? styles.itemActive : styles.item}
            style={t.color ? { borderColor: t.color } : undefined}
            title={t.name}
          >
            {t.name}
          </Link>
        );
      })}
    </div>
  );
}
