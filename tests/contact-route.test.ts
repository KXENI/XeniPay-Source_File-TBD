import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/contact/route";

const valid = { name: "Alex Morgan", company: "Example Travel", email: "alex@example.com", industry: "Hotels", message: "Explore settlement" };
function request(body: unknown = valid, origin = "https://xenipay.com") {
  return new Request("https://xenipay.com/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(body) });
}

test("rejects foreign origins, invalid fields and malformed JSON", async () => {
  assert.equal((await POST(request(valid, "https://other.example"))).status, 403);
  assert.equal((await POST(request({ ...valid, email: "bad" }))).status, 400);
  assert.equal((await POST(new Request("https://xenipay.com/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }))).status, 400);
});

test("rejects unsupported media and oversized bodies without Content-Length", async () => {
  assert.equal((await POST(new Request("https://xenipay.com/api/contact", { method: "POST", body: "test" }))).status, 415);
  assert.equal((await POST(request({ ...valid, message: "a".repeat(17000) }))).status, 413);
});

test("never reports success when delivery is not configured", async () => {
  const old = process.env.CONTACT_WEBHOOK_URL;
  delete process.env.CONTACT_WEBHOOK_URL;
  try {
    const response = await POST(request());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).emailFallback, true);
  } finally {
    if (old !== undefined) process.env.CONTACT_WEBHOOK_URL = old;
  }
});

test("reports success only after the provider accepts the lead", async () => {
  const originalFetch = globalThis.fetch;
  const originalEndpoint = process.env.CONTACT_WEBHOOK_URL;
  process.env.CONTACT_WEBHOOK_URL = "https://crm.example.invalid/leads";
  try {
    let delivered = false;
    globalThis.fetch = async (_input, options) => {
      const body = JSON.parse(String(options?.body));
      assert.equal(body.email, valid.email);
      assert.equal(body.source, "xenipay-website");
      assert.equal("website" in body, false);
      assert.equal(options?.redirect, "error");
      delivered = true;
      return new Response(null, { status: 204 });
    };
    const response = await POST(request());
    assert.equal(response.status, 200);
    assert.equal((await response.json()).success, true);
    assert.equal(delivered, true);
    globalThis.fetch = async () => new Response(null, { status: 500 });
    const failure = await POST(request());
    assert.equal(failure.status, 502);
    assert.equal((await failure.json()).emailFallback, true);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalEndpoint === undefined) delete process.env.CONTACT_WEBHOOK_URL;
    else process.env.CONTACT_WEBHOOK_URL = originalEndpoint;
  }
});
