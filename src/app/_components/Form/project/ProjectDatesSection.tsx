"use client";

import { Button, TextInput } from "@mantine/core";
import { FormSection } from "../shared/FormSection";

export function ProjectDatesSection({
                                      startedAtLocal,
                                      finishedAtLocal,
                                      onChange,
                                    }: {
  startedAtLocal: string; // "YYYY-MM-DDTHH:mm"
  finishedAtLocal: string;
  onChange: (patch: { startedAtLocal?: string; finishedAtLocal?: string }) => void;
}) {
  return (
    <FormSection title="Dates">
      <TextInput
        label="Started at"
        type="datetime-local"
        value={startedAtLocal}
        onChange={(e) => onChange({ startedAtLocal: e.currentTarget.value })}
        rightSection={
          startedAtLocal ? (
            <Button variant="subtle" size="xs" onClick={() => onChange({ startedAtLocal: "" })}>
              Clear
            </Button>
          ) : null
        }
        rightSectionWidth={70}
      />

      <TextInput
        label="Finished at"
        type="datetime-local"
        value={finishedAtLocal}
        onChange={(e) => onChange({ finishedAtLocal: e.currentTarget.value })}
        rightSection={
          finishedAtLocal ? (
            <Button variant="subtle" size="xs" onClick={() => onChange({ finishedAtLocal: "" })}>
              Clear
            </Button>
          ) : null
        }
        rightSectionWidth={70}
      />
    </FormSection>
  );
}
