'use client';

import { Button, Card, Group, Image, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconPhoto, IconTrash } from '@tabler/icons-react';
import type { ReturnTypeOf } from './types'; // не нужен, просто не импортируй :)
import { useSinglePhotoDraft } from './useSinglePhotoDraft';

export function LogPhotoSection(props: {
  photo: ReturnType<typeof useSinglePhotoDraft>;
  titleFallback: string;
}) {
  const { photo, titleFallback } = props;

  const alt = (photo.previewAlt || titleFallback || 'Photo') as string;

  return (
    <Stack gap='md'>
      <Group justify='space-between' align='center' wrap='wrap'>
        <Title order={4}>Photo</Title>

        {photo.hasInitial ? (
          <Button
            color={photo.deleted ? 'gray' : 'red'}
            variant='light'
            leftSection={<IconTrash size={16} />}
            onClick={() => photo.setDeleted((v) => !v)}
          >
            {photo.deleted ? 'Undo delete' : 'Delete photo'}
          </Button>
        ) : null}
      </Group>

      {photo.canPreview ? (
        <Card
          withBorder
          radius='lg'
          padding='sm'
          style={{ opacity: photo.hasInitial && photo.deleted ? 0.55 : 1 }}
        >
          <Card.Section>
            <Image src={photo.previewUri} alt={alt} height={320} fit='cover' />
          </Card.Section>
        </Card>
      ) : (
        <Text c='dimmed'>No photo</Text>
      )}

      {photo.hasInitial ? (
        <Stack gap='sm'>
          <TextInput
            label='URI'
            value={photo.edit.uri}
            disabled={photo.deleted}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              photo.setEdit((s) => ({ ...s, uri: e.target.value }))
            }
          />
          <TextInput
            label='Caption'
            value={photo.edit.caption}
            disabled={photo.deleted}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              photo.setEdit((s) => ({ ...s, caption: e.target.value }))
            }
          />
          <TextInput
            label='Alt'
            value={photo.edit.alt}
            disabled={photo.deleted}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              photo.setEdit((s) => ({ ...s, alt: e.target.value }))
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
            value={photo.draft.uri}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              photo.setDraft((s) => ({ ...s, uri: e.target.value }))
            }
          />
          <TextInput
            label='Caption'
            value={photo.draft.caption}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              photo.setDraft((s) => ({ ...s, caption: e.target.value }))
            }
          />
          <TextInput
            label='Alt (optional)'
            value={photo.draft.alt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              photo.setDraft((s) => ({ ...s, alt: e.target.value }))
            }
          />
          <Text size='xs' c='dimmed'>
            Photo will be created on Save.
          </Text>
        </Stack>
      )}
    </Stack>
  );
}
