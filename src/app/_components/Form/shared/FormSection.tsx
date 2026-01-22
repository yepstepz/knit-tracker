'use client';

import { Paper, Stack, Title, type PaperProps } from '@mantine/core';

export function FormSection({
  title,
  children,
  ...paperProps
}: PaperProps & { title: string; children: React.ReactNode }) {
  return (
    <Paper withBorder radius='lg' p='lg' {...paperProps}>
      <Stack gap='md'>
        <Title order={4}>{title}</Title>
        {children}
      </Stack>
    </Paper>
  );
}
