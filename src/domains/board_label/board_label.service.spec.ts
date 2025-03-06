import { Test, TestingModule } from '@nestjs/testing';
import { BoardLabelService } from './board_label.service';

describe('BoardLabelService', () => {
  let service: BoardLabelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardLabelService],
    }).compile();

    service = module.get<BoardLabelService>(BoardLabelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
