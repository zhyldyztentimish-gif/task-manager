import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { AuthGuard } from '../auth/auth.guard'

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: any, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.sub, dto)
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    return this.tasksService.findAll(req.user.sub)
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      req.user.sub,
      Number(id),
      dto,
    )
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.tasksService.remove(
      req.user.sub,
      Number(id),
    )
  }
}