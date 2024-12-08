import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { GangnamRestaurantService } from './services/gangnam-restaurant.service';
import { ReviewNoteService } from './services/review-note.service';
import { RevuService } from './services/revu.service';
import { DinnerQueenService } from './services/dinnerqueen';

@Module({
  controllers: [CampaignController],
  providers: [
    GangnamRestaurantService,
    ReviewNoteService,
    RevuService,
    DinnerQueenService,
  ],
})
export class CampainModule {}
