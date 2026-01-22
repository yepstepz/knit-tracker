'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Badge, Button, Container, Grid, GridCol, Group, Stack, Text, Title } from '@mantine/core';
import { IconArchive, IconArrowLeft, IconCheck } from '@tabler/icons-react';

import { ProjectBasicsSection } from '@/app/_components/Form/project/ProjectBasicsSection';
import { ProjectDatesSection } from '@/app/_components/Form/project/ProjectDatesSection';
import { ProjectNotesSection } from '@/app/_components/Form/project/ProjectNotesSection';
import { ProjectTagsSection } from '@/app/_components/Form/project/ProjectTagsSection';

import { CoverSection } from '@/app/_components/Form/photos/CoverSection';
import { GallerySection } from '@/app/_components/Form/photos/GallerySection';
import type { Photo } from '@/app/_components/Form/photos/types';
import { usePhotoDraft } from '@/app/_components/Form/photos/usePhotoDraft';

import { isoToLocalInput, saveProjectAll, toggleArchive } from './_helpers/api';
import { getCoverId } from '@/app/_components/Form/photos/utils';

type Tag = { id: string; name: string; color?: string | null };

type ProjectDetail = {
  id: string;
  title: string;
  status: string;
  descriptionMd: string;
  yarnPlan: string;
  startedAt: string | null;
  finishedAt: string | null;
  archivedAt: string | null;
  tags: Tag[];
};

export default function EditProjectClient({
  projectId,
  project,
  allTags,
  photos,
}: {
  projectId: string;
  project: ProjectDetail;
  allTags: Tag[];
  photos: Photo[];
}) {
  // fields draft
  const [title, setTitle] = useState(project.title ?? '');
  const [status, setStatus] = useState(project.status ?? 'ACTIVE');
  const [descriptionMd, setDescriptionMd] = useState(project.descriptionMd ?? '');
  const [yarnPlan, setYarnPlan] = useState(project.yarnPlan ?? '');
  const [startedAtLocal, setStartedAtLocal] = useState(isoToLocalInput(project.startedAt));
  const [finishedAtLocal, setFinishedAtLocal] = useState(isoToLocalInput(project.finishedAt));

  // tags draft
  const initialTagIds = useMemo(() => project.tags?.map((t) => t.id) ?? [], [project.tags]);
  const [tagIds, setTagIds] = useState<string[]>(initialTagIds);

  // photos draft hook
  const photosDraft = usePhotoDraft(photos);

  // cover draft inputs
  const [coverDraft, setCoverDraft] = useState({ uri: '', caption: '', alt: '' });

  // gallery add draft inputs
  const [addPhotoDraft, setAddPhotoDraft] = useState({ uri: '', caption: '', alt: '' });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const isArchived = !!project.archivedAt;

  // compute a current cover object that is not deleted
  const currentCover = useMemo(() => {
    const id = getCoverId(photosDraft.state);
    if (!id) return null;
    const p = photosDraft.state.byId[id];
    if (!p || p.deleted) return null;
    return p;
  }, [photosDraft.state]);

  const onQueueCoverReplace = () => {
    const ok = photosDraft.addCoverReplace(coverDraft);
    if (ok) setCoverDraft({ uri: '', caption: '', alt: '' });
  };

  const onAddGallery = (input: { uri: string; caption: string; alt: string }) => {
    const ok = photosDraft.addGallery(input);
    if (ok) setAddPhotoDraft({ uri: '', caption: '', alt: '' });
  };

  const onSave = async () => {
    setSaving(true);
    setMsg(null);

    try {
      await saveProjectAll({
        projectId,
        title,
        status,
        descriptionMd,
        yarnPlan,
        startedAtLocal,
        finishedAtLocal,
        initialTagIds,
        tagIds,
        photoState: photosDraft.state,
      });

      setMsg('Saved ✅');
      window.location.reload();
    } catch (e: any) {
      setMsg(e?.message ? `Error: ${e.message}` : 'Error');
      setSaving(false);
    }
  };

  const onArchiveToggle = async () => {
    setSaving(true);
    setMsg(null);

    try {
      await toggleArchive(projectId, isArchived);
      window.location.reload();
    } catch (e: any) {
      setMsg(e?.message ? `Error: ${e.message}` : 'Error');
      setSaving(false);
    }
  };

  return (
    <Container size={1200} py='xl'>
      <Stack gap='lg'>
        <Group justify='space-between' align='center' wrap='wrap'>
          <Link href={`/projects/${projectId}`} style={{ textDecoration: 'none' }}>
            <Group gap={8} c='dimmed'>
              <IconArrowLeft size={16} />
              <Text fw={600} inherit>
                Project
              </Text>
            </Group>
          </Link>

          <Group gap='xs'>
            <Badge color={isArchived ? 'red' : 'green'} variant='light' radius='sm'>
              {isArchived ? 'Archived' : 'Active'}
            </Badge>
            <Badge variant='outline' radius='sm'>
              {project.status}
            </Badge>
          </Group>
        </Group>

        <Group justify='space-between' align='center' wrap='wrap'>
          <Title order={2}>Edit project</Title>

          <Group gap='sm'>
            <Button
              variant={isArchived ? 'light' : 'outline'}
              color='red'
              leftSection={<IconArchive size={16} />}
              loading={saving}
              onClick={onArchiveToggle}
            >
              {isArchived ? 'Unarchive' : 'Archive'}
            </Button>

            <Button leftSection={<IconCheck size={16} />} loading={saving} onClick={onSave}>
              Save
            </Button>
          </Group>
        </Group>

        {msg ? (
          <Text c={msg.startsWith('Error') ? 'red' : 'dimmed'} size='sm'>
            {msg}
          </Text>
        ) : null}

        <Grid gutter='lg'>
          <GridCol span={{ base: 12, md: 8 }}>
            <Stack gap='lg'>
              <ProjectBasicsSection
                title={title}
                status={status}
                onChange={(p) => {
                  if (p.title !== undefined) setTitle(p.title);
                  if (p.status !== undefined) setStatus(p.status);
                }}
              />

              <ProjectDatesSection
                startedAtLocal={startedAtLocal}
                finishedAtLocal={finishedAtLocal}
                onChange={(p) => {
                  if (p.startedAtLocal !== undefined) setStartedAtLocal(p.startedAtLocal);
                  if (p.finishedAtLocal !== undefined) setFinishedAtLocal(p.finishedAtLocal);
                }}
              />

              <ProjectNotesSection
                descriptionMd={descriptionMd}
                yarnPlan={yarnPlan}
                onChange={(p) => {
                  if (p.descriptionMd !== undefined) setDescriptionMd(p.descriptionMd);
                  if (p.yarnPlan !== undefined) setYarnPlan(p.yarnPlan);
                }}
              />

              <GallerySection
                state={photosDraft.state}
                coverId={photosDraft.coverId}
                addDraft={onAddGallery}
                updateDraft={(id, patch) => photosDraft.update(id, patch)}
                setCoverId={(id) => photosDraft.setCoverId(id)}
                toggleDeleteExisting={(id) => photosDraft.toggleDeleteExisting(id)}
                removeTemp={(id) => photosDraft.removeTempById(id)}
                addNewDraftForm={addPhotoDraft}
                setAddNewDraftForm={(p) => setAddPhotoDraft((s) => ({ ...s, ...p }))}
              />
            </Stack>
          </GridCol>

          <GridCol span={{ base: 12, md: 4 }}>
            <Stack gap='lg' style={{ position: 'sticky', top: 16 }}>
              <ProjectTagsSection allTags={allTags} tagIds={tagIds} onChange={setTagIds} />

              <CoverSection
                currentCover={currentCover}
                draft={coverDraft}
                onDraftChange={(p) => setCoverDraft((s) => ({ ...s, ...p }))}
                onQueueReplace={onQueueCoverReplace}
              />
            </Stack>
          </GridCol>
        </Grid>
      </Stack>
    </Container>
  );
}
