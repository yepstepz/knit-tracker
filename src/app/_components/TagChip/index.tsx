import styles from "./styles.module.css";

export type TagChipData = {
  id: string;
  name: string;
  color?: string | null;
};

export function TagChip({ tag, title }: { tag: TagChipData; title?: string }) {
  return (
    <span
      className={styles.chip}
      style={tag.color ? { borderColor: tag.color } : undefined}
      title={title ?? tag.name}
    >
      {tag.name}
    </span>
  );
}
