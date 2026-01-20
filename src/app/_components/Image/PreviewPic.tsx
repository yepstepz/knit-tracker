import styles from "./styles.module.css";

type Props = {
  src: string;
  alt: string;
  caption?: string | null;

  mode?: "block" | "thumb"; // default "block"

  // block mode
  height?: number; // px, default 120

  // thumb mode
  thumbSize?: number; // px, default 64

  className?: string;
};

export default function PreviewPic({
                                     src,
                                     alt,
                                     caption,
                                     mode = "block",
                                     height = 120,
                                     thumbSize = 64,
                                     className,
                                   }: Props) {
  if (mode === "thumb") {
    return (
      <div className={`${styles.thumbWrap} ${className ?? ""}`}>
        <img
          className={styles.thumbImg}
          src={src}
          alt={alt}
          loading="lazy"
          style={{ width: thumbSize, height: thumbSize }}
        />
      </div>
    );
  }

  return (
    <figure className={`${styles.previewWrap} ${className ?? ""}`} aria-label={caption ?? undefined}>
      <img
        className={styles.previewImg}
        src={src}
        alt={alt}
        loading="lazy"
        style={{ height }}
      />
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}
