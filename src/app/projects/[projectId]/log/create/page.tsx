import styles from "./page.module.css";
import { apiGet } from "@/app/_lib/serverFetch";
import { ButtonLink, Badge } from "@/app/_components";
import { LogEntryForm } from "../_components/LogEntryForm";

import type { ProjectMini } from "@/types";

export default async function CreateLogEntryPage({
                                                   params,
                                                   searchParams,
                                                 }: {
  params: Promise<{ projectId: string, backTo: string }>;
  searchParams: Promise<{ page?: string; limit?: string; backTo?: string }>;
}) {
  const { projectId } = await params;
  const sp = await searchParams;

  const backPage = sp.page ?? "1";
  const backLimit = sp.limit ?? "10";
  const prevLink = sp.backTo ?? `/projects/${projectId}/log?page=${backPage}&limit=${backLimit}`;

  const project = await apiGet<ProjectMini>(`/api/projects/${projectId}`);

  return (
    <main className={`container ${styles.page}`}>
      <div className={styles.topBar}>
        <ButtonLink variant="back" href={prevLink}>
          ← Logs
        </ButtonLink>
      </div>

      <div className={styles.head}>
        <div className="kicker">New log · {project.title}</div>
        <h1 className="h1">Add log entry</h1>
      </div>

      <LogEntryForm
        projectId={projectId}
        mode={{ kind: "create" }}
        redirectTo={prevLink}
      />
    </main>
  );
}
