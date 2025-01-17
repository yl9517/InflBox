import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DinnerQueenService } from '../src/campaign/services/dinnerqueen';
import { GangnamRestaurantService } from '../src/campaign/services/gangnam-restaurant.service';

// 환경 변수 로드
dotenv.config();

@Module({
  providers: [DinnerQueenService, GangnamRestaurantService],
})
class TestModule {}

async function run() {
  // NestJS 애플리케이션 인스턴스를 수동으로 생성
  const appContext = await NestFactory.createApplicationContext(TestModule);

  const dinnerQueenService = appContext.get(GangnamRestaurantService);

  const searchQuery = '크리스마스'; // 검색할 키워드 입력
  const result = await dinnerQueenService.getGangnamRestaurants(searchQuery);

  console.log(result); // 결과 출력

  await appContext.close(); // 종료
}

run().catch((err) => {
  console.error(err);
});
