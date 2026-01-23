'use client';

import { Stack, TextInput, Textarea, Title } from '@mantine/core';

export function LogBasicsSection(props: {
  title: string;
  happenedAtLocal: string;
  contentMd: string;
  onChange: (patch: Partial<{ title: string; happenedAtLocal: string; contentMd: string }>) => void;
}) {
  const { title, happenedAtLocal, contentMd, onChange } = props;

  return (
    <Stack gap='md'>
      <Title order={4}>Basics</Title>

      <TextInput
        label='Title'
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ title: e.target.value })}
      />

      <TextInput
        label='Happened at'
        type='datetime-local'
        value={happenedAtLocal}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange({ happenedAtLocal: e.target.value })
        }
      />

      <Textarea
        label='Content (Markdown)'
        autosize
        minRows={8}
        value={contentMd}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange({ contentMd: e.target.value })
        }
      />
    </Stack>
  );
}
