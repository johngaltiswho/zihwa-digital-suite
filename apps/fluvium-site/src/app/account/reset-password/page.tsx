import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResetPasswordForm from './ResetPasswordForm';

interface ResetPasswordPageProps {
  searchParams?: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const initialToken = resolvedSearchParams.token ?? '';

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <div className="pt-28 px-6 pb-16">
        <ResetPasswordForm initialToken={initialToken} />
      </div>
      <Footer />
    </main>
  );
}
