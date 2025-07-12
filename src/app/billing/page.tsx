import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/options';
import BillingPageClient from './BillingPageClient';

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      <BillingPageClient session={session} />
    </div>
  );
} 