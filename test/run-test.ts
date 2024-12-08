import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DinnerQueenService } from '../src/campaign/services/dinnerqueen';

// 환경 변수 로드
dotenv.config();

@Module({
  providers: [DinnerQueenService],
})
class TestModule {}

async function run() {
  // NestJS 애플리케이션 인스턴스를 수동으로 생성
  const appContext = await NestFactory.createApplicationContext(TestModule);

  const dinnerQueenService = appContext.get(DinnerQueenService);

  const searchQuery = '일산'; // 검색할 키워드 입력
  const result = await dinnerQueenService.getDinnerQueenData(searchQuery);

  console.log(result); // 결과 출력

  await appContext.close(); // 종료
}

run().catch((err) => {
  console.error(err);
});
