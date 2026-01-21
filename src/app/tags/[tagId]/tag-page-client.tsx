"use client";

import Link from "next/link";
import { Badge, Button, Container, Group, Pagination, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { ProjectCard } from "@/app/_components";
import type { Tag, ProjectDetail } from "@/types";

export default function TagPageClient({
                                        tagId,
                                        tag,
                                        archived,
                                        total,
                                        page,
                                        totalPages,
                                        hrefForPage,
                                        projects,
                                      }: {
  tagId: string;
  tag: Tag;
  archived: boolean;
  total: number;
  page: number;
  totalPages: number;
  hrefForPage: (p: number) => string;
  projects: ProjectDetail[];
}) {
  return (
    <Container size={1100} py="xl">
      <Stack gap="lg">
        {/* Top bar */}
        <Group justify="space-between" align="center" wrap="wrap">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Projects
            </Button>
          </Link>

          {archived ? (
            <Badge color="red" variant="light" radius="sm">
              Archived
            </Badge>
          ) : null}
        </Group>

        {/* Head */}
        <Stack gap={6}>
          <Text size="sm" c="dimmed">
            Tag
          </Text>

          <Group justify="space-between" align="baseline" wrap="wrap" gap="sm">
            <Title order={2}>{tag.name}</Title>

            <Badge
              variant="light"
              radius="sm"
              // если у тебя tag.color реально hex — можно так:
              color={typeof (tag as any).color === "string" && (tag as any).color ? undefined : "gray"}
              style={
                (tag as any).color
                  ? { backgroundColor: (tag as any).color, color: "white" }
                  : undefined
              }
            >
              {tag.name}
            </Badge>
          </Group>

          <Text size="sm" c="dimmed">
            {total} projects · page {page} / {totalPages}
          </Text>
        </Stack>

        {/* Grid */}
        {projects.length ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {projects.map((p) => (
              <ProjectCard key={p.id} p={p as any} />
            ))}
          </SimpleGrid>
        ) : (
          <Text c="dimmed">No projects for this tag.</Text>
        )}

        {/* Pagination */}
        {totalPages > 1 ? (
          <Group justify="center" mt="md">
            <Pagination
              value={page}
              total={totalPages}
              onChange={(p) => {
                window.location.href = hrefForPage(p);
              }}
            />
          </Group>
        ) : null}
      </Stack>
    </Container>
  );
}
