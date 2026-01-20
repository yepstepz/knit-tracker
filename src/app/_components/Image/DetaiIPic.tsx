import styles from "./styles.module.css";

type Props = {
  src: string;
  alt: string;
  caption?: string | null;
  className?: string;
};

export default function DetailPic({ src, alt, caption, className }: Props) {
  return (
    <figure className={`${styles.detailWrap} ${className ?? ""}`} aria-label={caption ?? ''}>
      <img className={styles.detailImg} src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}
