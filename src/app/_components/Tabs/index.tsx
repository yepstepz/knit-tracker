import Link from "next/link";
import styles from "./styles.module.css";

export type TabItem = { key: string; label: string; href: string };

export function Tabs({ activeKey, tabs }: { activeKey: string; tabs: TabItem[] }) {
  return (
    <div className={styles.tabs}>
      {tabs.map((t) => (
        <Link
          key={t.key}
          className={t.key === activeKey ? styles.active : styles.tab}
          href={t.href}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
