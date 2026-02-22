'use client';

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
  NumberInput,
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
import { normalizeTags } from '../common/utils';
import { ProjectDetail, Tag } from '@/types';
import { FormProvider, useFormContext } from './actions/form-context';
import { FormTopBar } from '@/app/_components/Form/common/FormTopBar';
import { projectForm } from '@/app/_components/Form/project/actions/form-controller';
import { Gallery } from './Gallery';
import { CoverImage } from './Cover';

type ProjectFormClientProps = {
  mode: ProjectFormMode;
  project?: ProjectDetail;
  allTags: Tag[];
  backHref: string;
};

export function ProjectFormClient(props: ProjectFormClientProps) {
  const router = useRouter();
  const allTags = props.allTags.map((t) => t.name);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const statusOptions: ProjectStatus[] = [ACTIVE, FINISHED, PAUSED, ABANDONED, IDEA];

  const initialProject: Partial<ProjectDetail> = props.project ?? {};
  const backUrl = props.backHref;
  const form = projectForm(initialProject);

  const onSubmit = form.onSubmit(async (values) => {
    setSaving(true);
    setMsg(null);
    try {
      const { goTo } = await save({
        mode: props.mode,
        initialProject,
        allTags: props.allTags,
        values: { ...form.getTransformedValues() },
      });
      router.replace(goTo);
      router.refresh();
    } catch (e: any) {
      setMsg(e?.message ? `Error: ${e.message}` : 'Error');
      setSaving(false);
    }
  });

  return (
    <FormProvider form={form}>
      <Container size={1000} py='xl'>
        <FormTopBar title='Back' backHref={backUrl} />
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
                    <Stack gap='md'>
                      <TextInput
                        label='Needles'
                        placeholder='3.5 mm, 5.0 mm'
                        {...form.getInputProps('needles')}
                      />
                      <Grid gutter='sm'>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <Stack gap='xs'>
                            <Text size='sm' fw={600}>
                              Current gauge
                            </Text>
                            <Group gap='xs'>
                              <NumberInput
                                label='Stitches'
                                min={0}
                                clampBehavior='strict'
                                allowNegative={false}
                                {...form.getInputProps('currentGaugeStitches')}
                              />
                              <NumberInput
                                label='Rows'
                                min={0}
                                clampBehavior='strict'
                                allowNegative={false}
                                {...form.getInputProps('currentGaugeRows')}
                              />
                            </Group>
                          </Stack>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <Stack gap='xs'>
                            <Text size='sm' fw={600}>
                              Pattern gauge
                            </Text>
                            <Group gap='xs'>
                              <NumberInput
                                label='Stitches'
                                min={0}
                                clampBehavior='strict'
                                allowNegative={false}
                                {...form.getInputProps('patternGaugeStitches')}
                              />
                              <NumberInput
                                label='Rows'
                                min={0}
                                clampBehavior='strict'
                                allowNegative={false}
                                {...form.getInputProps('patternGaugeRows')}
                              />
                            </Group>
                          </Stack>
                        </Grid.Col>
                      </Grid>
                    </Stack>
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
                        photos={form.values.photos}
                        context={useFormContext}
                      />
                    </Stack>
                  </Paper>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack gap='sm'>
                  <Button type='submit' leftSection={<IconCheck size={16} />} loading={saving}>
                    Save
                  </Button>
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
                        {...form.getInputProps('startedAt')}
                      />
                      <DateTimePicker
                        clearable
                        label='Finished at'
                        value={form.values.finishedAt}
                        {...form.getInputProps('finishedAt')}
                      />
                    </Stack>
                  </Paper>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </form>
      </Container>
    </FormProvider>
  );
}
