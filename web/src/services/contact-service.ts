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
import type { Contact, CreateContactData, UpdateContactData } from "@/types/contact";

const COLLECTION_NAME = "contacts";

const getUserId = (): string => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  return user.uid;
};

const sortByCreatedAtDesc = (list: Contact[]): Contact[] =>
  list.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

export const contactService = {
  subscribe: (onData: (contacts: Contact[]) => void): Unsubscribe => {
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
      })) as Contact[];

      onData(sortByCreatedAtDesc(list));
    });
  },

  create: async (data: CreateContactData): Promise<void> => {
    const userId = getUserId();

    await addDoc(collection(db, COLLECTION_NAME), {
      name: data.name,
      phone: data.phone,
      email: data.email,
      connectionId: data.connectionId,
      userId,
      createdAt: new Date(),
    });
  },

  update: async (id: string, data: UpdateContactData): Promise<void> => {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      name: data.name,
      phone: data.phone,
      email: data.email,
      connectionId: data.connectionId,
    });
  },

  remove: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  },
};