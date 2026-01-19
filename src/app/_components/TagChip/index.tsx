"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./styles.module.css";

export type TagChipData = {
  id: string;
  name: string;
  color?: string | null;
};

type Props = {
  tag: TagChipData;

  /** некликабельный */
  static?: boolean;

  /** подсветка активного */
  active?: boolean;

  /**
   * куда вести (по умолчанию главная "/")
   * можно использовать и в других местах, если надо
   */
  basePath?: string;

  /** если нужно полностью переопределить href */
  hrefOverride?: string;
};

export function TagChip({
                          tag,
                          static: isStatic,
                          active,
                          basePath = "/",
                          href,
                        }: Props) {
  const sp = useSearchParams();

  const style = tag.color ? ({ borderColor: tag.color } as React.CSSProperties) : undefined;
  const cls = active ? `${styles.chip} ${styles.active}` : styles.chip;

  const common = {
    className: cls,
    style,
    title: tag.name,
  };

  if (isStatic) return <span {...common}>{tag.name}</span>;

  const toPage = (() => {
    if (href) return href;

    const next = new URLSearchParams(sp.toString());
    next.set("tagId", tag.id); // add/replace
    next.set("page", "1"); // always reset page
    const q = next.toString();
    return q ? `${basePath}?${q}` : basePath;
  })();

  return (
    <Link href={toPage} {...common}>
      {tag.name}
    </Link>
  );
}
