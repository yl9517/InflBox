import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { SearchCampaignDto } from '../dto/search-campaign.dto';
import { CampaignSite } from '../enum/campaign-site.enum';
import { Category } from '../enum/category.enum';

@Injectable()
export class GangnamRestaurantService {
  private readonly baseUrl: string = process.env.CAMPAIGN_GANGNAM;

  // 크롤링
  async getGangnamRestaurants(search: string): Promise<SearchCampaignDto[]> {
    const url = `${this.baseUrl}/cp/?stx=${search}`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle2' });

    // 무한 스크롤 처리
    let previousHeight;
    let currentHeight = await page.evaluate(() => document.body.scrollHeight);

    while (previousHeight !== currentHeight) {
      previousHeight = currentHeight;
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise((resolve) => setTimeout(resolve, 100)); // 스크롤 후 잠시 대기
      currentHeight = await page.evaluate(() => document.body.scrollHeight);
    }

    // 데이터 추출
    const restaurantDtos: SearchCampaignDto[] = await page.evaluate(() => {
      const dtoArray: any[] = [];
      const elements = document.querySelectorAll('#gall_ul > li');
      elements.forEach((el: any) => {
        const campaign = 'gangam_restaurant';
        const title =
          el.querySelector('div > div.textArea > dl > dt > a')?.textContent ||
          '';
        const offer =
          el.querySelector('div > div.textArea > dl > dd')?.textContent || '';
        const category = 'BEAUTY'; // 카테고리 값
        const winnerAnnouncementAt = new Date(); // 당첨 발표일

        const capacity = el.querySelector('span.numb > b') ? 1 : 0; // 숫자 추출 로직 수정
        const applicantCount = 1; // 신청 인원, 실제로 로직 추가 필요
        const thumbnail =
          el.querySelector('div > div.imgArea > a > img')?.src || null;

        dtoArray.push({
          campaign,
          title,
          offer,
          category,
          winnerAnnouncementAt,
          capacity,
          applicantCount,
          thumbnail,
        });
      });
      return dtoArray;
    });

    await browser.close();
    return restaurantDtos;
  }
}
