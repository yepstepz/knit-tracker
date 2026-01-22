'use client';

import { Textarea } from '@mantine/core';
import { FormSection } from '../shared/FormSection';

export function ProjectNotesSection({
  descriptionMd,
  yarnPlan,
  onChange,
}: {
  descriptionMd: string;
  yarnPlan: string;
  onChange: (patch: { descriptionMd?: string; yarnPlan?: string }) => void;
}) {
  return (
    <FormSection title='Notes'>
      <Textarea
        label='Description (Markdown)'
        autosize
        minRows={6}
        value={descriptionMd}
        onChange={(e) => onChange({ descriptionMd: e.currentTarget.value })}
      />
      <Textarea
        label='Yarn plan'
        autosize
        minRows={4}
        value={yarnPlan}
        onChange={(e) => onChange({ yarnPlan: e.currentTarget.value })}
      />
    </FormSection>
  );
}
