import { afterEach, describe, expect, it } from "vitest";
import { readEnv } from "@/lib/readEnv";

describe("readEnv", () => {
  afterEach(() => {
    delete process.env.__TEST_READENV__;
  });

  it("returns the value when the variable is set", () => {
    process.env.__TEST_READENV__ = "hello";
    expect(readEnv("__TEST_READENV__")).toBe("hello");
  });

  it("throws when the variable is missing or empty", () => {
    expect(() => readEnv("__TEST_READENV_MISSING__")).toThrow(/Missing __TEST_READENV_MISSING__/);
  });
});
