import { MessageSquare, Send, Mail, Phone } from "lucide-react";
import type { ConnectionType } from "@/types/connection";
import type { LucideIcon } from "lucide-react";

type ConnectionTypeConfig = {
  label: string;
  icon: LucideIcon;
  color: string;
};

export const connectionTypeMap: Record<ConnectionType, ConnectionTypeConfig> = {
  whatsapp: {
    label: "WhatsApp",
    icon: MessageSquare,
    color: "text-green-600 dark:text-green-400",
  },
  telegram: {
    label: "Telegram",
    icon: Send,
    color: "text-sky-600 dark:text-sky-400",
  },
  sms: {
    label: "SMS",
    icon: Phone,
    color: "text-orange-600 dark:text-orange-400",
  },
  email: {
    label: "Email",
    icon: Mail,
    color: "text-blue-600 dark:text-blue-400",
  },
};

export const connectionTypes = Object.entries(connectionTypeMap).map(
  ([value, config]) => ({
    value: value as ConnectionType,
    label: config.label,
  }),
);