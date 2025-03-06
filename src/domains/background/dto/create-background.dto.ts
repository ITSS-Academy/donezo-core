import { IsOptional, IsString } from 'class-validator';

export class CreateBackgroundDto {
  @IsOptional()
  @IsString()
  color?: string;
}
