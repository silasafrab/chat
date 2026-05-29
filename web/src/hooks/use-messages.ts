import { useState, useEffect, useCallback } from "react";
import type { Message, CreateMessageData, UpdateMessageData } from "@/types/message";
import { messageService } from "@/services/message-service";

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = messageService.subscribe((list) => {
      setMessages(list);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const create = useCallback(async (data: CreateMessageData) => {
    await messageService.create(data);
  }, []);

  const update = useCallback(async (id: string, data: UpdateMessageData) => {
    await messageService.update(id, data);
  }, []);

  const remove = useCallback(async (id: string) => {
    await messageService.remove(id);
  }, []);

  return { messages, loading, create, update, remove };
};