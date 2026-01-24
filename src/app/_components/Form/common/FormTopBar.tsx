'use client';

import Link from 'next/link';
import { Button, Group, Text } from '@mantine/core';
import { IconArrowLeft, IconEdit } from '@tabler/icons-react';

export function FormTopBar(props: { backHref: string; title: string }) {
  return (
    <Group justify='space-between' align='center' wrap='wrap' gap='md'>
      <Link href={props.backHref} style={{ textDecoration: 'none' }}>
        <Group gap={8} c='dimmed'>
          <IconArrowLeft size={16} />
          <Text fw={600} inherit>
            {props.title || 'Projects'}
          </Text>
        </Group>
      </Link>
    </Group>
  );
}
