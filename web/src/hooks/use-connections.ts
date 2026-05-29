import { useState, useEffect, useCallback } from "react";
import type { Connection, CreateConnectionData, UpdateConnectionData } from "@/types/connection";
import { connectionService } from "@/services/connection-service";

export const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = connectionService.subscribe((list) => {
      setConnections(list);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const create = useCallback(async (data: CreateConnectionData) => {
    await connectionService.create(data);
  }, []);

  const update = useCallback(async (id: string, data: UpdateConnectionData) => {
    await connectionService.update(id, data);
  }, []);

  const remove = useCallback(async (id: string) => {
    await connectionService.remove(id);
  }, []);

  return { connections, loading, create, update, remove };
};