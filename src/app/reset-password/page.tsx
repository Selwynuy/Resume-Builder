import ResetPasswordClient from './ResetPasswordClient';

interface ResetPasswordPageProps {
  searchParams: { token?: string };
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  return <ResetPasswordClient token={searchParams.token} />;
} 