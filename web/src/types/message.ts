export type MessageStatus = "scheduled" | "sent" | "blocked";

export type Message = {
  id: string;
  title: string;
  content: string;
  connectionId: string;
  contactIds: string[];
  userId: string;
  status: MessageStatus;
  scheduledAt: Date | null;
  createdAt: Date;
};

export type CreateMessageData = {
  title: string;
  content: string;
  connectionId: string;
  contactIds: string[];
  scheduledAt: Date | null;
};

export type UpdateMessageData = {
  title: string;
  content: string;
  connectionId: string;
  contactIds: string[];
  scheduledAt?: Date | null;
};