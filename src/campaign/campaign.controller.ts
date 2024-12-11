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

    // 각 서비스 호출 시간 측정
    console.time('Gangnam Restaurants');
    const gangnam =
      await this.gangnamRestaurantService.getGangnamRestaurants(search);
    console.timeEnd('Gangnam Restaurants');

    console.time('Revu Data');
    const revu = await this.revuService.getRevuData(search);
    console.timeEnd('Revu Data');

    console.time('Review Note Data');
    const reviewNote = await this.reviewNodeService.getReviewNoteData(search);
    console.timeEnd('Review Note Data');

    console.time('Dinner Queen Data');
    const dinnerqueen =
      await this.dinnerQueenService.getDinnerQueenData(search);
    console.timeEnd('Dinner Queen Data');

    const mergedData = [...gangnam, ...revu, ...reviewNote, ...dinnerqueen];

    // 정렬 처리
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
//
// import { Controller, Get, Query } from '@nestjs/common';
// import { GangnamRestaurantService } from './services/gangnam-restaurant.service';
// import { RevuService } from './services/revu.service';
// import { ReviewNoteService } from './services/review-note.service';
// import { SearchCampaignDto } from './dto/search-campaign.dto';
// import { DinnerQueenService } from './services/dinnerqueen';
// import { SearchQueryDto } from './dto/search-query.dto';
// import { SortOption } from './enum/sort.enum';

// @Controller('campaign')
// export class CampaignController {
//   constructor(
//     private readonly gangnamRestaurantService: GangnamRestaurantService,
//     private readonly revuService: RevuService,
//     private readonly reviewNodeService: ReviewNoteService,
//     private readonly dinnerQueenService: DinnerQueenService,
//   ) {}

//   @Get('search')
//   async search(@Query() query: SearchQueryDto) {
//     const { search, sort } = query;

//     // 각 서비스 호출 시간 측정
//     console.time('All Services');

//     const [gangnam, revu, reviewNote, dinnerqueen] = await Promise.all([
//       this.gangnamRestaurantService.getGangnamRestaurants(search),
//       this.revuService.getRevuData(search),
//       this.reviewNodeService.getReviewNoteData(search),
//       this.dinnerQueenService.getDinnerQueenData(search),
//     ]);

//     console.timeEnd('All Services');

//     const mergedData = [...gangnam, ...revu, ...reviewNote, ...dinnerqueen];

//     // 정렬 처리
//     let sortedData = [];
//     switch (sort) {
//       case SortOption.LOW_COMPETITION:
//         console.log('Sorting by low competition');
//         break;
//       default:
//         sortedData = mergedData.sort(
//           (a: SearchCampaignDto, b: SearchCampaignDto) => {
//             const dateA = new Date(a.applicationEndAt).getTime();
//             const dateB = new Date(b.applicationEndAt).getTime();
//             return dateA - dateB; // 오름차순
//           },
//         );
//     }

//     return { campaigns: sortedData };
//   }
// }
