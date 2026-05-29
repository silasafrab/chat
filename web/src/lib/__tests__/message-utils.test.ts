import { describe, it, expect } from "vitest";
import { getMessageDisplayStatus } from "../message-utils";
import type { Message } from "@/types/message";

const baseMessage: Message = {
  id: "msg-1",
  title: "Teste",
  content: "Conteúdo",
  connectionId: "conn-1",
  contactIds: ["c1"],
  userId: "user-1",
  status: "scheduled",
  scheduledAt: new Date("2026-05-30T10:00:00"),
  createdAt: new Date("2026-05-29T10:00:00"),
};

describe("getMessageDisplayStatus", () => {
  it("returns 'sent' when message status is sent", () => {
    const result = getMessageDisplayStatus(
      { ...baseMessage, status: "sent" },
      true,
    );
    expect(result).toBe("sent");
  });

  it("returns 'scheduled' when connection is active", () => {
    const result = getMessageDisplayStatus(
      { ...baseMessage, status: "scheduled" },
      true,
    );
    expect(result).toBe("scheduled");
  });

  it("returns 'blocked' when scheduled and connection is inactive", () => {
    const result = getMessageDisplayStatus(
      { ...baseMessage, status: "scheduled" },
      false,
    );
    expect(result).toBe("blocked");
  });

  it("returns 'sent' when sent even if connection is inactive", () => {
    const result = getMessageDisplayStatus(
      { ...baseMessage, status: "sent" },
      false,
    );
    expect(result).toBe("sent");
  });

  it("returns 'blocked' when blocked irrespective of connection", () => {
    const result = getMessageDisplayStatus(
      { ...baseMessage, status: "blocked" },
      true,
    );
    expect(result).toBe("blocked");
  });
});