import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { TaskService } from '@services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '@dtos/tasks.dto';
import { IPaginationQuery } from '@interfaces/tasks.interface';

export class TaskController {
  public taskService = Container.get(TaskService);

  public getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query: IPaginationQuery = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      };

      const result = await this.taskService.getAllTasks(query);

      res.status(200).json({
        success: true,
        message: 'Tasks fetched successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  public getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id, 10);
      const task = await this.taskService.getTaskById(taskId);

      res.status(200).json({
        success: true,
        message: 'Task fetched successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };

  public createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskData: CreateTaskDto = req.body;
      const task = await this.taskService.createTask(taskData);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id, 10);
      const taskData: UpdateTaskDto = req.body;
      const task = await this.taskService.updateTask(taskId, taskData);

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id, 10);
      const task = await this.taskService.deleteTask(taskId);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };
}
