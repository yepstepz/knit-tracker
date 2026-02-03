'use client';

import type { Tag } from '@/types';
import dynamic from 'next/dynamic';

const ProjectFormClient = dynamic(
  () =>
    import('@/app/_components/Form/project/ProjectFormClient').then((mod) => mod.ProjectFormClient),
  {
    ssr: false,
  },
);

export default function CreateProjectClient(props: {
  allTags: Tag[];
  backHref: string;
  redirectTo: string;
}) {
  return (
    <ProjectFormClient
      mode={{ kind: 'create', redirectTo: () => props.redirectTo }}
      allTags={props.allTags}
      backHref={props.backHref}
    />
  );
}
