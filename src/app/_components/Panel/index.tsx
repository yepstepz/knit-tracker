import styles from "./styles.module.css";

export function Panel({ children }: { children: React.ReactNode }) {
  return <div className={styles.panel}>{children}</div>;
}

export function Section({ children }: { children: React.ReactNode }) {
  return <div className={styles.section}>{children}</div>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className={styles.sectionTitle}>{children}</div>;
}

export function Muted({ children }: { children: React.ReactNode }) {
  return <div className={styles.muted}>{children}</div>;
}
