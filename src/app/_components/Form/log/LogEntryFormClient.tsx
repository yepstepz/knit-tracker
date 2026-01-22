'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { IconArrowLeft, IconCheck, IconPhoto, IconTrash } from '@tabler/icons-react';
import { apiDelete, apiPatch, apiPostWithResponse } from '@/app/_lib/request';

type LogPhoto = {
  id: string;
  uri: string;
  caption: string;
  alt: string | null;
  sortOrder?: number | null;
  role?: string;
};

function isoToLocalInput(iso: string | null | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}

function localInputToIso(v: string) {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

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
  const { projectId, projectTitle, projectStatus, projectArchivedAt } = props;
  const initial = props.initial ?? {};

  const isArchived = !!projectArchivedAt;

  const [title, setTitle] = useState(initial.title ?? '');
  const [contentMd, setContentMd] = useState(initial.contentMd ?? '');
  const [happenedAtLocal, setHappenedAtLocal] = useState(() =>
    isoToLocalInput(initial.happenedAt ?? new Date().toISOString()),
  );

  // Single photo draft:
  // - If initial.photo exists: edit fields + optional delete toggle
  // - Else: draft new photo fields (uri/caption/alt)
  const hasExistingPhoto = !!initial.photo;
  const [photoDeleted, setPhotoDeleted] = useState(false);

  const [photoEdit, setPhotoEdit] = useState(() => ({
    uri: initial.photo?.uri ?? '',
    caption: initial.photo?.caption ?? '',
    alt: initial.photo?.alt ?? '',
  }));

  const [newPhoto, setNewPhoto] = useState(() => ({
    uri: '',
    caption: '',
    alt: '',
  }));

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const backHref = props.mode.kind === 'create' ? props.mode.backTo : props.mode.redirectTo;

  const canStageNewPhoto = !hasExistingPhoto && newPhoto.uri.trim() && newPhoto.caption.trim();

  const previewUri =
    hasExistingPhoto && !photoDeleted
      ? photoEdit.uri
      : !hasExistingPhoto && canStageNewPhoto
        ? newPhoto.uri.trim()
        : '';

  const previewAlt =
    hasExistingPhoto && !photoDeleted
      ? photoEdit.alt || photoEdit.caption || title || 'Photo'
      : !hasExistingPhoto && canStageNewPhoto
        ? newPhoto.alt || newPhoto.caption || title || 'Photo'
        : '';

  const onSave = async () => {
    setSaving(true);
    setMsg(null);

    try {
      // 1) Save log entry (create or edit)
      let logEntryId = props.mode.kind === 'edit' ? props.mode.logEntryId : '';

      if (props.mode.kind === 'create') {
        const { id: logEntryId } = await apiPostWithResponse<{ id: string }>(
          `/api/projects/${projectId}/log`,
          {
            title: title.trim() || 'Untitled log',
            contentMd,
            happenedAt: localInputToIso(happenedAtLocal),
          },
        );
      } else {
        await apiPatch(`/api/projects/${projectId}/log/${logEntryId}`, {
          title,
          contentMd,
          happenedAt: localInputToIso(happenedAtLocal),
        });
      }

      // 2) Save photo (only on Save)
      if (hasExistingPhoto) {
        const pid = initial.photo!.id;

        if (photoDeleted) {
          await apiDelete(`/api/photos/${pid}`);
        } else {
          const patch: any = {};
          if (photoEdit.uri !== (initial.photo!.uri ?? '')) patch.uri = photoEdit.uri;
          if (photoEdit.caption !== (initial.photo!.caption ?? ''))
            patch.caption = photoEdit.caption;

          const altNow = photoEdit.alt.trim() ? photoEdit.alt : null;
          const altInit = (initial.photo!.alt ?? '').trim() ? initial.photo!.alt : null;
          if (altNow !== altInit) patch.alt = altNow;

          if (Object.keys(patch).length) {
            await apiPatch(`/api/photos/${pid}`, patch);
          }
        }
      } else if (canStageNewPhoto) {
        await apiPost(`/api/projects/${projectId}/log/${logEntryId}/photos`, {
          uri: newPhoto.uri.trim(),
          caption: newPhoto.caption.trim(),
          alt: newPhoto.alt.trim() ? newPhoto.alt : undefined,
          role: 'GALLERY',
        });
      }

      // 3) Redirect
      if (props.mode.kind === 'create') {
        window.location.href = props.mode.backTo || `/projects/${projectId}/log/${logEntryId}`;
      } else {
        window.location.href = props.mode.redirectTo;
      }
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
            {isArchived ? (
              <Badge color='red' variant='light' radius='sm'>
                Archived
              </Badge>
            ) : null}
            <Badge variant='outline' radius='sm'>
              {projectStatus}
            </Badge>
          </Group>
        </Group>

        <Stack gap={6}>
          <Text size='sm' c='dimmed'>
            {props.mode.kind === 'create' ? 'New log' : 'Edit log'} · {projectTitle}
          </Text>
          <Title order={2}>
            {props.mode.kind === 'create' ? 'Create log entry' : (initial.title ?? 'Edit log')}
          </Title>
        </Stack>

        {msg ? (
          <Text c={msg.startsWith('Error') ? 'red' : 'dimmed'} size='sm'>
            {msg}
          </Text>
        ) : null}

        <Paper withBorder radius='lg' p='lg'>
          <Stack gap='md'>
            <Title order={4}>Basics</Title>

            <TextInput
              label='Title'
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />

            <TextInput
              label='Happened at'
              type='datetime-local'
              value={happenedAtLocal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setHappenedAtLocal(e.target.value)
              }
            />

            <Textarea
              label='Content (Markdown)'
              autosize
              minRows={8}
              value={contentMd}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContentMd(e.target.value)}
            />
          </Stack>
        </Paper>

        <Paper withBorder radius='lg' p='lg'>
          <Stack gap='md'>
            <Group justify='space-between' align='center' wrap='wrap'>
              <Title order={4}>Photo</Title>

              {hasExistingPhoto ? (
                <Button
                  color={photoDeleted ? 'gray' : 'red'}
                  variant='light'
                  leftSection={<IconTrash size={16} />}
                  onClick={() => setPhotoDeleted((v) => !v)}
                >
                  {photoDeleted ? 'Undo delete' : 'Delete photo'}
                </Button>
              ) : null}
            </Group>

            {previewUri ? (
              <Card
                withBorder
                radius='lg'
                padding='sm'
                style={{ opacity: hasExistingPhoto && photoDeleted ? 0.55 : 1 }}
              >
                <Card.Section>
                  <Image src={previewUri} alt={previewAlt} height={320} fit='cover' />
                </Card.Section>
              </Card>
            ) : (
              <Text c='dimmed'>No photo</Text>
            )}

            {hasExistingPhoto ? (
              <Stack gap='sm'>
                <TextInput
                  label='URI'
                  value={photoEdit.uri}
                  disabled={photoDeleted}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPhotoEdit((s) => ({ ...s, uri: e.target.value }))
                  }
                />
                <TextInput
                  label='Caption'
                  value={photoEdit.caption}
                  disabled={photoDeleted}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPhotoEdit((s) => ({ ...s, caption: e.target.value }))
                  }
                />
                <TextInput
                  label='Alt'
                  value={photoEdit.alt}
                  disabled={photoDeleted}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPhotoEdit((s) => ({ ...s, alt: e.target.value }))
                  }
                />
                <Text size='xs' c='dimmed'>
                  Applied on Save.
                </Text>
              </Stack>
            ) : (
              <Stack gap='sm'>
                <TextInput
                  label='URI'
                  leftSection={<IconPhoto size={16} />}
                  value={newPhoto.uri}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewPhoto((s) => ({ ...s, uri: e.target.value }))
                  }
                />
                <TextInput
                  label='Caption'
                  value={newPhoto.caption}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewPhoto((s) => ({ ...s, caption: e.target.value }))
                  }
                />
                <TextInput
                  label='Alt (optional)'
                  value={newPhoto.alt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewPhoto((s) => ({ ...s, alt: e.target.value }))
                  }
                />
                <Text size='xs' c='dimmed'>
                  Photo will be created on Save.
                </Text>
              </Stack>
            )}
          </Stack>
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
