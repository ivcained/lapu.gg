import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getNeynarUser } from "~/lib/neynar";
import { getUserSquatStats } from "~/lib/squats-db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get("fid");
    const squats = searchParams.get("squats");
    const calories = searchParams.get("calories");
    const isSessionShare = squats && calories;

    const user = fid ? await getNeynarUser(Number(fid)) : null;
    const squatData = fid ? await getUserSquatStats(Number(fid)) : null;

    // For session-specific shares, show session details
    if (isSessionShare) {
      return new ImageResponse(
        (
          <div
            style={{
              display: "flex",
              height: "100%",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "64px",
                color: "white",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              {user?.display_name ?? user?.username ?? "User"}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "32px",
                color: "white",
                opacity: 0.9,
                marginBottom: "32px",
              }}
            >
              just completed a session! 💪
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "48px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "24px",
                padding: "32px",
                border: "4px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "72px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {squats}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Squats
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "72px",
                    fontWeight: "bold",
                    color: "#fcd34d",
                  }}
                >
                  {calories}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Calories
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "72px",
                    fontWeight: "bold",
                    color: "#86efac",
                  }}
                >
                  +{squats}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Points
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "24px",
                marginTop: "32px",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Join me on Lapu! 🏋️
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 800,
        }
      );
    }

    // For general profile shares, show total stats
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "72px",
              color: "white",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            {user?.display_name ?? user?.username ?? "User"}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "40px",
              color: "white",
              opacity: 0.9,
              marginBottom: "32px",
            }}
          >
            just crushed it at Lapu! 💪
          </div>

          {squatData && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "48px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "24px",
                padding: "32px",
                border: "4px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "80px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {squatData.totalSquats}
                </div>
                <div
                  style={{
                    fontSize: "32px",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Total Score
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "80px",
                    fontWeight: "bold",
                    color: "#fcd34d",
                  }}
                >
                  {squatData.jsqtPoints}
                </div>
                <div
                  style={{
                    fontSize: "32px",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Points
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              fontSize: "32px",
              marginTop: "32px",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Join the adventure! 🏝️
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    // Return a simple fallback image
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "64px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Lapu
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "32px",
              color: "white",
              marginTop: "16px",
            }}
          >
            Explore floating islands! 🏝️
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
      }
    );
  }
}
