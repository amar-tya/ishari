import React, { Suspense } from 'react';
import { PublicDashboard, HomeLanding } from '@/presentation/components/public';

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex-1 w-full flex items-center justify-center p-12">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
    </div>
  );
}

// Page component that decides what to show based on URL params
export default async function PublicPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const hasChapterId = params?.id;

  // If no chapter ID, show the landing page
  if (!hasChapterId) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <HomeLanding />
      </Suspense>
    );
  }

  // If has chapter ID, show the reader
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PublicDashboard />
    </Suspense>
  );
}
