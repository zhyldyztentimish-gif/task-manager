import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority || 'medium',
        userId,
      },
    })
  }

  async findAll(userId: number) {
    return this.prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: 'desc',
      },
    })
  }

  async update(
    userId: number,
    taskId: number,
    dto: UpdateTaskDto,
  ) {
    return this.prisma.task.updateMany({
      where: {
        id: taskId,
        userId,
      },
      data: dto,
    })
  }

  async remove(userId: number, taskId: number) {
    return this.prisma.task.deleteMany({
      where: {
        id: taskId,
        userId,
      },
    })
  }
}