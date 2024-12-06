import { Test, TestingModule } from '@nestjs/testing';
import { RevuService } from './revu.service';
import * as dotenv from 'dotenv';
dotenv.config();

describe('RevuService', () => {
  let service: RevuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevuService],
    }).compile();

    service = module.get<RevuService>(RevuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch Revu data from the actual API', async () => {
    const keyword = '일산';

    // 실제 API 호출
    const result = await service.getRevuData(keyword);
    console.log('레뷰 API 결과:', result);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0); // 최소 하나 이상의 결과가 반환
  });
});
