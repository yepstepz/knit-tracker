'use client';

import { MultiSelect, Text } from '@mantine/core';
import { FormSection } from '../shared/FormSection';

export function ProjectTagsSection({
  allTags,
  tagIds,
  onChange,
}: {
  allTags: Array<{ id: string; name: string }>;
  tagIds: string[];
  onChange: (tagIds: string[]) => void;
}) {
  return (
    <FormSection title='Tags'>
      <MultiSelect
        data={allTags.map((t) => ({ value: t.id, label: t.name }))}
        value={tagIds}
        onChange={onChange}
        placeholder='Select tags…'
        searchable
        clearable
      />
      <Text size='xs' c='dimmed'>
        Applied on Save.
      </Text>
    </FormSection>
  );
}
