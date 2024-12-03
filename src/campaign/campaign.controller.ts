import { Controller, Get, Query } from '@nestjs/common';
import { GangnamRestaurantService } from './services/gangnam-restaurant.service';
import { WebleService } from './services/weble.service';

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly gangnamRestaurantService: GangnamRestaurantService,
    private readonly webleService: WebleService,
  ) {}

  @Get('search')
  async search(@Query('search') search: string) {
    const gangnamTitles =
      await this.gangnamRestaurantService.getGangnamRestaurants(search);
    const webleData = await this.webleService.getWebleData(search);

    return {
      gangnamTitles,
      webleData,
    };
  }
}
