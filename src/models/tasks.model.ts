import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@database';
import { ITask, TaskStatus } from '@interfaces/tasks.interface';

interface TaskCreationAttributes extends Optional<ITask, 'id' | 'description' | 'status' | 'completed_at' | 'is_deleted' | 'created_at' | 'updated_at'> {}

class Task extends Model<ITask, TaskCreationAttributes> implements ITask {
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: TaskStatus;
  public completed_at!: Date | null;
  public is_deleted!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TaskStatus)),
      defaultValue: TaskStatus.PENDING,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeUpdate: (task: Task) => {
        if (task.status === TaskStatus.COMPLETED && !task.completed_at) {
          task.completed_at = new Date();
        }
      },
    },
  },
);

export default Task;
