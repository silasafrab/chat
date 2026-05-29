import type { Message } from "@/types/message";

export function getMessageDisplayStatus(
  message: Message,
  isConnectionActive: boolean,
): Message["status"] {
  if (message.status === "scheduled" && !isConnectionActive) {
    return "blocked";
  }
  return message.status;
}