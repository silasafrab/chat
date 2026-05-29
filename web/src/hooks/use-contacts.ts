import { useState, useEffect, useCallback } from "react";
import type { Contact, CreateContactData, UpdateContactData } from "@/types/contact";
import { contactService } from "@/services/contact-service";

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = contactService.subscribe((list) => {
      setContacts(list);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const create = useCallback(async (data: CreateContactData) => {
    await contactService.create(data);
  }, []);

  const update = useCallback(async (id: string, data: UpdateContactData) => {
    await contactService.update(id, data);
  }, []);

  const remove = useCallback(async (id: string) => {
    await contactService.remove(id);
  }, []);

  return { contacts, loading, create, update, remove };
};