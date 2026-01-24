'use client';

import type { ProjectDetail, Tag } from '@/types';
import { ProjectFormClient } from '@/app/_components/Form/project/ProjectFormClient';

export default function CreateProjectClient(props: {
  allTags: Tag[];
  backHref: string;
  redirectTo: string;
}) {
  return (
    <ProjectFormClient
      mode={{ kind: 'create', redirectTo: props.redirectTo }}
      allTags={props.allTags}
      backHref={props.backHref}
    />
  );
}
