import test from "node:test";
import assert from "node:assert/strict";

test("public asset paths remain root-relative outside a subpath deployment", async () => {
  const { assetPath } = await import("../src/lib/asset-path");
  assert.equal(assetPath("/brand/xenipay-light.svg"), "/brand/xenipay-light.svg");
  assert.equal(assetPath("product/map.svg"), "/product/map.svg");
});
