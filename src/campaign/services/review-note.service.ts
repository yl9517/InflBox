import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { Category } from '../enum/category.enum';
import { SearchCampaignDto } from '../dto/search-campaign.dto';
import { CampaignSite } from '../enum/campaign-site.enum';

@Injectable()
export class ReviewNoteService {
  private readonly baseUrl: string = process.env.CAMPAIGN_REVIEW_NOTE;

  //API
  async getReviewNoteData(searchQuery: string): Promise<string[]> {
    const url = `${this.baseUrl}?q=${encodeURIComponent(
      searchQuery,
    )}&limit=1000000&page=0&activeOnly=true`;

    try {
      const response = await axios.get(url);

      const campaignArr = response.data.objects.map((item) =>
        this.transformToSearchCampaign(item),
      );

      return campaignArr;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw new HttpException(
        'Failed to fetch data from ReviewNote API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  transformToSearchCampaign = (item: any): SearchCampaignDto => {
    const dto: SearchCampaignDto = new SearchCampaignDto();
    let storageUrl: string = process.env.CAMPAIGN_REVIEW_NOTE_STORAGE;

    dto.campaign = CampaignSite.REVIEW_NOTE;
    dto.title = item.title;
    dto.content = item.title;
    dto.offer = item.offer;
    dto.address = {
      city: item.city,
      sido: item.sido.name,
    };
    dto.category = Category.BEAUTY;
    dto.winnerAnnouncementAt = new Date(item.applyEndAt); // 당첨 발표일
    dto.capacity = item.infNum; // 모집 인원
    dto.applicantCount = item.applicantCount; // 신청 인원
    dto.thumbnail = `${storageUrl}/${item.imageKey}`;

    return dto;
  };
}
