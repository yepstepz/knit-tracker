import "server-only";
import { prisma } from "@/lib/prisma";
import { created, badRequest } from "@/server/helpers/http";
import { parseCreatePhotoInput } from "@/server/helpers/photo";
import { PhotoRole } from "@prisma/client";

export async function addProjectPhoto(projectId: string, body: unknown) {
  if (!projectId) return badRequest("[projectId] required");

  const parsed = await parseCreatePhotoInput(body, {
    orderScope: { projectId },
  });
  if (!parsed.ok) return badRequest(parsed.error);

  const input = parsed.value;

  const photo = await prisma.$transaction(async (tx) => {
    if (input.role === PhotoRole.COVER) {
      await tx.photo.updateMany({
        where: {
          projectId,
          role: PhotoRole.COVER,
        },
        data: { role: PhotoRole.GALLERY },
      });
    }

    return tx.photo.create({
      data: {
        projectId,
        ...input, // uri, caption, alt (default=caption), role, sortOrder
      },
    });
  });

  return created(photo);
}
