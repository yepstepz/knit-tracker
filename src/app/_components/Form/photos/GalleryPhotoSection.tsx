'use client';

import type { ChangeEvent } from 'react';
import { Badge, Button, Card, Group, Image, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconPlus, IconStar, IconTrash } from '@tabler/icons-react';
import type { usePhotoDraft } from './usePhotoDraft';

const keyOf = (x: any) => (x.kind === 'existing' ? x.id : x.tempId);

export function GalleryPhotoSection(props: {
  title: string;
  draft: ReturnType<typeof usePhotoDraft>; // kind: 'many'
  hint?: string;

  coverId?: string | null; // existing photo id that should be cover
  onSetAsCover?: (item: any) => void; // gets draft item
}) {
  const { draft, coverId, onSetAsCover } = props;

  return (
    <Stack gap='md'>
      <Group justify='space-between' align='center' wrap='wrap'>
        <Title order={4}>{props.title}</Title>

        <Button
          variant='light'
          leftSection={<IconPlus size={16} />}
          onClick={() => draft.add({ uri: '', caption: '', alt: '' })}
        >
          Add photo
        </Button>
      </Group>

      {draft.items.length ? (
        <Stack gap='md'>
          {draft.items.map((p: any) => {
            const key = keyOf(p);
            const isCover = p.kind === 'existing' && coverId && p.id === coverId;

            return (
              <Card key={key} withBorder radius='lg' p='md'>
                <Stack gap='sm'>
                  <Group justify='space-between' align='center' wrap='wrap'>
                    <Group gap='xs'>
                      {isCover ? (
                        <Badge leftSection={<IconStar size={12} />} variant='light'>
                          Cover
                        </Badge>
                      ) : null}
                    </Group>

                    <Group gap='xs'>
                      {onSetAsCover && !isCover ? (
                        <Button
                          variant='light'
                          leftSection={<IconStar size={16} />}
                          onClick={() => onSetAsCover(p)}
                        >
                          Set as cover
                        </Button>
                      ) : null}

                      <Button
                        color='red'
                        variant='light'
                        leftSection={<IconTrash size={16} />}
                        onClick={() => draft.remove(key)}
                      >
                        Remove
                      </Button>
                    </Group>
                  </Group>

                  {p.uri?.trim() ? (
                    <Card.Section>
                      <Image
                        src={p.uri}
                        alt={p.alt || p.caption || 'Photo'}
                        height={200}
                        fit='cover'
                      />
                    </Card.Section>
                  ) : (
                    <Text c='dimmed'>No preview</Text>
                  )}

                  <TextInput
                    label='URI'
                    value={p.uri}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      draft.update(key, { uri: e.target.value })
                    }
                  />
                  <TextInput
                    label='Caption'
                    value={p.caption}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      draft.update(key, { caption: e.target.value })
                    }
                  />
                  <TextInput
                    label='Alt'
                    value={p.alt}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      draft.update(key, { alt: e.target.value })
                    }
                  />
                </Stack>
              </Card>
            );
          })}
        </Stack>
      ) : (
        <Text c='dimmed'>No photos.</Text>
      )}

      {props.hint ? (
        <Text size='xs' c='dimmed'>
          {props.hint}
        </Text>
      ) : null}
    </Stack>
  );
}
