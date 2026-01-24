'use client';

import { LogEntry, ProjectDetail, Tag } from '@/types';

import { LogEntryFormClient } from '@/app/_components/Form/log/LogEntryFormClient';
import { useRouter } from 'next/navigation';

export default function CreateLogClient(props: { project: ProjectDetail; redirectTo: string }) {
  const { project } = props;

  return (
    <LogEntryFormClient mode={{ kind: 'create' }} redirectTo={props.redirectTo} project={project} />
  );
}
