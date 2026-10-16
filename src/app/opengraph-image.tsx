import { ImageResponse } from "next/og";

export const alt = "XeniPay — Travel moves fast. Your money should too.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", background: "radial-gradient(120% 80% at 50% 0%, #302A47 0%, #191529 70%)", color: "#F3F1FB", fontFamily: "sans-serif" }}><div style={{ display: "flex", fontSize: 32, color: "#C9B8F8", marginBottom: 65 }}>XeniPay</div><div style={{ display: "flex", fontSize: 69, letterSpacing: -3 }}>Travel moves fast.</div><div style={{ display: "flex", fontSize: 69, letterSpacing: -3, color: "#C9B8F8" }}>Your money should too.</div><div style={{ display: "flex", fontSize: 23, color: "#A19DB9", marginTop: 35 }}>Better connected. Better settled.</div><div style={{ display: "flex", position: "absolute", right: 70, bottom: 65, color: "#5B478A", fontSize: 70 }}>↗</div></div>, size);
}
