'use client';

import Link from 'next/link';
import { Button, Group, Paper, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export function FormActions(props: {
  cancelHref: string;
  onSave: () => void;
  saving: boolean;
  msg?: string | null;

  // desktop sticky mode
  sticky?: boolean;
  top?: number;

  // responsive helpers (Mantine)
  visibleFrom?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hiddenFrom?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  hint?: string;
}) {
  return (
    <Paper
      withBorder
      radius='lg'
      p='lg'
      visibleFrom={props.visibleFrom}
      hiddenFrom={props.hiddenFrom}
      style={props.sticky ? { position: 'sticky', top: props.top ?? 16 } : undefined}
    >
      <Group justify='space-between' align='center' wrap='wrap'>
        <Link href={props.cancelHref} style={{ textDecoration: 'none' }}>
          <Button variant='subtle'>Cancel</Button>
        </Link>

        <Button leftSection={<IconCheck size={16} />} loading={props.saving} onClick={props.onSave}>
          Save
        </Button>
      </Group>

      {props.msg ? (
        <Text c='red' size='xs' mt='sm'>
          {props.msg}
        </Text>
      ) : props.hint ? (
        <Text size='xs' c='dimmed' mt='sm'>
          {props.hint}
        </Text>
      ) : null}
    </Paper>
  );
}
