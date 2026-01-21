"use client";

import Link from "next/link";
import {
  Button,
  Card,
  Container,
  Divider,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";

import { DeleteLogEntryButton } from "@/app/_components/Form/log/DeleteLogEntryButton";
import type { LogEntry } from "@/types";

export default function LogEntryClient({
                                         projectId,
                                         logEntryId,
                                         projectTitle,
                                         entry,
                                         happenedAtLabel,
                                         redirectTo,
                                       }: {
  projectId: string;
  logEntryId: string;
  projectTitle: string;
  entry: LogEntry;
  happenedAtLabel: string;
  redirectTo: string;
}) {
  return (
    <Container size={900} py="xl">
      <Stack gap="lg">
        {/* Top links */}
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          <Group gap="md" wrap="wrap">
            <Link href={`/projects/${projectId}`} style={{ textDecoration: "none" }}>
              <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                Project
              </Button>
            </Link>

            <Link href={`/projects/${projectId}/log?page=1`} style={{ textDecoration: "none" }}>
              <Button variant="subtle">All logs</Button>
            </Link>
          </Group>

          <Text size="sm" c="dimmed">
            Log entry · {projectTitle}
          </Text>
        </Group>

        {/* Main */}
        <Paper withBorder radius="lg" p="lg">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
              <Title order={2}>{entry.title}</Title>
              <Text c="dimmed" style={{ whiteSpace: "nowrap" }}>
                {happenedAtLabel}
              </Text>
            </Group>

            {entry.photo?.uri ? (
              <Card withBorder radius="lg" padding="sm">
                <Card.Section>
                  <Image
                    src={entry.photo.uri}
                    alt={entry.photo.alt ?? entry.photo.caption ?? entry.title}
                    height={360}
                    fit="cover"
                  />
                </Card.Section>

                {(entry.photo.caption || entry.photo.alt) ? (
                  <Text size="sm" mt="sm" c="dimmed">
                    {entry.photo.caption ?? entry.photo.alt}
                  </Text>
                ) : null}
              </Card>
            ) : null}

            <Divider />

            {entry.contentMd?.trim() ? (
              <Text style={{ whiteSpace: "pre-wrap" }}>{entry.contentMd}</Text>
            ) : (
              <Text c="dimmed">No text</Text>
            )}
          </Stack>
        </Paper>

        {/* Actions */}
        <Group justify="space-between" align="center" wrap="wrap">
          <Link
            href={`/projects/${projectId}/log/${logEntryId}/edit`}
            style={{ textDecoration: "none" }}
          >
            <Button variant="light" leftSection={<IconEdit size={16} />}>
              Edit log
            </Button>
          </Link>

          <DeleteLogEntryButton
            projectId={projectId}
            logEntryId={logEntryId}
            redirectTo={redirectTo}
          />
        </Group>
      </Stack>
    </Container>
  );
}
