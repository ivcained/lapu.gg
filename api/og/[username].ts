import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get username from the URL path
    const pathParts = req.url.split("/");
    const username = pathParts[pathParts.length - 1] || "Player";

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "#76ADAB",
            backgroundImage: "linear-gradient(135deg, #76ADAB 0%, #5A8A88 100%)",
            height: "100%",
            width: "100%",
            display: "flex",
            color: "white",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              🏝️ Lapu
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              {username} is building a floating city!
            </div>
            <div
              style={{
                fontSize: 32,
                opacity: 0.9,
              }}
            >
              Join the adventure in the sky
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("Error generating image:", e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
