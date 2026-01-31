export interface ITask {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  completed_at: Date | null;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface ITaskCreate {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface ITaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  completed_at?: Date | null;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
}

export interface IPaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
