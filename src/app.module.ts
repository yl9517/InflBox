import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // ConfigModule 임포트
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampainModule } from './campaign/campaign.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역적으로 환경 변수를 사용할 수 있도록 설정
    }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: () => ({
    //     type: process.env.DB_TYPE as 'mysql',
    //     host: process.env.DB_HOST,
    //     port: +process.env.DB_PORT,
    //     username: process.env.DB_USERNAME,
    //     password: process.env.DB_PASSWORD,
    //     database: process.env.DB_DATABASE,
    //     entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //     synchronize: true, // DB 자동 동기화 (개발 환경에서만 사용)
    //   }),
    // }),
    CampainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
