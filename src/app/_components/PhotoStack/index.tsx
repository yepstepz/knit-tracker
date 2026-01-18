import styles from "./styles.module.css";

export type Photo = {
  id: string;
  uri: string;
  caption?: string | null;
  alt?: string | null;
  role?: string | null;
};

export function PhotoStack({
                             photos,
                             titleFallback,
                           }: {
  photos: Photo[];
  titleFallback: string;
}) {
  if (!photos.length) {
    return <div className={styles.placeholder}>No photos</div>;
  }

  return (
    <div className={styles.stack}>
      {photos.map((p, idx) => (
        <div key={p.id} className={styles.card}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.img}
            src={p.uri}
            alt={p.alt ?? p.caption ?? titleFallback}
          />
          <div className={styles.meta}>
            <div className={styles.label}>{idx === 0 ? "Cover" : "Photo"}</div>
            {p.caption?.trim() ? <div className={styles.caption}>{p.caption}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
