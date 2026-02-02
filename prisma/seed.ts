async function main() {
  const mode = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

  if (mode === 'prod') {
    await import('./seed.prod'); // seed.prod.ts сам запускается как твой dev
    return;
  }

  await import('./seed.dev'); // seed.dev.ts (твой текущий dev seed) сам запускается
}

console.log('Generating seed...');
main().catch((e) => {
  console.error('❌ Seed dispatcher failed:', e);
  process.exit(1);
});
