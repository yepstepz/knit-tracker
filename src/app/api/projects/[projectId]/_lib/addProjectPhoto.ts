import "server-only";
import { prisma } from "@/lib/prisma";
import { created, badRequest } from "@/server/helpers/http";
import { parseCreatePhotoInput } from "@/server/helpers/photo";

export async function addProjectPhoto(projectId: string, body: unknown) {
  if (!projectId) return badRequest("projectId required");

  const parsed = await parseCreatePhotoInput(body, {
    orderScope: { projectId },
  });

  if (!parsed.ok) return badRequest(parsed.error);

  const photo = await prisma.photo.create({
    data: {
      projectId,
      ...parsed.value,
    },
  });

  return created(photo);
}
