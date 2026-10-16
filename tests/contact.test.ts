import test from "node:test";
import assert from "node:assert/strict";
import { contactSchema, createEmailLink } from "../src/lib/contact";

const valid = { name: "Alex Morgan", company: "Example Travel", email: "alex@example.com", industry: "Travel agents", message: "Explore settlement" };

test("validates and normalizes contact details", () => {
  const result = contactSchema.parse({ ...valid, name: "  Alex Morgan  " });
  assert.equal(result.name, "Alex Morgan");
});

test("rejects invalid email, unknown industry and oversized messages", () => {
  assert.equal(contactSchema.safeParse({ ...valid, email: "bad-email" }).success, false);
  assert.equal(contactSchema.safeParse({ ...valid, industry: "Unknown" }).success, false);
  assert.equal(contactSchema.safeParse({ ...valid, message: "a".repeat(3001) }).success, false);
});

test("email draft safely encodes special characters without creating headers", () => {
  const link = createEmailLink({ ...valid, industry: "Travel agents", company: "Travel & Co?", message: "Hello\n&bcc=other@example.com" });
  const url = new URL(link);
  assert.equal(url.pathname, "info@xeni.com");
  assert.equal(url.searchParams.get("subject"), "XeniPay demo request — Travel & Co?");
  assert.equal(url.searchParams.has("bcc"), false);
  assert.ok(url.searchParams.get("body")?.includes("&bcc=other@example.com"));
});
