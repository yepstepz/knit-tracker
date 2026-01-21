"use client";

import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";

async function apiNoBody(url: string, init?: RequestInit): Promise<void> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
}

export function DeleteLogEntryButton({
                                       projectId,
                                       logEntryId,
                                       redirectTo,
                                       label = "Delete",
                                     }: {
  projectId: string;
  logEntryId: string;
  redirectTo: string;
  label?: string;
}) {
  const onClick = () => {
    modals.openConfirmModal({
      title: "Delete log entry?",
      children: "This action cannot be undone.",
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        await apiNoBody(`/api/projects/${projectId}/log/${logEntryId}`, { method: "DELETE" });
        window.location.href = redirectTo;
      },
    });
  };

  return (
    <Button color="red" variant="light" leftSection={<IconTrash size={16} />} onClick={onClick}>
      {label}
    </Button>
  );
}
