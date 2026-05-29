type FormatType = "phone" | "cep";

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const formatCep = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

export const formatString = (value: string, type: FormatType): string => {
  if (type === "phone") return formatPhone(value);
  if (type === "cep") return formatCep(value);
  return value;
};

export const unformatString = (value: string): string => {
  return value.replace(/\D/g, "");
};

export type { FormatType };