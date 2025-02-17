import { IsString, IsNumber, IsUUID, IsOptional, IsIn, Min, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {

  @IsString()
  @IsIn(['income', 'expense'], { message: 'Transaction type must be income or expense' })
  type: string;

  @IsNumber()
  @Min(0, { message: 'Amount must be greater than or equal to 0' })
  amount: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  description?: string;
}


export class UpdateTransactionDto {
  
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsIn(['income', 'expense'], { message: 'Transaction type must be income or expense' })
  type?: string;

  @IsNumber()
  @Min(0, { message: 'Amount must be greater than or equal to 0' })
  amount?: number;

  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;
}