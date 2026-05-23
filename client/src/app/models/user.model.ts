export interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  role: 'Admin' | 'General User';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  role: 'Admin' | 'General User';
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
  name?: string;
  role?: 'Admin' | 'General User';
  isActive?: boolean;
}
