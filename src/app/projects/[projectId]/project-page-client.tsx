'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  GridCol,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowLeft, IconEdit, IconPlus } from '@tabler/icons-react';

import type { Photo, ProjectDetail } from '@/types';

function buildPhotoStack(project: ProjectDetail): Photo[] {
  return [...(project.cover ? [project.cover] : []), ...(project.photos ?? [])];
}

function KeyValue({
  rows,
}: {
  rows: Array<{ k: string; v: string | ReactNode | null | undefined }>;
}) {
  return (
    <Stack gap={10}>
      {rows.map((r) => (
        <Group key={r.k} justify='space-between' align='baseline' wrap='nowrap'>
          <Text size='sm' c='dimmed'>
            {r.k}
          </Text>
          <Text size='sm' fw={600}>
            {r.v ?? '—'}
          </Text>
        </Group>
      ))}
    </Stack>
  );
}

function Photos({ photos, titleFallback }: { photos: Photo[]; titleFallback: string }) {
  if (!photos.length) {
    return (
      <Paper withBorder radius='lg' p='lg'>
        <Text c='dimmed'>No photos</Text>
      </Paper>
    );
  }

  return (
    <Stack gap='md'>
      {photos.map((p, idx) => (
        <Card key={`${p.uri}-${idx}`} withBorder radius='lg' shadow='sm' padding='sm'>
          <Card.Section>
            <Image src={p.uri} alt={p.alt ?? p.caption ?? titleFallback} height={260} fit='cover' />
          </Card.Section>

          {(p.caption || p.alt) && (
            <Text size='sm' mt='sm' c='dimmed'>
              {p.caption ?? p.alt}
            </Text>
          )}
        </Card>
      ))}
    </Stack>
  );
}

export function ProjectPageClient({
  projectId,
  project,
}: {
  projectId: string;
  project: ProjectDetail;
}) {
  const photos = buildPhotoStack(project);
  const tags = project.tags ?? [];

  console.log(project.archivedAt);

  const overviewRows = [
    {
      k: 'State',
      v: project.archivedAt ? (
        <Badge color='red' variant='light' radius='sm'>
          Archived
        </Badge>
      ) : (
        <Badge color='green' variant='light' radius='sm'>
          Active
        </Badge>
      ),
    },
    {
      k: 'Status',
      v: (
        <Badge variant='outline' radius='sm'>
          {project.status}
        </Badge>
      ),
    },
    { k: 'Created', v: project.createdAt },
    { k: 'Updated', v: project.updatedAt },
    { k: 'Started', v: project.startedAt },
    { k: 'Finished', v: project.finishedAt },
    { k: 'Archived', v: project.archivedAt },
  ];

  return (
    <Container size={1200} py='xl'>
      <Stack gap='lg'>
        {/* Top bar */}
        <Group justify='space-between' align='center' wrap='wrap' gap='md'>
          <Link href='/' style={{ textDecoration: 'none' }}>
            <Group gap={8} c='dimmed'>
              <IconArrowLeft size={16} />
              <Text fw={600} inherit>
                Projects
              </Text>
            </Group>
          </Link>

          <Group gap='sm'>
            <Link href={`/projects/${projectId}/edit`} style={{ textDecoration: 'none' }}>
              <Button variant='light' leftSection={<IconEdit size={16} />}>
                Edit
              </Button>
            </Link>
          </Group>
        </Group>

        <Grid gutter='lg'>
          {/* Left photos */}
          <GridCol span={{ base: 12, md: 4 }}>
            <Photos photos={photos} titleFallback={project.title} />
          </GridCol>

          {/* Right content */}
          <GridCol span={{ base: 12, md: 8 }}>
            <Stack gap='lg'>
              {/* Header */}
              <Stack gap='xs'>
                <Title order={2}>{project.title}</Title>

                {tags.length ? (
                  <Group gap='xs' wrap='wrap'>
                    {tags.map((t: any) => (
                      <Badge key={t.id ?? String(t)} variant='light' radius='sm'>
                        {t.name ?? String(t)}
                      </Badge>
                    ))}
                  </Group>
                ) : null}
              </Stack>

              {/* Main + Overview */}
              <Grid gutter='lg'>
                <GridCol span={{ base: 12, lg: 8 }}>
                  <Stack gap='lg'>
                    {/* Description / Yarn plan */}
                    <Paper withBorder radius='lg' p='lg'>
                      <Stack gap='lg'>
                        <Stack gap='xs'>
                          <Title order={4}>Description</Title>
                          {project.descriptionMd?.trim() ? (
                            <Text style={{ whiteSpace: 'pre-wrap' }}>{project.descriptionMd}</Text>
                          ) : (
                            <Text c='dimmed'>No notes yet.</Text>
                          )}
                        </Stack>

                        <Divider />

                        <Stack gap='xs'>
                          <Title order={4}>Yarn plan</Title>
                          {project.yarnPlan?.trim() ? (
                            <Text style={{ whiteSpace: 'pre-wrap' }}>{project.yarnPlan}</Text>
                          ) : (
                            <Text c='dimmed'>No yarn plan yet.</Text>
                          )}
                        </Stack>
                      </Stack>
                    </Paper>

                    {/* Latest progress */}
                    <Paper withBorder radius='lg' p='lg'>
                      <Group justify='space-between' align='center' mb='sm' wrap='wrap'>
                        <Title order={4}>Latest progress</Title>

                        <Link
                          href={`/projects/${projectId}/log/create?backTo=${encodeURIComponent(
                            `/projects/${projectId}#logs`,
                          )}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Button variant='light' leftSection={<IconPlus size={16} />}>
                            Add log
                          </Button>
                        </Link>
                      </Group>

                      {project.logEntries?.length ? (
                        <Stack gap='sm' id='logs'>
                          {project.logEntries.map((e: any) => (
                            <Link
                              key={e.id}
                              href={`/projects/${projectId}/log/${e.id}`}
                              style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                              <Card withBorder radius='lg' shadow='sm' padding='md'>
                                <Group
                                  justify='space-between'
                                  align='flex-start'
                                  wrap='nowrap'
                                  gap='md'
                                >
                                  <Stack gap={4} style={{ minWidth: 0, flex: 1 }}>
                                    <Text fw={700} lineClamp={1}>
                                      {e.title ?? 'Log'}
                                    </Text>
                                    {e.contentMd ? (
                                      <Text c='dimmed' size='sm' lineClamp={2}>
                                        {e.contentMd}
                                      </Text>
                                    ) : null}
                                  </Stack>

                                  <Text c='dimmed' size='sm' style={{ whiteSpace: 'nowrap' }}>
                                    {e.happenedAt}
                                  </Text>
                                </Group>
                              </Card>
                            </Link>
                          ))}
                        </Stack>
                      ) : (
                        <Text c='dimmed'>No log entries yet.</Text>
                      )}

                      <Divider my='md' />

                      <Group justify='flex-end'>
                        <Link
                          href={`/projects/${projectId}/log?page=1&limit=10`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Button variant='subtle'>View all log →</Button>
                        </Link>
                      </Group>
                    </Paper>
                  </Stack>
                </GridCol>

                <GridCol span={{ base: 12, lg: 4 }}>
                  <Paper withBorder radius='lg' p='lg'>
                    <Title order={4} mb='sm'>
                      Overview
                    </Title>
                    <KeyValue rows={overviewRows} />
                  </Paper>
                </GridCol>
              </Grid>
            </Stack>
          </GridCol>
        </Grid>
      </Stack>
    </Container>
  );
}
