import { Test, TestingModule } from '@nestjs/testing';
import { CardAttachmentController } from './card_attachment.controller';
import { CardAttachmentService } from './card_attachment.service';

describe('CardAttachmentController', () => {
  let controller: CardAttachmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardAttachmentController],
      providers: [CardAttachmentService],
    }).compile();

    controller = module.get<CardAttachmentController>(CardAttachmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
