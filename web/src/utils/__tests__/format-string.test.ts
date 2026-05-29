import { describe, it, expect } from "vitest";
import { formatString, unformatString } from "../format-string";

describe("formatString", () => {
  describe("phone", () => {
    it("formats an 11-digit number (mobile with area code)", () => {
      expect(formatString("11999998888", "phone")).toBe("(11) 9 9999-8888");
    });

    it("formats a 10-digit number (landline with area code)", () => {
      expect(formatString("1123456789", "phone")).toBe("(11) 2 3456-789");
    });

    it("formats partial numbers", () => {
      expect(formatString("11", "phone")).toBe("(11");
      expect(formatString("11999", "phone")).toBe("(11) 999");
    });

    it("strips non-digit characters", () => {
      expect(formatString("11 99999-8888", "phone")).toBe("(11) 9 9999-8888");
    });

    it("handles empty string", () => {
      expect(formatString("", "phone")).toBe("(");
    });
  });

  describe("cep", () => {
    it("formats a complete CEP", () => {
      expect(formatString("12345678", "cep")).toBe("12345-678");
    });

    it("formats partial CEP", () => {
      expect(formatString("12345", "cep")).toBe("12345");
    });

    it("strips non-digit characters", () => {
      expect(formatString("12345-678", "cep")).toBe("12345-678");
    });
  });

  describe("unformatString", () => {
    it("removes all non-digit characters", () => {
      expect(unformatString("(11) 99999-8888")).toBe("11999998888");
    });
  });
});