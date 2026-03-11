import React, { Suspense } from 'react';
import { BookmarkList } from '@/presentation/components/public';

export default function BookmarkPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-20">
          <div className="animate-spin size-10 border-4 border-[#51c878] border-t-transparent rounded-full" />
        </div>
      }
    >
      <BookmarkList />
    </Suspense>
  );
}
