'use client';

import type { ChangeEvent } from 'react';
import { Button, Card, Group, Image, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconPhoto, IconTrash } from '@tabler/icons-react';
import type { usePhotoDraft } from './usePhotoDraft';

export function SinglePhotoSection(props: {
  title: string;
  draft: ReturnType<typeof usePhotoDraft>; // must be kind 'single'
  hint?: string;
  showRemove?: boolean;
}) {
  const { draft } = props;
  const x = draft.items[0];

  const uri = x?.uri ?? '';
  const caption = x?.caption ?? '';
  const alt = x?.alt ?? '';

  const onUri = (e: ChangeEvent<HTMLInputElement>) =>
    draft.kind === 'single' ? draft.setSingleDraft({ uri: e.target.value, caption, alt }) : null;

  const onCaption = (e: ChangeEvent<HTMLInputElement>) =>
    draft.kind === 'single' ? draft.setSingleDraft({ uri, caption: e.target.value, alt }) : null;

  const onAlt = (e: ChangeEvent<HTMLInputElement>) =>
    draft.kind === 'single' ? draft.setSingleDraft({ uri, caption, alt: e.target.value }) : null;

  const canPreview = !!draft.preview.uri;

  return (
    <Stack gap='md'>
      <Group justify='space-between' align='center' wrap='wrap'>
        <Title order={4}>{props.title}</Title>

        {props.showRemove ? (
          <Button
            color='red'
            variant='light'
            leftSection={<IconTrash size={16} />}
            onClick={() => draft.clearSingle()}
          >
            Remove
          </Button>
        ) : null}
      </Group>

      {canPreview ? (
        <Card withBorder radius='lg' padding='sm'>
          <Card.Section>
            <Image src={draft.preview.uri} alt={draft.preview.alt} height={320} fit='cover' />
          </Card.Section>
        </Card>
      ) : (
        <Text c='dimmed'>No photo</Text>
      )}

      <TextInput label='URI' leftSection={<IconPhoto size={16} />} value={uri} onChange={onUri} />
      <TextInput label='Caption' value={caption} onChange={onCaption} />
      <TextInput label='Alt (optional)' value={alt} onChange={onAlt} />

      {props.hint ? (
        <Text size='xs' c='dimmed'>
          {props.hint}
        </Text>
      ) : null}
    </Stack>
  );
}
