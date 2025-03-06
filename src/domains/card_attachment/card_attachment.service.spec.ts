import { Test, TestingModule } from '@nestjs/testing';
import { CardAttachmentService } from './card_attachment.service';

describe('CardAttachmentService', () => {
  let service: CardAttachmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardAttachmentService],
    }).compile();

    service = module.get<CardAttachmentService>(CardAttachmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
