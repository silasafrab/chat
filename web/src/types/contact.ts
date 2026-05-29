export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  connectionId: string;
  userId: string;
  createdAt: Date;
};

export type CreateContactData = {
  name: string;
  phone: string;
  email: string;
  connectionId: string;
};

export type UpdateContactData = {
  name: string;
  phone: string;
  email: string;
  connectionId: string;
};