import { IsString, IsOptional, IsEnum, MaxLength, MinLength, IsDateString } from 'class-validator';
import { TaskStatus } from '@interfaces/tasks.interface';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  public description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  public status?: TaskStatus;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  public title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  public description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  public status?: TaskStatus;

  @IsDateString()
  @IsOptional()
  public completed_at?: string;
}
