import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateBackgroundDto } from '../../background/dto/create-background.dto';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsOptional()
  backgroundId?: string;

  // @IsOptional()
  // @IsUUID()
  // predefinedBackgroundId?: string;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => CreateBackgroundDto)
  // background?: CreateBackgroundDto;
}
