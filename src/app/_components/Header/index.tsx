'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  Stack,
  Title,
} from '@mantine/core';
import { UserProfile } from '@/app/_components/UserPanel/UserProfile';

const navItems = [
  { label: 'Projects', href: '/' },
  { label: 'Tags', href: '/tags' },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header>
      <Container size={1000} py={8}>
        <Group justify='space-between' align='center' wrap='nowrap'>
          <Group gap='sm' wrap='nowrap'>
            <Burger hiddenFrom='sm' opened={open} onClick={() => setOpen((v) => !v)} size='sm' />
            <Group visibleFrom='sm'>
              <Link href='/' aria-label='Knit Tracker' style={{ display: 'inline-flex' }}>
                <Image src='/logo.png' alt='Knit Tracker' width={36} height={36} priority />
              </Link>
            </Group>
          </Group>

          <Group gap={6} wrap='nowrap'>
            <Group gap={6} visibleFrom='sm'>
              {navItems.map((item) => {
                const active =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                    <Button variant={active ? 'light' : 'subtle'} size='sm'>
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </Group>
            <UserProfile />
          </Group>
        </Group>
      </Container>

      <Drawer
        opened={open}
        onClose={() => setOpen(false)}
        title='Navigation'
        size='xs'
        hiddenFrom='sm'
      >
        <Stack gap='xs'>
          {navItems.map((item) => (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              variant='subtle'
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Drawer>
    </header>
  );
}
