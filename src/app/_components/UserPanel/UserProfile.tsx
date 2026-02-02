'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine/core';

import { apiPost } from '@/app/_lib/request';
import { UserContext } from '@/app/_components/UserProvider/user-context';
import { IconUser } from '@tabler/icons-react';

export function UserProfile() {
  const router = useRouter();
  const user = useContext(UserContext);
  const isAuthed = Boolean(user?.role);

  return (
    <Menu trigger='hover' openDelay={120} closeDelay={120} position='bottom-end' withinPortal>
      <Menu.Target>
        <UnstyledButton>
          <Group gap={8} wrap='nowrap'>
            <Avatar radius='xl' size={28}>
              {isAuthed ? (user?.email?.[0]?.toUpperCase?.() ?? 'U') : <IconUser size={16} />}
            </Avatar>

            <Text size='sm' fw={500} visibleFrom='sm'>
              {isAuthed ? user?.email : 'Гость'}
            </Text>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {isAuthed ? (
          <Menu.Item
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
          </Menu.Item>
        ) : (
          <Menu.Item component={Link} href='/login'>
            Войти
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
