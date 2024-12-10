import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { SearchCampaignDto } from '../dto/search-campaign.dto';
import { CampaignSite } from '../enum/campaign-site.enum';
import { Platform } from '../enum/platform.enum';

@Injectable()
export class ReviewNoteService {
  private readonly baseUrl: string = process.env.CAMPAIGN_REVIEW_NOTE;

  //API
  async getReviewNoteData(searchQuery: string): Promise<string[]> {
    const url = `${this.baseUrl}?q=${encodeURIComponent(
      searchQuery,
    )}&limit=1000000&page=0&activeOnly=true&status=SELECT`;

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

    dto.linkUrl = `${process.env.CAMPAIGN_REVIEW_NOTE_URL}/${item.id}`;
    dto.siteLogo = 'https://www.reviewnote.co.kr/logo/header.webp';
    dto.platform = Platform[item.channel];
    dto.campaign = CampaignSite.REVIEW_NOTE;
    dto.type = '방문형';
    if (item.city == '재택') {
      dto.type = '기자단';
    }
    dto.title = `[${item.city} ${item.sido.name}] ${item.title}`;
    dto.content = item.title;
    dto.offer = item.offer;
    dto.address = {
      city: item.city,
      sido: item.sido.name,
    };
    dto.category = item.category.title;
    dto.applicationEndAt = new Date(
      new Date(item.applyEndAt).setHours(
        new Date(item.applyEndAt).getHours() + 9,
      ),
    );
    dto.capacity = item.infNum; // 모집 인원
    dto.applicantCount = item.applicantCount; // 신청 인원
    dto.thumbnail = `${storageUrl}${encodeURIComponent(item.imageKey)}?alt=media`;
    return dto;
  };
}
