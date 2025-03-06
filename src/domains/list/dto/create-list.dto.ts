import { CreateCardDto } from '../../card/dto/create-card.dto';

export class CreateListDto {
  title: string;
  cards: CreateCardDto[];
}
