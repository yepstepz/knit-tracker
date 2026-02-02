'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { Paper, Stack, Text, TextInput, PasswordInput, Button } from '@mantine/core';
import { apiPost } from '@/app/_lib/request';

type LoginClientPageProps = {
  from?: string;
};

export function LoginClientPage({ from }: LoginClientPageProps) {
  const router = useRouter();

  const [err, setErr] = useState<string | null>(null);

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (v.includes('@') ? null : 'Некорректный email'),
      password: (v) => (v ? null : 'Введите пароль'),
    },
  });

  return (
    <Paper maw={420} mx='auto' mt='xl' p='lg' withBorder radius='md'>
      <Text fw={600} mb='md'>
        Вход
      </Text>

      <form
        onSubmit={form.onSubmit(async (v) => {
          setErr(null);
          try {
            await apiPost('/api/users/login', v, true);
            window.location.href = from ?? '/';
          } catch (e: any) {
            setErr(e?.message ?? 'Ошибка');
          }
        })}
      >
        <Stack gap='sm'>
          <TextInput label='Email' {...form.getInputProps('email')} />
          <PasswordInput label='Пароль' {...form.getInputProps('password')} />
          {err && (
            <Text c='red' size='sm'>
              {err}
            </Text>
          )}
          <Button type='submit'>Войти</Button>
        </Stack>
      </form>
    </Paper>
  );
}
