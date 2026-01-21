import Link from "next/link";
import {
  Badge,
  Card,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { IconArchive, IconClock } from "@tabler/icons-react";

type Photo = { uri: string; alt?: string | null; caption?: string | null };

export type ProjectCardModel = {
  id: string;
  title: string;
  status: string; // например: "draft" | "active" | "done"
  archived?: boolean;
  descriptionMd?: string | null;
  updatedAt: string; // ISO
  cover?: Photo | null;
};

function stripMd(md?: string | null) {
  const s = (md ?? "").trim();
  if (!s) return "";
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function ProjectCard({ p }: { p: ProjectCardModel }) {
  const href = `/projects/${p.id}`;
  const desc = stripMd(p.descriptionMd);

  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <Card withBorder radius="lg" shadow="sm" style={{ position: "relative", overflow: "hidden" }}>
        <Card.Section style={{ position: "relative" }}>
          {p.cover?.uri ? (
            <Image
              src={p.cover.uri}
              alt={p.cover.alt ?? p.cover.caption ?? p.title}
              height={220}
              fit="cover"
            />
          ) : (
            <div
              style={{
                height: 220,
                display: "grid",
                placeItems: "center",
                background: "var(--mantine-color-gray-1)",
              }}
            >
              <Text c="dimmed" size="sm">
                No cover
              </Text>
            </div>
          )}

          {p.archived && (
            <Badge
              leftSection={<IconArchive size={14} />}
              radius="xl"
              variant="light"
              color="red"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 1,
                backgroundColor: "rgba(255, 0, 0, 0.12)",
                border: "1px solid rgba(255, 0, 0, 0.25)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                pointerEvents: "none",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              ARCHIVED
            </Badge>
          )}
        </Card.Section>

        <Stack gap={8} mt="sm">
          <Group justify="space-between" align="flex-start" gap="xs">
            <Text fw={700} lineClamp={2}>
              {p.title}
            </Text>

            <Badge variant="outline" radius="sm">
              {p.status}
            </Badge>
          </Group>

          <Text c="dimmed" size="sm" lineClamp={3}>
            {desc || "No description"}
          </Text>

          <Group gap={6} mt={2} c="dimmed">
            <IconClock size={14} />
            <Text size="xs">Updated: {p.updatedAt}</Text>
          </Group>
        </Stack>
      </Card>
    </Link>
  );
}
