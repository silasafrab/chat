import { describe, it, expect } from "vitest";
import { getConnectionTypeIcon, connectionTypeMap, connectionTypes } from "../connection-types";

describe("connection-types", () => {
  describe("connectionTypeMap", () => {
    it("has all connection types", () => {
      expect(Object.keys(connectionTypeMap)).toEqual(["whatsapp", "telegram", "sms", "email"]);
    });

    it("whatsapp has correct label", () => {
      expect(connectionTypeMap.whatsapp.label).toBe("WhatsApp");
    });

    it("telegram has correct label", () => {
      expect(connectionTypeMap.telegram.label).toBe("Telegram");
    });

    it("sms has correct label", () => {
      expect(connectionTypeMap.sms.label).toBe("SMS");
    });

    it("email has correct label", () => {
      expect(connectionTypeMap.email.label).toBe("Email");
    });
  });

  describe("connectionTypes", () => {
    it("exports all types as value/label pairs", () => {
      expect(connectionTypes).toEqual([
        { value: "whatsapp", label: "WhatsApp" },
        { value: "telegram", label: "Telegram" },
        { value: "sms", label: "SMS" },
        { value: "email", label: "Email" },
      ]);
    });
  });

  describe("getConnectionTypeIcon", () => {
    it("returns correct icon for whatsapp", () => {
      expect(getConnectionTypeIcon("whatsapp")).toBe("whatsapp");
    });

    it("returns correct icon for email", () => {
      expect(getConnectionTypeIcon("email")).toBe("email-fill");
    });

    it("returns correct icon for sms", () => {
      expect(getConnectionTypeIcon("sms")).toBe("mobile-chat");
    });

    it("returns correct icon for telegram", () => {
      expect(getConnectionTypeIcon("telegram")).toBe("telegram");
    });
  });
});