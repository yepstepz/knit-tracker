"use client";

import { Select, TextInput } from "@mantine/core";
import { FormSection } from "../shared/FormSection";

export function ProjectBasicsSection({
                                       title,
                                       status,
                                       onChange,
                                       statusOptions = [
                                         { value: "ACTIVE", label: "Active" },
                                         { value: "PAUSED", label: "Paused" },
                                         { value: "FINISHED", label: "Finished" },
                                         { value: "DRAFT", label: "Draft" },
                                       ],
                                     }: {
  title: string;
  status: string;
  onChange: (patch: { title?: string; status?: string }) => void;
  statusOptions?: Array<{ value: string; label: string }>;
}) {
  const opts = status && !statusOptions.some((o) => o.value === status)
    ? [{ value: status, label: status }, ...statusOptions]
    : statusOptions;

  return (
    <FormSection title="Basics">
      <TextInput label="Title" value={title} onChange={(e) => onChange({ title: e.currentTarget.value })} />
      <Select
        label="Status"
        data={opts}
        value={status}
        onChange={(v) => onChange({ status: v ?? status })}
      />
    </FormSection>
  );
}
