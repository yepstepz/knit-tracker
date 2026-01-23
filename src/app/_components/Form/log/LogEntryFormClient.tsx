'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge, Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';

import type { LogPhoto } from '@/types';
import { isoToLocalInput } from '@/app/projects/[projectId]/edit/_helpers/api';
import { usePhotoDraft } from '@/app/_components/Form/photos/usePhotoDraft';
import { SinglePhotoSection } from '@/app/_components/Form/photos/SinglePhotoSection';

import { LogBasicsSection } from './LogBasicsSection'; // если у тебя уже есть; если нет — оставь как раньше
import { saveLogEntry } from './_helpers/api';

export function LogEntryFormClient(props: {
  mode:
    | { kind: 'create'; backTo: string }
    | { kind: 'edit'; logEntryId: string; redirectTo: string };

  projectId: string;
  projectTitle: string;
  projectStatus: string;
  projectArchivedAt: string | null;

  initial?: {
    title?: string;
    contentMd?: string;
    happenedAt?: string | null;
    photo?: LogPhoto | null;
  };
}) {
  const router = useRouter();
  const initial = props.initial ?? {};

  const [title, setTitle] = useState(initial.title ?? '');
  const [contentMd, setContentMd] = useState(initial.contentMd ?? '');
  const [happenedAtLocal, setHappenedAtLocal] = useState(() =>
    isoToLocalInput(initial.happenedAt ?? new Date().toISOString()),
  );

  const photoDraft = usePhotoDraft({
    kind: 'single',
    initial: initial.photo
      ? {
          id: initial.photo.id,
          uri: initial.photo.uri,
          caption: initial.photo.caption,
          alt: initial.photo.alt ?? null,
        }
      : null,
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const backHref = props.mode.kind === 'create' ? props.mode.backTo : props.mode.redirectTo;

  const onSave = async () => {
    setSaving(true);
    setMsg(null);

    try {
      const { logEntryId } = await saveLogEntry({
        mode: props.mode,
        projectId: props.projectId,
        title,
        contentMd,
        happenedAtLocal,
        photoPlan: photoDraft.getPlan(),
      });

      const goTo =
        props.mode.kind === 'create'
          ? props.mode.backTo || `/projects/${props.projectId}/log/${logEntryId}`
          : props.mode.redirectTo;

      router.replace(goTo);
      router.refresh();
    } catch (e: any) {
      setMsg(e?.message ? `Error: ${e.message}` : 'Error');
      setSaving(false);
    }
  };

  return (
    <Container size={900} py='xl'>
      <Stack gap='lg'>
        <Group justify='space-between' align='center' wrap='wrap'>
          <Link href={backHref} style={{ textDecoration: 'none' }}>
            <Button variant='subtle' leftSection={<IconArrowLeft size={16} />}>
              Back
            </Button>
          </Link>

          <Group gap='xs'>
            {props.projectArchivedAt ? (
              <Badge color='red' variant='light' radius='sm'>
                Archived
              </Badge>
            ) : null}
            <Badge variant='outline' radius='sm'>
              {props.projectStatus}
            </Badge>
          </Group>
        </Group>

        <Stack gap={6}>
          <Text size='sm' c='dimmed'>
            {props.mode.kind === 'create' ? 'New log' : 'Edit log'} · {props.projectTitle}
          </Text>
          <Title order={2}>
            {props.mode.kind === 'create' ? 'Create log entry' : (initial.title ?? 'Edit log')}
          </Title>
        </Stack>

        {msg ? (
          <Text c='red' size='sm'>
            {msg}
          </Text>
        ) : null}

        <Paper withBorder radius='lg' p='lg'>
          <LogBasicsSection
            title={title}
            happenedAtLocal={happenedAtLocal}
            contentMd={contentMd}
            onChange={(p) => {
              if (p.title !== undefined) setTitle(p.title);
              if (p.happenedAtLocal !== undefined) setHappenedAtLocal(p.happenedAtLocal);
              if (p.contentMd !== undefined) setContentMd(p.contentMd);
            }}
          />
        </Paper>

        <Paper withBorder radius='lg' p='lg'>
          <SinglePhotoSection title='Photo' draft={photoDraft} showRemove hint='Applied on Save.' />
        </Paper>

        <Group justify='space-between' align='center' wrap='wrap'>
          <Link href={backHref} style={{ textDecoration: 'none' }}>
            <Button variant='subtle'>Cancel</Button>
          </Link>

          <Button leftSection={<IconCheck size={16} />} loading={saving} onClick={onSave}>
            Save
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
