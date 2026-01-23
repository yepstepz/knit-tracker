'use client';

import type { ProjectDetail, Tag } from '@/types';
import { ProjectFormClient } from '@/app/_components/Form/project/ProjectFormClient';

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
