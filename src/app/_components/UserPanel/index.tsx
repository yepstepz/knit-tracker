'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Container, Group, Text } from '@mantine/core';

import { apiPost } from '@/app/_lib/request';
import { UserContext } from '@/app/_components/UserProvider/user-context';
import { UserProfile } from '@/app/_components/UserPanel/UserProfile';

function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      variant='light'
      onClick={async () => {
        try {
          await apiPost('/api/users/logout', {}, true);
        } finally {
          window.location.href = '/';
          router.refresh();
        }
      }}
    >
      Выйти
    </Button>
  );
}

function LoginButton() {
  return (
    <Link href='/login'>
      <Button variant='light'>Войти</Button>
    </Link>
  );
}

export function UserPanel() {
  const user = useContext(UserContext);

  return (
    <header>
      <Container size={1000} py={6}>
        <Group justify='flex-end'>
          <UserProfile />
        </Group>
      </Container>
    </header>
  );
}
