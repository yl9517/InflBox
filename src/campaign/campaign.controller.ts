import { Controller, Get, Query } from '@nestjs/common';
import { GangnamRestaurantService } from './services/gangnam-restaurant.service';
import { RevuService } from './services/revu.service';
import { ReviewNoteService } from './services/review-note.service';
import { SearchCampaignDto } from './dto/search-campaign.dto';
import { DinnerQueenService } from './services/dinnerqueen';
import { SearchQueryDto } from './dto/search-query.dto';
import { SortOption } from './enum/sort.enum';

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly gangnamRestaurantService: GangnamRestaurantService,
    private readonly revuService: RevuService,
    private readonly reviewNodeService: ReviewNoteService,
    private readonly dinnerQueenService: DinnerQueenService,
  ) {}

  @Get('search')
  async search(@Query() query: SearchQueryDto) {
    const { search, sort } = query;

    const gangnam =
      await this.gangnamRestaurantService.getGangnamRestaurants(search);

    const revu = await this.revuService.getRevuData(search);
    const reviewNote = await this.reviewNodeService.getReviewNoteData(search);
    const dinnerqueen =
      await this.dinnerQueenService.getDinnerQueenData(search);

    const mergedData = [...gangnam, ...revu, ...reviewNote, ...dinnerqueen];
    let sortedData = [];
    switch (sort) {
      case SortOption.LOW_COMPETITION:
        console.log('Sorting by low competition');
        break;
      default:
        sortedData = mergedData.sort(
          (a: SearchCampaignDto, b: SearchCampaignDto) => {
            const dateA = new Date(a.applicationEndAt).getTime();
            const dateB = new Date(b.applicationEndAt).getTime();
            return dateA - dateB; // 오름차순
          },
        );
    }

    return { campaigns: sortedData };
  }
}
