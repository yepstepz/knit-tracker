'use client';

import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconTrash, IconRestore, IconCrown } from '@tabler/icons-react';
import type { DraftPhoto } from './types';

export function PhotoCardEditor({
  photo,
  isCover,
  onChange,
  onSetCover,
  onDeleteToggle,
  onRemoveTemp,
}: {
  photo: DraftPhoto;
  isCover: boolean;
  onChange: (patch: Partial<Pick<DraftPhoto, 'uri' | 'caption' | 'alt' | 'sortOrder'>>) => void;
  onSetCover: () => void;
  onDeleteToggle: () => void; // for existing
  onRemoveTemp: () => void; // for temp
}) {
  const deleted = !!photo.deleted;

  return (
    <Card withBorder radius='lg' padding='md' style={{ opacity: deleted ? 0.55 : 1 }}>
      <Stack gap='sm'>
        <Card.Section>
          <Image src={photo.uri} alt={photo.alt || photo.caption} height={160} fit='cover' />
        </Card.Section>

        <Group justify='space-between' align='center'>
          <Group gap='xs'>
            {isCover ? (
              <Badge leftSection={<IconCrown size={12} />} variant='light' radius='sm'>
                Cover
              </Badge>
            ) : (
              <Badge variant='outline' radius='sm'>
                Gallery
              </Badge>
            )}
            {photo.isTemp ? (
              <Badge color='grape' variant='light' radius='sm'>
                New
              </Badge>
            ) : null}
            {deleted ? (
              <Badge color='red' variant='light' radius='sm'>
                Deleted
              </Badge>
            ) : null}
          </Group>

          {photo.isTemp ? (
            <ActionIcon color='red' variant='light' aria-label='Remove' onClick={onRemoveTemp}>
              <IconTrash size={16} />
            </ActionIcon>
          ) : (
            <ActionIcon
              color={deleted ? 'gray' : 'red'}
              variant='light'
              aria-label={deleted ? 'Undo delete' : 'Delete'}
              onClick={onDeleteToggle}
            >
              {deleted ? <IconRestore size={16} /> : <IconTrash size={16} />}
            </ActionIcon>
          )}
        </Group>

        <TextInput
          label='URI'
          value={photo.uri}
          onChange={(e) => onChange({ uri: e.currentTarget.value })}
          disabled={deleted}
        />
        <TextInput
          label='Caption'
          value={photo.caption}
          onChange={(e) => onChange({ caption: e.currentTarget.value })}
          disabled={deleted}
        />
        <TextInput
          label='Alt'
          value={photo.alt}
          onChange={(e) => onChange({ alt: e.currentTarget.value })}
          disabled={deleted}
        />
        <NumberInput
          label='Sort order'
          value={photo.sortOrder}
          onChange={(v) => onChange({ sortOrder: typeof v === 'number' ? v : 0 })}
          min={0}
          disabled={deleted}
        />

        <Button variant='light' onClick={onSetCover} disabled={deleted}>
          Set as cover
        </Button>

        <Text size='xs' c='dimmed'>
          Applied on Save.
        </Text>
      </Stack>
    </Card>
  );
}
