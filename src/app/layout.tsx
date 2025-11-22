import type { Metadata } from "next";

import "~/app/globals.css";
import { Providers } from "~/app/providers";
import {
  APP_NAME,
  APP_DESCRIPTION,
  APP_URL,
  APP_SPLASH_URL,
  APP_BUTTON_TEXT,
} from "~/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    other: {
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl: `${APP_URL}/jsqt-hero.png`,
        button: {
          title: APP_BUTTON_TEXT,
          action: {
            type: "launch_frame",
            name: `Launch ${APP_NAME}`,
            url: APP_URL,
            splashImageUrl: APP_SPLASH_URL,
            splashBackgroundColor: "#e33823",
          },
        },
      }),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="ethereum-provider" content="none" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
