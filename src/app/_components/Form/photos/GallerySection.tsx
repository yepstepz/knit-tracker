"use client";

import { Button, Grid, GridCol, Group, Stack, Text, TextInput } from "@mantine/core";
import { FormSection } from "../shared/FormSection";
import type { PhotoDraftState } from "./types";
import { PhotoCardEditor } from "./PhotoCardEditor";

export function GallerySection({
                                 state,
                                 coverId,
                                 addDraft,
                                 updateDraft,
                                 setCoverId,
                                 toggleDeleteExisting,
                                 removeTemp,
                                 addNewDraftForm,
                                 setAddNewDraftForm,
                               }: {
  state: PhotoDraftState;
  coverId: string | null;

  addDraft: (input: { uri: string; caption: string; alt: string }) => void;
  updateDraft: (id: string, patch: Partial<{ uri: string; caption: string; alt: string; sortOrder: number }>) => void;
  setCoverId: (id: string) => void;
  toggleDeleteExisting: (id: string) => void;
  removeTemp: (id: string) => void;

  addNewDraftForm: { uri: string; caption: string; alt: string };
  setAddNewDraftForm: (patch: Partial<{ uri: string; caption: string; alt: string }>) => void;
}) {
  const ids = state.order.filter((id) => {
    const p = state.byId[id];
    return !!p && p.role === "GALLERY";
  });

  const canAdd = !!addNewDraftForm.uri.trim() && !!addNewDraftForm.caption.trim();

  return (
    <FormSection title="Gallery">
      <Stack gap="sm">
        <TextInput
          label="New photo URI"
          value={addNewDraftForm.uri}
          onChange={(e) => setAddNewDraftForm({ uri: e.currentTarget.value })}
        />
        <TextInput
          label="Caption"
          value={addNewDraftForm.caption}
          onChange={(e) => setAddNewDraftForm({ caption: e.currentTarget.value })}
        />
        <TextInput
          label="Alt (optional)"
          value={addNewDraftForm.alt}
          onChange={(e) => setAddNewDraftForm({ alt: e.currentTarget.value })}
        />

        <Group justify="flex-end">
          <Button
            variant="light"
            disabled={!canAdd}
            onClick={() => {
              addDraft(addNewDraftForm);
            }}
          >
            Add to draft
          </Button>
        </Group>

        <Text size="xs" c="dimmed">
          Nothing is sent to API until Save.
        </Text>
      </Stack>

      <Grid gutter="md">
        {ids.map((id) => {
          const p = state.byId[id]!;
          return (
            <GridCol key={id} span={{ base: 12, sm: 6, lg: 4 }}>
              <PhotoCardEditor
                photo={p}
                isCover={coverId === id}
                onChange={(patch) => updateDraft(id, patch)}
                onSetCover={() => setCoverId(id)}
                onDeleteToggle={() => toggleDeleteExisting(id)}
                onRemoveTemp={() => removeTemp(id)}
              />
            </GridCol>
          );
        })}
      </Grid>

      {!ids.length ? <Text c="dimmed">No gallery photos in draft.</Text> : null}
    </FormSection>
  );
}
