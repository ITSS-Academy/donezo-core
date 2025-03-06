import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardLabelDto } from './create-board_label.dto';

export class UpdateBoardLabelDto {
  id: string;
  boardId: string;
  name: string;
  color: string;
}
