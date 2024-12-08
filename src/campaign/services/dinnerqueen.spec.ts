import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import { DinnerQueenService } from './dinnerqueen';
dotenv.config();

describe('디너의 여왕 service', () => {
  let service: DinnerQueenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DinnerQueenService],
    }).compile();

    service = module.get<DinnerQueenService>(DinnerQueenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch Gangnam restaurant data', async () => {
    const result = await service.getDinnerQueenData('일산');
    console.log('디너의여왕 결과', result); // 출력 확인용
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });
});
