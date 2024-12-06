import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SearchCampaignDto } from '../dto/search-campaign.dto';
import { CampaignSite } from '../enum/campaign-site.enum';
import { Category } from '../enum/category.enum';

@Injectable()
export class RevuService {
  private readonly baseUrl: string = process.env.CAMPAIGN_REVU;

  //API
  async getRevuData(keyword: string): Promise<string[]> {
    const url = `${this.baseUrl}?keyword=${encodeURIComponent(
      keyword,
    )}&limit=14&page=1&type=play`;

    try {
      const response = await axios.get(url);
      const result = response.data.items;

      const campaignArr = result.map((item) =>
        this.transformToSearchCampaign(item),
      );

      return campaignArr;
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      throw new Error('Revu API 요청 중 오류 발생');
    }
  }

  transformToSearchCampaign = (item: any): SearchCampaignDto => {
    const dto: SearchCampaignDto = new SearchCampaignDto();
    dto.linkUrl = `${process.env.CAMPAIGN_REVU_URL}/${item.id}`;
    dto.siteLogo = 'https://www.revu.net/assets/img/logo/logo-revu-n.svg';
    dto.campaign = CampaignSite.REVU;
    dto.title = item.item;
    dto.content = item.title;
    dto.offer = '';
    dto.address = {
      city: '',
      sido: '',
      name: item.venue.name,
      jibunAddress: item.venue.addressFirst,
      detailAddress: item.venue.addressLast,
      lat: item.venue.lat,
      lng: item.venue.lng,
    };
    dto.category = Category.BEAUTY;
    dto.applicationStartAt = new Date(item.requestStartedOn); // 신청 시작일
    dto.applicationEndAt = new Date(item.requestEndedOn); // 신청 종료일
    dto.winnerAnnouncementAt = new Date(item.entryAnnouncedOn); // 당첨 발표일
    dto.contentStartAt = new Date(item.postingStartedOn); // 콘텐츠 등록 시작일
    dto.contentEndAt = new Date(item.postingEndedOn); // 콘텐츠 체험 종료일
    dto.capacity = item.reviewerLimit; // 모집 인원
    dto.applicantCount = item.byDeadline; // 신청 인원
    dto.thumbnail = item.thumbnail;

    return dto;
  };
}
