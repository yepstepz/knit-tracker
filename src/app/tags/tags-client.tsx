'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { Badge, Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import type { Tag } from '@/types';
import { UserContext } from '@/app/_components/UserProvider/user-context';
import { TagFormClient } from '@/app/_components/Form/tag/TagFormClient';

export function TagsClient({ tags }: { tags: Tag[] }) {
  const user = useContext(UserContext);
  const isLoggedIn = Boolean(user?.role);

  return (
    <Container size={1000} py='xl'>
      <Stack gap='lg'>
        <Group justify='space-between' align='center' wrap='wrap' gap='md'>
          <Stack gap={4}>
            <Title order={2} fw={700}>
              Tags
            </Title>
            <Text c='dimmed' size='sm'>
              {tags.length} total
            </Text>
          </Stack>

          {isLoggedIn ? (
            <Button
              leftSection={<IconPlus size={16} />}
              variant='light'
              radius='md'
              w={{ base: '100%', sm: 'auto' }}
              onClick={() => {
                const el = document.getElementById('tag-create');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Create tag
            </Button>
          ) : null}
        </Group>

        {tags.length ? (
          <Group gap={8} wrap='wrap'>
            {tags.map((tag) => (
              <Link key={tag.id} href={`/tags/${tag.id}`} style={{ textDecoration: 'none' }}>
                <Badge
                  variant='light'
                  radius='sm'
                  color={typeof tag.color === 'string' && tag.color ? undefined : 'gray'}
                  style={tag.color ? { backgroundColor: tag.color, color: 'white' } : undefined}
                >
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </Group>
        ) : (
          <Text c='dimmed'>No tags yet.</Text>
        )}

        {isLoggedIn ? (
          <Stack gap='md' id='tag-create'>
            <TagFormClient />
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
