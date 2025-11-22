import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function AuthButton() {
  const { isAuthenticated, userData, isLoading, signIn, signOut, error } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        <span>Authenticating...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={signIn}
        >
          Sign In with Farcaster
        </button>
        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-800">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium text-gray-900">
          FID: {userData?.fid}
        </div>
        <div className="text-xs text-gray-500">Authenticated</div>
      </div>
      <button
        type="button"
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={signOut}
      >
        Sign Out
      </button>
    </div>
  );
}
