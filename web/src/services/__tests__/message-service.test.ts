import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CreateMessageData, UpdateMessageData } from "@/types/message";

const { mockAddDoc, mockUpdateDoc, mockDeleteDoc, mockDoc, mockCollection } =
  vi.hoisted(() => ({
    mockAddDoc: vi.fn(),
    mockUpdateDoc: vi.fn(),
    mockDeleteDoc: vi.fn(),
    mockDoc: vi.fn((_db: unknown, _collection: string, id?: string) => ({ id })),
    mockCollection: vi.fn((_db: unknown, name: string) => name),
  }));

// Mock Firebase modules before importing the service
vi.mock("@/firebase/config", () => ({
  db: {},
  auth: {
    currentUser: { uid: "test-user" },
  },
}));

vi.mock("firebase/firestore", () => ({
  collection: mockCollection,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
  query: vi.fn((q: unknown) => q),
  where: vi.fn(() => "where-clause"),
  onSnapshot: vi.fn((_q: unknown, cb: (snapshot: { docs: unknown[] }) => void) => {
    cb({ docs: [] });
    return vi.fn();
  }),
}));

// Clear mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});

// Import AFTER mocks are set up
const { messageService } = await import("../message-service");

describe("messageService", () => {
  describe("create", () => {
    it("creates with status 'sent' when no scheduledAt", async () => {
      const data: CreateMessageData = {
        title: "Teste",
        content: "Conteúdo",
        connectionId: "conn-1",
        contactIds: ["c1"],
        scheduledAt: null,
      };

      await messageService.create(data);

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          title: "Teste",
          content: "Conteúdo",
          connectionId: "conn-1",
          contactIds: ["c1"],
          scheduledAt: null,
          userId: "test-user",
          status: "sent",
          createdAt: expect.any(Date),
        }),
      );
    });

    it("creates with status 'scheduled' when scheduledAt is provided", async () => {
      const scheduledAt = new Date("2026-05-30T10:00:00");
      const data: CreateMessageData = {
        title: "Agendada",
        content: "Conteúdo",
        connectionId: "conn-1",
        contactIds: ["c1", "c2"],
        scheduledAt,
      };

      await messageService.create(data);

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          title: "Agendada",
          content: "Conteúdo",
          connectionId: "conn-1",
          contactIds: ["c1", "c2"],
          scheduledAt,
          userId: "test-user",
          status: "scheduled",
          createdAt: expect.any(Date),
        }),
      );
    });

    it("throws when user is not authenticated", async () => {
      // Temporarily override auth to return null
      const { auth } = await import("@/firebase/config");
      Object.defineProperty(auth, "currentUser", {
        value: null,
        configurable: true,
        writable: true,
      });

      const data: CreateMessageData = {
        title: "Teste",
        content: "Conteúdo",
        connectionId: "conn-1",
        contactIds: [],
        scheduledAt: null,
      };

      await expect(messageService.create(data)).rejects.toThrow(
        "Usuário não autenticado",
      );

      // Restore
      Object.defineProperty(auth, "currentUser", {
        value: { uid: "test-user" },
        configurable: true,
        writable: true,
      });
    });
  });

  describe("update", () => {
    it("updates message fields without changing status if no scheduledAt", async () => {
      const data: UpdateMessageData = {
        title: "Atualizado",
        content: "Novo conteúdo",
        connectionId: "conn-1",
        contactIds: ["c1"],
      };

      await messageService.update("msg-1", data);

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          title: "Atualizado",
          content: "Novo conteúdo",
          connectionId: "conn-1",
          contactIds: ["c1"],
        }),
      );
    });

    it("updates with status 'scheduled' when scheduledAt is provided", async () => {
      const scheduledAt = new Date("2026-06-01T10:00:00");
      const data: UpdateMessageData = {
        title: "Reagendada",
        content: "Conteúdo",
        connectionId: "conn-1",
        contactIds: ["c1"],
        scheduledAt,
      };

      await messageService.update("msg-1", data);

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          title: "Reagendada",
          content: "Conteúdo",
          connectionId: "conn-1",
          contactIds: ["c1"],
          scheduledAt,
          status: "scheduled",
        }),
      );
    });
  });

  describe("remove", () => {
    it("deletes the message document", async () => {
      await messageService.remove("msg-1");

      expect(mockDeleteDoc).toHaveBeenCalledWith(expect.anything());
    });
  });
});