import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { GangnamRestaurantService } from './services/gangnam-restaurant.service';
import { ReviewNoteService } from './services/review-note.service';
import { WebleService } from './services/weble.service';

@Module({
  controllers: [CampaignController],
  providers: [GangnamRestaurantService, ReviewNoteService, WebleService],
})
export class CampainModule {}
