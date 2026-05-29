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
import type { Connection, CreateConnectionData, UpdateConnectionData } from "@/types/connection";

const COLLECTION_NAME = "connections";

const getUserId = (): string => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  return user.uid;
};

const sortByCreatedAtDesc = (list: Connection[]): Connection[] =>
  list.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

export const connectionService = {
  subscribe: (onData: (connections: Connection[]) => void): Unsubscribe => {
    const userId = getUserId();

    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
    );

    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Connection[];

      onData(sortByCreatedAtDesc(list));
    });
  },

  create: async (data: CreateConnectionData): Promise<void> => {
    const userId = getUserId();

    await addDoc(collection(db, COLLECTION_NAME), {
      name: data.name,
      description: data.description,
      type: data.type,
      active: data.active,
      userId,
      createdAt: new Date(),
    });
  },

  update: async (id: string, data: UpdateConnectionData): Promise<void> => {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      name: data.name,
      description: data.description,
      type: data.type,
      active: data.active,
    });
  },

  remove: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  },
};