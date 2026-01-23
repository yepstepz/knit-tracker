// src/app/_components/Form/project/ProjectFormClient.tsx
'use client';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Badge,
  Button,
  Container,
  Group,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  Grid,
  MultiSelect,
  Textarea,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconCheck } from '@tabler/icons-react';
import { save } from './actions/save';
import { ProjectFormMode } from '@/app/_components/Form/project/types';
import { ProjectStatus } from '@prisma/client';
import {
  IDEA,
  ACTIVE,
  PAUSED,
  FINISHED,
  ABANDONED,
  defaultCover,
} from '@/app/_components/Form/project/const';
import { normalizeTags } from './_helpers/index';
import { ProjectDetail } from '@/types';
import { FormProvider, useForm, useFormContext } from './actions/form-context';
import { Gallery, CoverImage, FormTopBar } from '@/app/_components/Form/common';
import { projectForm } from '@/app/_components/Form/project/actions/form-controller';

export function ProjectFormClient(props: {
  mode: ProjectFormMode;
  project: ProjectDetail;
  allTags;
  backHref: string;
}) {
  const router = useRouter();
  const allTags = props.allTags.map((t) => t.name);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const statusOptions: ProjectStatus[] = [ACTIVE, FINISHED, PAUSED, ABANDONED, IDEA];

  const p = props.project;
  const backUrl = props.backHref;
  const form = projectForm(p);

  const onSubmit = form.onSubmit(async (values) => {
    setSaving(true);
    setMsg(null);
    try {
      const { goTo } = await save({
        mode: props.mode,
        initialProject: props.project,
        allTags: props.allTags,
        values: { ...form.getTransformedValues() },
      });
      router.replace(goTo);
      router.refresh();
    } catch (e: any) {
      console.log(e);
      setMsg(e?.message ? `Error: ${e.message}` : 'Error');
      setSaving(false);
    }
  });

  return (
    <FormProvider form={form}>
      <Container size={1000} py='xl'>
        <FormTopBar backHref={backUrl} />
        <form onSubmit={onSubmit}>
          <Stack gap='md'>
            <Title order={2}>
              {props.mode.kind === 'create' ? 'Create project' : 'Project settings'}
            </Title>

            {msg ? (
              <Text c='red' size='sm'>
                {msg}
              </Text>
            ) : null}
            <Grid gutter='lg'>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Stack gap='sm'>
                  <Paper withBorder radius='lg' p='lg'>
                    <Stack gap='md'>
                      <TextInput label='Title' {...form.getInputProps('title')} />
                      <Select
                        label='Project status'
                        data={statusOptions.map((s) => ({ value: s, label: s }))}
                        value={form.values.status}
                        onChange={(v) => v && form.setFieldValue('status', v as ProjectStatus)}
                      />
                      {props.mode.kind === 'edit' ? (
                        <Switch
                          label='Archived'
                          {...form.getInputProps('archived', { type: 'checkbox' })}
                        />
                      ) : null}
                    </Stack>
                  </Paper>
                  <Paper withBorder radius='lg' p='lg'>
                    <Textarea
                      label='Description'
                      description='Put Md here'
                      placeholder='Description Md'
                      minRows={2}
                      autosize
                      {...form.getInputProps('descriptionMd')}
                    />
                  </Paper>
                  <Paper withBorder radius='lg' p='lg'>
                    <TextInput
                      label='Yarn Plan'
                      placeholder='Drops 150/100'
                      {...form.getInputProps('yarnPlan')}
                    />
                  </Paper>
                  <Paper withBorder radius='lg' p='lg'>
                    <Stack>
                      <Button
                        variant='light'
                        onClick={() => form.insertListItem('photos', defaultCover, 0)}
                      >
                        Добавить фото
                      </Button>
                      <Gallery
                        photos={form.getInputProps('photos').value}
                        context={useFormContext}
                      />
                    </Stack>
                  </Paper>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack gap='sm'>
                  <Paper withBorder radius='lg' p='lg'>
                    <CoverImage context={useFormContext} />
                  </Paper>
                  <Paper withBorder radius='lg' p='lg'>
                    <MultiSelect
                      label='Tags'
                      placeholder='Type and press Enter'
                      data={allTags}
                      value={form.values.tags}
                      onChange={(v) => form.setFieldValue('tags', normalizeTags(v))}
                      comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                      searchable
                      clearable
                    />
                  </Paper>
                  <Paper withBorder radius='lg' p='lg'>
                    <Stack gap='md'>
                      <DateTimePicker
                        clearable
                        label='Started at'
                        value={form.values.startedAt}
                        onChange={(v) => form.setFieldValue('startedAt', v)}
                      />
                      <DateTimePicker
                        clearable
                        label='Finished at'
                        value={form.values.finishedAt}
                        onChange={(v) => form.setFieldValue('finishedAt', v)}
                      />
                    </Stack>
                  </Paper>
                </Stack>
              </Grid.Col>
            </Grid>
            <Group justify='flex-end'>
              <Button type='submit' leftSection={<IconCheck size={16} />} loading={saving}>
                Save
              </Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </FormProvider>
  );
}
