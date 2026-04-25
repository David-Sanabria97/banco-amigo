import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AbandonApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  reason: string;
}
