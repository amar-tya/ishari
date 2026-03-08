import React from 'react';
import Link from 'next/link';

export const GlobalFooter = () => {
  const creatorName = process.env.NEXT_PUBLIC_CREATOR_NAME || 'ISHARI Team';
  const creatorEmail =
    process.env.NEXT_PUBLIC_CREATOR_EMAIL || 'contact@ishari.id';

  return (
    <footer className="w-full py-8 mt-auto bg-slate-50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <span className="font-bold text-slate-900">ISHARI</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6 text-sm">
            <Link href="/muhud" className="text-slate-600 hover:text-emerald-600 transition-colors">
              Muhud
            </Link>
            <Link href="/diba" className="text-slate-600 hover:text-emerald-600 transition-colors">
              Diba
            </Link>
            <Link href="/kitab" className="text-slate-600 hover:text-emerald-600 transition-colors">
              Kitab
            </Link>
            <Link href="/intro" className="text-slate-600 hover:text-emerald-600 transition-colors">
              Tentang
            </Link>
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {creatorName}. Semua hak dilindungi.
          </p>
          <a
            href={`mailto:${creatorEmail}`}
            className="text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {creatorEmail}
          </a>
        </div>
      </div>
    </footer>
  );
};
