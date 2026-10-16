import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // Browser submissions must originate from this site. Non-browser integrations
  // can omit Origin; the configured ingestion provider should also enforce limits.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "This request could not be verified. Please reload and try again." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Please submit the form as JSON." }, { status: 415 });
  }
  const length = Number(request.headers.get("content-length"));
  if (length > 16000) return NextResponse.json({ error: "Your message is too long." }, { status: 413 });

  let input: unknown;
  try {
    // A streamed limit also covers chunked requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Empty body");
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16000) {
        await reader.cancel();
        return NextResponse.json({ error: "Your message is too long." }, { status: 413 });
      }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return NextResponse.json({ error: "We couldn’t read the request. Please try again." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check your details." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ error: "Your request could not be submitted. Please contact info@xeni.com." }, { status: 400 });

  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) {
    return NextResponse.json({ error: "Online requests are not available yet. You can send these details directly to our team by email.", emailFallback: true }, { status: 503 });
  }

  try {
    const target = new URL(endpoint);
    if (target.protocol !== "https:") throw new Error("HTTPS required");
    const { name, email, company, industry, message } = parsed.data;
    const response = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CONTACT_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify({ name, email, company, industry, message, source: "xenipay-website", submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
      redirect: "error",
    });
    if (!response.ok) throw new Error("Submission failed");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "We couldn’t deliver your request. Please try again or send your details by email.", emailFallback: true }, { status: 502 });
  }
}
