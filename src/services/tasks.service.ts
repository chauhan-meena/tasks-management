import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { ITask, TaskStatus, IPaginatedResult, IPaginationQuery } from '@interfaces/tasks.interface';
import Task from '@models/tasks.model';
import { CreateTaskDto, UpdateTaskDto } from '@dtos/tasks.dto';

@Service()
export class TaskService {
  public async getAllTasks(query: IPaginationQuery): Promise<IPaginatedResult<Task>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Task.findAndCountAll({
      where: { is_deleted: false },
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  public async getTaskById(taskId: number): Promise<Task> {
    const task = await Task.findOne({
      where: { id: taskId, is_deleted: false },
    });

    if (!task) {
      throw new HttpException(404, `Task with id ${taskId} not found`);
    }

    return task;
  }

  public async createTask(taskData: CreateTaskDto): Promise<Task> {
    const task = await Task.create({
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || TaskStatus.PENDING,
    });

    return task;
  }

  public async updateTask(taskId: number, taskData: UpdateTaskDto): Promise<Task> {
    const task = await Task.findOne({
      where: { id: taskId, is_deleted: false },
    });

    if (!task) {
      throw new HttpException(404, `Task with id ${taskId} not found`);
    }

    const updateData: Partial<ITask> = {};

    if (taskData.title !== undefined) {
      updateData.title = taskData.title;
    }

    if (taskData.description !== undefined) {
      updateData.description = taskData.description;
    }

    if (taskData.status !== undefined) {
      updateData.status = taskData.status;
      if (taskData.status === TaskStatus.COMPLETED && !task.completed_at) {
        updateData.completed_at = new Date();
      }
    }

    if (taskData.completed_at !== undefined) {
      updateData.completed_at = taskData.completed_at ? new Date(taskData.completed_at) : null;
    }

    await task.update(updateData);

    return task;
  }

  public async deleteTask(taskId: number): Promise<Task> {
    const task = await Task.findOne({
      where: { id: taskId, is_deleted: false },
    });

    if (!task) {
      throw new HttpException(404, `Task with id ${taskId} not found`);
    }

    await task.update({ is_deleted: true });

    return task;
  }
}
