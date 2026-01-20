import styles from "./page.module.css";
import { apiGet } from "@/app/_lib/serverFetch";
import { ButtonLink, Badge } from "@/app/_components";

import ArchiveToggle from "./_components/ArchiveToggle";
import ProjectBasics from "./_components/ProjectBasics";
import ProjectDates from "./_components/ProjectDates";
import ProjectNotes from "./_components/ProjectNotes";
import ProjectTags from "./_components/ProjectTags";
import CoverEditor from "./_components/CoverEditor";
import GalleryManager from "@/app/_features/GalleryManager";

type Tag = { id: string; name: string; color?: string | null };

type Photo = {
  id: string;
  uri: string;
  caption: string;
  alt?: string | null;
  role: string;
};

type ProjectDetail = {
  id: string;
  title: string;
  status: string;
  descriptionMd: string;
  yarnPlan: string;
  startedAt: string | null;
  finishedAt: string | null;
  archivedAt: string | null;

  tags: Tag[];
  cover: Photo | null;
  photos: Photo[];
};

export default async function EditProjectPage({
                                                params,
                                              }: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const [project, allTags] = await Promise.all([
    apiGet<ProjectDetail>(`/api/projects/${projectId}`),
    apiGet<Tag[]>(`/api/tags`),
  ]);

  const gallery = (project.photos ?? []).filter((p) => p.role !== "COVER");

  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.topBar}>
        <ButtonLink variant="back" href={`/projects/${projectId}`}>
          ← Project
        </ButtonLink>

        <div className={styles.badges}>
          {project.archivedAt ? <Badge>Archived</Badge> : null}
          <Badge>{project.status}</Badge>
        </div>
      </header>

      <h1 className={styles.title}>Edit project</h1>

      <div className={styles.grid}>
        <section className={styles.leftCol}>
          <ProjectBasics projectId={projectId} initial={{ title: project.title, status: project.status }} />
          <CoverEditor projectId={projectId} cover={project.cover} />
          <ProjectDates projectId={projectId} initial={{ startedAt: project.startedAt, finishedAt: project.finishedAt }} />
          <ProjectNotes projectId={projectId} initial={{ descriptionMd: project.descriptionMd, yarnPlan: project.yarnPlan }} />
          <GalleryManager projectId={projectId} photos={gallery} />
        </section>

        <aside className={styles.rightCol}>
          <div className={styles.rightSticky}>
            <ArchiveToggle projectId={projectId} archivedAt={project.archivedAt} />
            <ProjectTags projectId={projectId} allTags={allTags} initialSelectedIds={project.tags.map((t) => t.id)} />
          </div>
        </aside>
      </div>
    </main>
  );
}
