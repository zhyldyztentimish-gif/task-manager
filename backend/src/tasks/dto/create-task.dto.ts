import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsIn(['high', 'medium', 'low'])
  priority?: string
}