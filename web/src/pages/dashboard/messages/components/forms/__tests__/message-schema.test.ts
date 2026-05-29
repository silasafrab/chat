import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

// Mock date so "now" is fixed for testing
const NOW = new Date("2026-05-29T12:00:00Z");

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

// Import after mocking time so the refine closure captures the fake date
// Actually we need a fresh import each time. Let's use dynamic import or just
// inline, since the schema captures Date at refine time.
// The refine calls `new Date()` inside, so it uses fake timers at parse time.
import { messageFormSchema } from "../message-schema";

describe("messageFormSchema", () => {
  const validBase = {
    title: "Minha mensagem",
    content: "Conteúdo da mensagem",
    connectionId: "conn-1",
    contactIds: ["contact-1", "contact-2"],
    sendNow: true,
    scheduledDate: null,
    scheduledTime: "",
  };

  describe("required fields", () => {
    it("accepts valid data with sendNow", () => {
      const result = messageFormSchema.safeParse(validBase);
      expect(result.success).toBe(true);
    });

    it("rejects empty title", () => {
      const result = messageFormSchema.safeParse({ ...validBase, title: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("title"))).toBe(true);
      }
    });

    it("rejects empty content", () => {
      const result = messageFormSchema.safeParse({ ...validBase, content: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("content"))).toBe(true);
      }
    });

    it("rejects empty connectionId", () => {
      const result = messageFormSchema.safeParse({ ...validBase, connectionId: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("connectionId"))).toBe(true);
      }
    });

    it("rejects empty contactIds", () => {
      const result = messageFormSchema.safeParse({ ...validBase, contactIds: [] });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("contactIds"))).toBe(true);
      }
    });
  });

  describe("scheduling validation", () => {
    it("accepts scheduled date in the future", () => {
      const futureDate = new Date("2026-05-30T10:00:00Z");
      const result = messageFormSchema.safeParse({
        ...validBase,
        sendNow: false,
        scheduledDate: futureDate,
        scheduledTime: "10:00",
      });
      expect(result.success).toBe(true);
    });

    it("rejects scheduled date in the past", () => {
      const pastDate = new Date("2026-05-28T10:00:00Z");
      const result = messageFormSchema.safeParse({
        ...validBase,
        sendNow: false,
        scheduledDate: pastDate,
        scheduledTime: "10:00",
      });
      expect(result.success).toBe(false);
    });

    it("accepts sendNow without scheduledDate", () => {
      const result = messageFormSchema.safeParse({
        ...validBase,
        sendNow: true,
        scheduledDate: null,
        scheduledTime: "",
      });
      expect(result.success).toBe(true);
    });

    it("allows scheduling without date/time if sendNow is true (ignore branch)", () => {
      const result = messageFormSchema.safeParse({
        ...validBase,
        sendNow: true,
        scheduledDate: null,
        scheduledTime: "",
      });
      expect(result.success).toBe(true);
    });
  });
});