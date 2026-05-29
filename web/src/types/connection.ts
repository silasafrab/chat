export type ConnectionType = "whatsapp" | "telegram" | "sms" | "email";

export type Connection = {
  id: string;
  name: string;
  description: string;
  type: ConnectionType;
  active: boolean;
  userId: string;
  createdAt: Date;
};

export type CreateConnectionData = {
  name: string;
  description: string;
  type: ConnectionType;
  active: boolean;
};

export type UpdateConnectionData = {
  name: string;
  description: string;
  type: ConnectionType;
  active: boolean;
};

export const connectionTypeIcons: Record<ConnectionType, string> = {
  whatsapp: "whatsapp",
  telegram: "telegram",
  sms: "sms",
  email: "email",
};