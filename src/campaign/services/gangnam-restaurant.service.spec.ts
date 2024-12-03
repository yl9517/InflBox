import { Test, TestingModule } from '@nestjs/testing';
import { GangnamRestaurantService } from './gangnam-restaurant.service';
import * as dotenv from 'dotenv';
dotenv.config();

describe('GangnamRestaurantService', () => {
  let service: GangnamRestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GangnamRestaurantService],
    }).compile();

    service = module.get<GangnamRestaurantService>(GangnamRestaurantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch Gangnam restaurant data', async () => {
    const result = await service.getGangnamRestaurants('고양');
    console.log('강남맛집 결과', result); // 출력 확인용
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });
});
