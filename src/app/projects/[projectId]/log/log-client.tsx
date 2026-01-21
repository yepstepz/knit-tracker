"use client";

import Link from "next/link";
import {
  Button,
  Card,
  Container,
  Divider,
  Group,
  Image,
  Pagination,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";

function buildHref(basePath: string, page: number, limit: string) {
  const sp = new URLSearchParams();
  sp.set("page", String(page));
  if (limit) sp.set("limit", limit);
  const q = sp.toString();
  return q ? `${basePath}?${q}` : basePath;
}

export default function ProjectLogClient({
                                           projectId,
                                           projectTitle,
                                           total,
                                           page,
                                           totalPages,
                                           limit,
                                           backTo,
                                           basePath,
                                           items,
                                         }: {
  projectId: string;
  projectTitle: string;
  total: number;
  page: number;
  totalPages: number;
  limit: string;
  backTo: string;
  basePath: string;
  items: Array<{
    id: string;
    title: string;
    happenedAtLabel: string;
    photo: { uri: string; alt: string } | null;
    preview: string;
  }>;
}) {
  return (
    <Container size={900} py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          <Link href={`/projects/${projectId}`} style={{ textDecoration: "none" }}>
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Back
            </Button>
          </Link>

          <Link
            href={`/projects/${projectId}/log/create?backTo=${encodeURIComponent(backTo)}`}
            style={{ textDecoration: "none" }}
          >
            <Button leftSection={<IconPlus size={16} />}>Add log</Button>
          </Link>
        </Group>

        <Stack gap={6}>
          <Text size="sm" c="dimmed">
            Project
          </Text>
          <Title order={2}>{projectTitle}</Title>
          <Text size="sm" c="dimmed">
            {total} logs · page {page} / {totalPages}
          </Text>
        </Stack>

        <Divider />

        {items.length ? (
          <Stack gap="md">
            {items.map((e) => (
              <Link
                key={e.id}
                href={`/projects/${projectId}/log/${e.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card withBorder radius="lg" shadow="sm" padding="md">
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
                      <Text fw={700} lineClamp={1} style={{ flex: 1, minWidth: 0 }}>
                        {e.title}
                      </Text>
                      <Text c="dimmed" size="sm" style={{ whiteSpace: "nowrap" }}>
                        {e.happenedAtLabel}
                      </Text>
                    </Group>

                    {e.photo ? (
                      <Card.Section>
                        <Image src={e.photo.uri} alt={e.photo.alt} height={220} fit="cover" />
                      </Card.Section>
                    ) : null}

                    {e.preview ? (
                      <Text c="dimmed" size="sm" lineClamp={3}>
                        {e.preview}
                      </Text>
                    ) : (
                      <Text c="dimmed" size="sm">
                        No text
                      </Text>
                    )}

                    <Group justify="flex-end">
                      <Text size="sm" c="dimmed">
                        Open →
                      </Text>
                    </Group>
                  </Stack>
                </Card>
              </Link>
            ))}
          </Stack>
        ) : (
          <Text c="dimmed">No log entries yet.</Text>
        )}

        {totalPages > 1 ? (
          <Group justify="center" mt="md">
            <Pagination
              value={page}
              total={totalPages}
              onChange={(p) => {
                window.location.href = buildHref(basePath, p, limit);
              }}
            />
          </Group>
        ) : null}
      </Stack>
    </Container>
  );
}
