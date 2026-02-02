'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '@/app/_lib/request';
import { UserContext } from '@/app/_components/UserProvider/user-context';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    apiGet('/api/users/me')
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
