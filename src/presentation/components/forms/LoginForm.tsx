import { LoginViewModel } from '@/presentation/view-models';
import Link from 'next/link';

// Icons
const LoadingSpinner = () => (
  <svg
    className="animate-spin w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Google Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Book Icon for branding
const BookIcon = () => (
  <svg
    className="w-8 h-8 text-emerald-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
    />
  </svg>
);

interface LoginFormProps {
  viewModel: LoginViewModel;
}

/**
 * LoginForm Component
 *
 * Modern mobile-first login form dengan Google authentication.
 */
export function LoginForm({ viewModel }: LoginFormProps) {
  const { isLoading, error, handleGoogleLogin } = viewModel;

  return (
    <div className="w-full max-w-md mx-auto px-6">
      {/* Logo & Branding */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6">
          <BookIcon />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Masuk ke ISHARI
        </h1>
        <p className="text-slate-500">
          Akses koleksi kitab digital dan fitur premium
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingSpinner /> : <GoogleIcon />}
          {isLoading ? 'Memproses...' : 'Lanjutkan dengan Google'}
        </button>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-slate-400">
              atau
            </span>
          </div>
        </div>

        {/* Continue as Guest */}
        <Link
          href="/"
          className="w-full flex items-center justify-center py-4 px-6 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium rounded-2xl transition-colors"
        >
          Lanjutkan sebagai Tamu
        </Link>

        {/* Terms */}
        <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed">
          Dengan masuk, Anda menyetujui{' '}
          <span className="text-emerald-600 hover:underline cursor-pointer">
            Ketentuan Layanan
          </span>{' '}
          dan{' '}
          <span className="text-emerald-600 hover:underline cursor-pointer">
            Kebijakan Privasi
          </span>{' '}
          kami.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-400">ISHARI v1.0.0</p>
      </div>
    </div>
  );
}
