import { ImageResponse } from "next/og"

export const alt = "BTS — Bizarro Total Solutions"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1c2b4a",
          backgroundImage:
            "radial-gradient(circle at 85% 10%, rgba(201,162,39,0.25), transparent 45%), radial-gradient(circle at 5% 95%, rgba(90,169,171,0.25), transparent 45%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 20,
              backgroundColor: "#c9a227",
              color: "#1c2b4a",
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            B
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 56, fontWeight: 800, color: "#ffffff", letterSpacing: -1 }}>
              BTS
            </div>
            <div style={{ fontSize: 24, color: "rgba(255,255,255,0.75)" }}>
              Bizarro Total Solutions
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "#ffffff",
            textAlign: "center",
            maxWidth: 820,
          }}
        >
          Serviços técnicos ao domicílio, sem complicações
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 22,
            color: "#c9a227",
            fontWeight: 600,
          }}
        >
          Eletricidade · Telecomunicações · Carpintaria · e muito mais
        </div>
      </div>
    ),
    { ...size }
  )
}
