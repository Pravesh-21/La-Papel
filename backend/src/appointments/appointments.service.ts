import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { clientName: string; email: string; date: string; time: string; serviceId: number }) {
    return this.prisma.appointment.create({ data });
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      include: { service: true }
    });
  }
}
