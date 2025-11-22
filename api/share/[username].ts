import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    // Get username from the URL path
    const pathParts = req.url.split("/");
    const username = pathParts[pathParts.length - 1] || "Player";

    // Get the base URL
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Generate HTML with Farcaster metadata
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lapu - ${username}'s Floating City</title>
  <meta name="description" content="${username} is building a floating city in Lapu! Join the adventure in the sky.">

  <!-- Farcaster Miniapp Metadata -->
  <meta property="fc:miniapp" content='${JSON.stringify({
    version: "1",
    imageUrl: `${baseUrl}/api/og/${username}`,
    button: {
      title: "Play Lapu",
      action: {
        name: "Launch Lapu",
        type: "launch_frame",
        url: baseUrl,
      },
    },
  })}' />

  <!-- Open Graph / Social -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url.toString()}">
  <meta property="og:title" content="Lapu - ${username}'s Floating City">
  <meta property="og:description" content="${username} is building a floating city in Lapu! Join the adventure in the sky.">
  <meta property="og:image" content="${baseUrl}/api/og/${username}">

  <!-- Redirect to main app after a short delay -->
  <meta http-equiv="refresh" content="0;url=${baseUrl}">

  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #76ADAB 0%, #5A8A88 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }
    .container {
      max-width: 600px;
      padding: 2rem;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.5rem;
      opacity: 0.9;
    }
    .redirect-note {
      margin-top: 2rem;
      font-size: 1rem;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🏝️ Lapu</h1>
    <p>${username} is building a floating city!</p>
    <p class="redirect-note">Redirecting to the app...</p>
  </div>
</body>
</html>
    `.trim();

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  } catch (e) {
    console.error("Error generating share page:", e);
    return new Response(`Failed to generate share page`, {
      status: 500,
    });
  }
}
