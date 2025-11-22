"use client";

import { MiniAppProvider } from "@neynar/react";
import { ANALYTICS_ENABLED, RETURN_URL } from "~/lib/constants";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MiniAppProvider
      analyticsEnabled={ANALYTICS_ENABLED}
      backButtonEnabled={true}
      returnUrl={RETURN_URL}
    >
      {children}
    </MiniAppProvider>
  );
}
