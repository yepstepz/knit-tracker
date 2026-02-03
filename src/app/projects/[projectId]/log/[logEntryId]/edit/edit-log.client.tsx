'use client';

import { LogEntry, ProjectDetail, Tag } from '@/types';

import dynamic from 'next/dynamic';

const LogEntryFormClient = dynamic(
  () =>
    import('@/app/_components/Form/log/LogEntryFormClient').then((mod) => mod.LogEntryFormClient),
  {
    ssr: false,
  },
);

export default function EditLogClient(props: {
  project: ProjectDetail;
  logEntryId: string;
  log: LogEntry;
}) {
  const { logEntryId, project, log } = props;
  return (
    <LogEntryFormClient
      mode={{ kind: 'edit', logEntryId }}
      redirectTo={`/projects/${project.id}/log/${logEntryId}`}
      log={log}
      project={project}
    />
  );
}
