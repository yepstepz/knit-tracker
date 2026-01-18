import styles from "./styles.module.css";

export function KeyValueGrid({
                               rows,
                             }: {
  rows: { k: string; v: React.ReactNode }[];
}) {
  return (
    <div className={styles.kv}>
      {rows.map((r, idx) => (
        <div key={idx} className={styles.row}>
          <div className={styles.k}>{r.k}</div>
          <div className={styles.v}>{r.v}</div>
        </div>
      ))}
    </div>
  );
}
