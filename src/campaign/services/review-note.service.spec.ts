import { Test, TestingModule } from '@nestjs/testing';
import { ReviewNoteService } from './review-note.service';
import * as dotenv from 'dotenv';
dotenv.config();

describe('ReviewNoteService', () => {
  let service: ReviewNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewNoteService],
    }).compile();

    service = module.get<ReviewNoteService>(ReviewNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch ReviewNote data from real API', async () => {
    const keyword = '행신';

    // 실제 API 호출
    const result = await service.getReviewNoteData(keyword);
    console.log('리뷰노트 API 결과:', result);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
