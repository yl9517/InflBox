import { Test, TestingModule } from '@nestjs/testing';
import { WebleService } from './weble.service';
import * as dotenv from 'dotenv';
dotenv.config();

describe('WebleService', () => {
  let service: WebleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebleService],
    }).compile();

    service = module.get<WebleService>(WebleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch Weble data from the actual API', async () => {
    const keyword = '일산';

    // 실제 API 호출
    const result = await service.getWebleData(keyword);
    console.log('레뷰 API 결과:', result);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0); // 최소 하나 이상의 결과가 반환
  });
});
