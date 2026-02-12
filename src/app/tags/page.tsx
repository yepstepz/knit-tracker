import { apiGetCached } from '@/app/_lib/request';
import type { Tag } from '@/types';
import { TagsClient } from './tags-client';

export default async function TagsPage() {
  const tags = await apiGetCached<Tag[]>(`/api/tags`, { revalidate: 60 * 60 * 24 * 30 });
  return <TagsClient tags={tags} />;
}
