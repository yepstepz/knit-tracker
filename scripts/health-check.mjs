const base = 'http://localhost:3000';

async function mustOk(path) {
  const r = await fetch(base + path);
  const text = await r.text();
  if (!r.ok) throw new Error(`${path} -> ${r.status}\n${text}`);
  return text ? JSON.parse(text) : null;
}

(async () => {
  const projects = await mustOk('/api/projects');
  if (!Array.isArray(projects)) throw new Error('projects is not an array');

  if (projects.length === 0) {
    console.log('OK: /api/projects returned [] (seed not loaded?)');
    return;
  }

  const id = projects[0].id;
  if (!id) throw new Error('project.id missing');

  await mustOk(`/api/projects/${id}`);
  await mustOk(`/api/projects/${id}/log`);
  await mustOk(`/api/projects/${id}/photos`);

  console.log('Health Check OK');
})().catch((e) => {
  console.error('Health Check FAIL\n', e);
  process.exit(1);
});
