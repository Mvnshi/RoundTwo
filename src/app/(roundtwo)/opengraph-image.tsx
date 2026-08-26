import { ImageResponse } from "next/og";

import { brand, seo } from "@/lib/site";

export const alt = seo.shortTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F6F4EF",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: "#171816",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D9FF43" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, color: "#171816", letterSpacing: "-0.03em" }}>
            {brand.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: "#77786F",
              display: "flex",
            }}
          >
            You already paid for the lead.
          </div>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: "#171816",
              display: "flex",
              marginTop: 6,
            }}
          >
            Get another shot at the job.
          </div>
          <div
            style={{
              marginTop: 18,
              width: 268,
              height: 10,
              background: "#D9FF43",
              display: "flex",
            }}
          />
        </div>

        <div style={{ fontSize: 26, color: "#63645C", display: "flex" }}>
          {brand.descriptor}
        </div>
      </div>
    ),
    size,
  );
}
