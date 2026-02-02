import { LoginClientPage } from './login-client';

type PageProps = {
  searchParams?: { from?: string };
};

export default async function Login({ searchParams }: PageProps) {
  const from = searchParams?.from;
  return <LoginClientPage from={from} />;
}
