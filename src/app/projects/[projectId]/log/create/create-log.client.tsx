'use client';

import { ProjectDetail } from '@/types';

import dynamic from 'next/dynamic';

const LogEntryFormClient = dynamic(
  () =>
    import('@/app/_components/Form/log/LogEntryFormClient').then((mod) => mod.LogEntryFormClient),
  {
    ssr: false,
  },
);

export default function CreateLogClient(props: { project: ProjectDetail; redirectTo: string }) {
  const { project } = props;

  return (
    <LogEntryFormClient mode={{ kind: 'create' }} redirectTo={props.redirectTo} project={project} />
  );
}
