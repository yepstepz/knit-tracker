'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/app/_lib/request';
import { Button, Grid, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { ColorInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck } from '@tabler/icons-react';

type TagFormValues = {
  name: string;
  color: string;
};

export function TagFormClient() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const form = useForm<TagFormValues>({
    mode: 'controlled',
    initialValues: {
      name: '',
      color: '#FFFFFF',
    },
    validate: {
      name: (v) => (v.trim() ? null : 'Name is required'),
    },
  });

  const onSubmit = form.onSubmit(async (values) => {
    try {
      setSaving(true);
      setMsg(null);
      await apiPost('/api/tags', {
        name: values.name.trim(),
        color: values.color?.trim() || null,
      });
      form.setValues({ name: '', color: '#FFFFFF' });
      router.refresh();
    } catch (e: any) {
      setMsg(e?.message ? `Error: ${e.message}` : 'Error');
      setSaving(false);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack gap='md'>
        <Title order={3}>Create tag</Title>
        {msg ? (
          <Text c='red' size='sm'>
            {msg}
          </Text>
        ) : null}
        <Grid gutter='lg'>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper withBorder radius='lg' p='lg'>
              <Stack gap='md'>
                <TextInput label='Name' placeholder='Tag name' {...form.getInputProps('name')} />
                <ColorInput
                  label='Color'
                  format='hex'
                  swatches={[
                    '#FF6B6B',
                    '#F06595',
                    '#CC5DE8',
                    '#845EF7',
                    '#5C7CFA',
                    '#339AF0',
                    '#22B8CF',
                    '#20C997',
                    '#51CF66',
                    '#94D82D',
                    '#FCC419',
                    '#FF922B',
                  ]}
                  {...form.getInputProps('color')}
                />
              </Stack>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Group>
              <Button type='submit' leftSection={<IconCheck size={16} />} loading={saving}>
                Create
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Stack>
    </form>
  );
}
