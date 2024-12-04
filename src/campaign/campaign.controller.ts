import { Controller, Get, Query } from '@nestjs/common';
import { GangnamRestaurantService } from './services/gangnam-restaurant.service';
import { WebleService } from './services/weble.service';
import { ReviewNoteService } from './services/review-note.service';

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly gangnamRestaurantService: GangnamRestaurantService,
    private readonly webleService: WebleService,
    private readonly reviewNodeService: ReviewNoteService,
  ) {}

  @Get('search')
  async search(@Query('search') search: string) {
    const gangnam =
      await this.gangnamRestaurantService.getGangnamRestaurants(search);
    const weble = await this.webleService.getWebleData(search);
    const reviewNote = await this.reviewNodeService.getReviewNoteData(search);

    const mergedData = [...gangnam, ...weble, ...reviewNote];

    return mergedData;
  }
}
