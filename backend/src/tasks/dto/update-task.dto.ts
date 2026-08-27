import {
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator'

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsIn(['high', 'medium', 'low'])
  priority?: string

  @IsOptional()
  completed?: boolean
}