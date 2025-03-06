import { CreateBackgroundDto } from './create-background.dto';
import { PartialType } from "@nestjs/mapped-types";

export class UpdateBackgroundDto extends PartialType(CreateBackgroundDto) {}
