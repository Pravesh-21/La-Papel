import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.service.findMany();
  }

  async create(data: { title: string; icon: string; description: string; price: string }) {
    return this.prisma.service.create({ data });
  }
}
