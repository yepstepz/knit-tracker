"use client";

import { Badge, Button, Card, Group, Image, Stack, Text, TextInput } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { FormSection } from "../shared/FormSection";
import type { DraftPhoto } from "./types";

export function CoverSection({
                               currentCover,
                               draft,
                               onDraftChange,
                               onQueueReplace,
                             }: {
  currentCover: DraftPhoto | null;
  draft: { uri: string; caption: string; alt: string };
  onDraftChange: (patch: Partial<{ uri: string; caption: string; alt: string }>) => void;
  onQueueReplace: () => void;
}) {
  const canQueue = !!draft.uri.trim() && !!draft.caption.trim();

  return (
    <FormSection title="Cover">
      {currentCover ? (
        <Card withBorder radius="lg" padding="sm">
          <Card.Section>
            <Image src={currentCover.uri} alt={currentCover.alt || currentCover.caption} height={160} fit="cover" />
          </Card.Section>
          <Group justify="space-between" mt="sm">
            <Text fw={600} size="sm" lineClamp={1}>
              {currentCover.caption}
            </Text>
            <Badge variant="light" radius="sm">
              Current
            </Badge>
          </Group>
          {currentCover.alt ? (
            <Text size="xs" c="dimmed" lineClamp={1}>
              {currentCover.alt}
            </Text>
          ) : null}
        </Card>
      ) : (
        <Text c="dimmed" size="sm">
          No cover yet.
        </Text>
      )}

      <Stack gap="sm">
        <TextInput
          label="New cover URI"
          placeholder="https://…"
          leftSection={<IconPhoto size={16} />}
          value={draft.uri}
          onChange={(e) => onDraftChange({ uri: e.currentTarget.value })}
        />
        <TextInput
          label="Caption"
          value={draft.caption}
          onChange={(e) => onDraftChange({ caption: e.currentTarget.value })}
        />
        <TextInput
          label="Alt (optional)"
          value={draft.alt}
          onChange={(e) => onDraftChange({ alt: e.currentTarget.value })}
        />

        <Button disabled={!canQueue} variant="light" onClick={onQueueReplace}>
          Add cover to draft
        </Button>

        <Text size="xs" c="dimmed">
          Nothing is sent to API until Save.
        </Text>
      </Stack>
    </FormSection>
  );
}
