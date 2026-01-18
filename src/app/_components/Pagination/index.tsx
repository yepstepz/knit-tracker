import styles from "./styles.module.css";
import { ButtonLink } from "../ButtonLink";

export function Pagination({
                             page,
                             totalPages,
                             hrefForPage,
                           }: {
  page: number;
  totalPages: number;
  hrefForPage: (p: number) => string;
}) {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav className={styles.pagination}>
      <ButtonLink
        variant="outline"
        ariaDisabled={prevDisabled}
        href={hrefForPage(Math.max(1, page - 1))}
      >
        Prev
      </ButtonLink>

      <div className={styles.info}>
        Page {page} / {totalPages}
      </div>

      <ButtonLink
        variant="outline"
        ariaDisabled={nextDisabled}
        href={hrefForPage(Math.min(totalPages, page + 1))}
      >
        Next
      </ButtonLink>
    </nav>
  );
}
