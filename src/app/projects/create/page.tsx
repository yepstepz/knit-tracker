import { notFound } from 'next/navigation';
import { apiGet } from '@/app/_lib/request';
import type { Tag } from '@/types';

import CreateProjectClient from '@/app/projects/create/create-project-client';

export default async function CreateProjectPage() {
  let allTags: Tag[];

  try {
    [allTags] = await Promise.all([apiGet<Tag[]>(`/api/tags`)]);
  } catch {
    notFound();
  }

  return <CreateProjectClient project={{}} allTags={allTags} backHref={'/'} redirectTo={'/'} />;
}
