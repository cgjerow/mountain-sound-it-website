import { test } from "./index.js";
import { describe, it, expect } from "@jest/globals";

describe("one", () => {
  it("works", () => {
    expect(test()).toEqual(true);
  });
});
