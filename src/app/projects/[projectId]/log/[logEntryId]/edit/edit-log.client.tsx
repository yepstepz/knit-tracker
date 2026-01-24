'use client';

import { LogEntry, ProjectDetail, Tag } from '@/types';

import { LogEntryFormClient } from '@/app/_components/Form/log/LogEntryFormClient';

export default function EditLogClient(props: {
  project: ProjectDetail;
  logEntryId: string;
  log: LogEntry;
  redirectTo: string;
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
