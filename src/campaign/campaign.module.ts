import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { GangnamRestaurantService } from './services/gangnam-restaurant.service';
import { ReviewNoteService } from './services/review-note.service';
import { RevuService } from './services/revu.service';

@Module({
  controllers: [CampaignController],
  providers: [GangnamRestaurantService, ReviewNoteService, RevuService],
})
export class CampainModule {}
