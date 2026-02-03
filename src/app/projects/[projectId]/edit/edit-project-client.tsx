'use client';

import type { ProjectDetail, Tag } from '@/types';
import dynamic from 'next/dynamic';

const ProjectFormClient = dynamic(
  () =>
    import('@/app/_components/Form/project/ProjectFormClient').then((mod) => mod.ProjectFormClient),
  {
    ssr: false,
  },
);

export default function EditProjectClient(props: {
  projectId: string;
  project: ProjectDetail;
  allTags: Tag[];
  backHref: string;
  redirectTo: string;
}) {
  return (
    <ProjectFormClient
      mode={{ kind: 'edit', projectId: props.projectId, redirectTo: props.redirectTo }}
      project={props.project}
      allTags={props.allTags}
      backHref={props.backHref}
    />
  );
}
