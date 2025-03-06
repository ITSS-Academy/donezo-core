import { PartialType } from '@nestjs/mapped-types';
import { CreateCardAttachmentDto } from './create-card_attachment.dto';

export class UpdateCardAttachmentDto extends PartialType(CreateCardAttachmentDto) {}
