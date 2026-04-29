import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7C6FFF 0%, #5A4FDD 100%)",
          borderRadius: 7,
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: 800,
            fontFamily: "sans-serif",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          Y
        </span>
      </div>
    ),
    { ...size }
  );
}
