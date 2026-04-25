import {
  IsEnum,
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApplicationChannel } from '../../domain/enums/application-channel.enum';

export class CreateApplicationDto {
  @IsEnum(ApplicationChannel)
  channel: ApplicationChannel;

  @IsString()
  @IsNotEmpty()
  documentType: string;

  @IsString()
  @MinLength(5)
  @MaxLength(15)
  @Matches(/^\d+$/, {
    message: 'El número de documento solo puede contener números',
  })
  documentNumber: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  fullName: string;

  @IsString()
  @Matches(/^\d{10}$/, { message: 'El celular debe tener 10 dígitos' })
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  advisorId?: string;
}
