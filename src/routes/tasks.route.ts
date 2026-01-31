import { Router } from 'express';
import { TaskController } from '@controllers/tasks.controller';
import { CreateTaskDto, UpdateTaskDto } from '@dtos/tasks.dto';
import { IRoute } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { API_CONFIG } from '@config/api.config';

export class TaskRoute implements IRoute {
  public path = API_CONFIG.ROUTES.TASKS;
  public router = Router();
  public taskController = new TaskController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(this.path, AuthMiddleware);

    this.router.get(`${this.path}`, this.taskController.getAllTasks);

    this.router.get(`${this.path}/:id`, this.taskController.getTaskById);

    this.router.post(
      `${this.path}`,
      ValidationMiddleware(CreateTaskDto),
      this.taskController.createTask,
    );

    this.router.patch(
      `${this.path}/:id`,
      ValidationMiddleware(UpdateTaskDto, true),
      this.taskController.updateTask,
    );

    this.router.delete(`${this.path}/:id`, this.taskController.deleteTask);
  }
}
