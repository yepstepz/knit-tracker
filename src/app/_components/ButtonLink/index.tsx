import Link from "next/link";
import styles from "./styles.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "ghost" | "back" | "outline";
  ariaDisabled?: boolean;
  title?: string;
};

export function ButtonLink({
                             href,
                             children,
                             variant = "ghost",
                             ariaDisabled,
                             title,
                           }: Props) {
  const cls =
    variant === "back"
      ? styles.back
      : variant === "outline"
        ? styles.outline
        : styles.ghost;

  return (
    <Link
      className={ariaDisabled ? `${cls} ${styles.disabled}` : cls}
      href={href}
      aria-disabled={ariaDisabled}
      title={title}
    >
      {children}
    </Link>
  );
}
