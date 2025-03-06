import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  @IsString()
  name: string;
}
