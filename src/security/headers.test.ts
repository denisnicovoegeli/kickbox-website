import { describe, expect, it } from "vitest";
import { buildCsp } from "./headers";

describe("buildCsp", () => {
  it("allows scripts only with the nonce in production", () => {
    const csp = buildCsp("abc", false);
    expect(csp).toContain("script-src 'self' 'nonce-abc' 'strict-dynamic'");
    expect(csp).not.toContain("unsafe-inline");
    expect(csp).not.toContain("unsafe-eval");
  });

  it("forbids framing", () => {
    expect(buildCsp("abc", false)).toContain("frame-ancestors 'none'");
  });

  it("allows eval only in development", () => {
    expect(buildCsp("abc", true)).toContain("'unsafe-eval'");
  });
});
