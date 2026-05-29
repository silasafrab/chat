import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { auth } from "@/firebase/config";
import type { Message, CreateMessageData, UpdateMessageData } from "@/types/message";

const COLLECTION_NAME = "messages";

const getUserId = (): string => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  return user.uid;
};

const sortByCreatedAtDesc = (list: Message[]): Message[] =>
  list.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

export const messageService = {
  subscribe: (onData: (messages: Message[]) => void): Unsubscribe => {
    const userId = getUserId();

    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
    );

    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        scheduledAt: doc.data().scheduledAt?.toDate() ?? null,
        createdAt: doc.data().createdAt?.toDate(),
      })) as Message[];

      onData(sortByCreatedAtDesc(list));
    });
  },

  create: async (data: CreateMessageData): Promise<void> => {
    const userId = getUserId();

    await addDoc(collection(db, COLLECTION_NAME), {
      title: data.title,
      content: data.content,
      connectionId: data.connectionId,
      contactIds: data.contactIds,
      scheduledAt: data.scheduledAt ?? null,
      userId,
      status: data.scheduledAt ? "scheduled" : "sent",
      createdAt: new Date(),
    });
  },

  update: async (id: string, data: UpdateMessageData): Promise<void> => {
    const updateData: Record<string, unknown> = {
      title: data.title,
      content: data.content,
      connectionId: data.connectionId,
      contactIds: data.contactIds,
    };

    if (data.scheduledAt) {
      updateData.scheduledAt = data.scheduledAt;
      updateData.status = "scheduled";
    }

    await updateDoc(doc(db, COLLECTION_NAME, id), updateData);
  },

  remove: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  },
};