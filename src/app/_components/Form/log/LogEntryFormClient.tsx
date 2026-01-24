import { logEntryForm } from '@/app/_components/Form/log/actions/form-controller';
import { emptyLogEntry } from '@/app/_components/Form/log/const';
import { useRouter } from 'next/navigation';

import { save } from './actions/save';
import { FormProvider } from '@/app/_components/Form/log/actions/form-context';
import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { FormTopBar } from '@/app/_components/Form/common/FormTopBar';
import { DateTimePicker } from '@mantine/dates';
import { LogPhoto } from '@/app/_components/Form/log/LogPhoto';
import { useFormContext } from '@/app/_components/Form/log/actions/form-context';
import { IconCheck } from '@tabler/icons-react';
import { useState } from 'react';

export function LogEntryFormClient(props) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const router = useRouter();
  const initialForm = props.log || emptyLogEntry;
  console.log({ initialForm });
  initialForm.photo ??= { uri: '', caption: '', alt: '' };
  const form = logEntryForm(initialForm);

  const onSubmit = form.onSubmit(async (values) => {
    try {
      setSaving(true);
      setMsg(null);
      await save({
        project: props.project,
        mode: props.mode,
        initialForm,
        values: { ...form.getTransformedValues() },
      });
      router.replace(props.redirectTo);
      router.refresh();
    } catch (e: any) {
      setMsg(e?.message ? `Error: ${e.message}` : 'Error');
      setSaving(false);
    }
  });

  return (
    <FormProvider form={form}>
      <Container size={1000} py='xl'>
        <FormTopBar title='Back' backHref={props.redirectTo} />
        <form onSubmit={onSubmit}>
          <Stack gap='md'>
            <Title order={2}>{props.mode.kind === 'create' ? 'Create log' : 'Log settings'}</Title>
            {msg ? (
              <Text c='red' size='sm'>
                {msg}
              </Text>
            ) : null}
            <Grid gutter='lg'>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Stack gap='md'>
                  <Paper withBorder radius='lg' p='lg'>
                    <Stack gap='md'>
                      <TextInput label='Title' {...form.getInputProps('title')} />
                    </Stack>
                  </Paper>
                  <Paper withBorder radius='lg' p='lg'>
                    <DateTimePicker label='Happened at' {...form.getInputProps('happenedAt')} />
                  </Paper>
                  <Paper withBorder radius='lg' p='lg'>
                    <Textarea
                      label='Description'
                      description='Put Md here'
                      placeholder='Description Md'
                      minRows={2}
                      autosize
                      {...form.getInputProps('contentMd')}
                    />
                  </Paper>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack gap='md'>
                  <Button type='submit' leftSection={<IconCheck size={16} />} loading={saving}>
                    Save
                  </Button>
                  <Paper withBorder radius='lg' p='lg'>
                    <LogPhoto context={useFormContext} fieldName='photo' />
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
