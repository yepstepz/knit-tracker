'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  SegmentedControl,
  SimpleGrid,
  Stack,
  Container,
  Group,
  Title,
  Text,
  Button,
  Pagination,
} from '@mantine/core';
import { ProjectCard } from '@/app/_components/ProjectCard';
import type { ProjectCardModel } from '@/app/_components/ProjectCard';
import { IconPlus, IconInfoCircle } from '@tabler/icons-react';

export function HomeClient({
  projects,
  page,
  total,
  totalPages,
}: {
  projects: ProjectCardModel[];
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const mode: 'active' | 'archived' = sp.get('archived') === '1' ? 'archived' : 'active';

  const setMode = (next: 'active' | 'archived') => {
    const params = new URLSearchParams(sp.toString());

    if (next === 'archived') params.set('archived', '1');
    else params.delete('archived');

    // обычно при смене режима логично сбросить пагинацию
    params.delete('page');

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  };

  return (
    <>
      <Container
        size={900} // ширина “ленты”
        px={{ base: 'md', sm: 'lg' }} // отступы на мобиле/десктопе
        py='lg'
      >
        <Stack gap='md'>
          <Group justify='space-between' align='center' wrap='wrap' gap='md'>
            <Stack gap={4}>
              <Title order={1} fw={800}>
                Projects
              </Title>
              <Text c='dimmed' size='sm'>
                {total} total • page {page} of {totalPages}
              </Text>
            </Stack>

            <Button
              leftSection={<IconPlus size={16} />}
              variant='light'
              radius='md'
              w={{ base: '100%', sm: 'auto' }}
              // если хочешь, чтобы кнопка не была ниже из-за line-height
            >
              New project
            </Button>
          </Group>
          <SegmentedControl
            value={mode}
            onChange={(v) => setMode(v as 'active' | 'archived')}
            data={[
              { label: 'Актив', value: 'active' },
              { label: 'Архив', value: 'archived' },
            ]}
          />

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
            {projects.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </SimpleGrid>
          {totalPages > 1 && (
            <Group justify='space-between' align='center' mt='md'>
              <Text size='sm' c='dimmed'>
                {total} total • page {page} of {totalPages}
              </Text>

              <Pagination
                total={totalPages}
                value={page}
                onChange={(nextPage) => {
                  const params = new URLSearchParams(sp.toString());
                  params.set('page', String(nextPage));
                  const qs = params.toString();
                  router.push(qs ? `/?${qs}` : '/');
                }}
              />
            </Group>
          )}
        </Stack>
      </Container>
    </>
  );
}
