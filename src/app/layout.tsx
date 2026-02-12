// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { UserProvider } from '@/app/_components/UserProvider';
import { Header } from '@/app/_components/Header';

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <UserProvider>
          <MantineProvider>
            <Header />
            <ModalsProvider>{children}</ModalsProvider>
          </MantineProvider>
        </UserProvider>
      </body>
    </html>
  );
}
