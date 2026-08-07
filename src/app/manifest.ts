import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BTS — Bizarro Total Solutions",
    short_name: "BTS",
    description: "Soluções inteligentes, resultados excelentes. Serviços técnicos ao domicílio.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1c2b4a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
