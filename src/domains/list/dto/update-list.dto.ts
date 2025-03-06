import { PartialType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto';
import {UpdateCardDto} from "../../card/dto/update-card.dto";
import {CreateCardDto} from "../../card/dto/create-card.dto";

export class UpdateListDto {
  id: string;
  title: string;
  cards: UpdateCardDto[];
}
