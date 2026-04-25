import {
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class UpdateApplicationDto {
  @IsString()
  @IsOptional()
  channel?: string;

  @IsString()
  @IsOptional()
  documentType?: string;

  @IsString()
  @IsOptional()
  documentNumber?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsOptional()
  @Min(100000)
  monthlyIncome?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  monthlyExpenses?: number;

  @IsNumber()
  @IsOptional()
  @Min(1000000)
  @Max(50000000)
  requestedAmount?: number;

  @IsNumber()
  @IsOptional()
  @Min(12)
  @Max(60)
  termMonths?: number;

  @IsString()
  @IsOptional()
  loanPurpose?: string;

  @IsBoolean()
  @IsOptional()
  dataConsentAccepted?: boolean;
}
