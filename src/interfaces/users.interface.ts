export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IUserCreate {
  email: string;
  password: string;
  name: string;
}
