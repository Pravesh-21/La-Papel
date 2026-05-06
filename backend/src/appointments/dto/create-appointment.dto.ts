import { IsString, IsEmail, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'Victoria H.' })
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty({ example: 'victoria@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '2026-05-15' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: '14:00' })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  serviceId: number;
}
