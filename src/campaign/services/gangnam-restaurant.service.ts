import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { SearchCampaignDto } from '../dto/search-campaign.dto';
import * as dotenv from 'dotenv';

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
    // let previousHeight;
    // let currentHeight = await page.evaluate(() => document.body.scrollHeight);

    // while (previousHeight !== currentHeight) {
    //   previousHeight = currentHeight;
    //   await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    //   await new Promise((resolve) => setTimeout(resolve, 100)); // 스크롤 후 잠시 대기
    //   currentHeight = await page.evaluate(() => document.body.scrollHeight);
    // }

    // 데이터 추출
    const restaurantDtos: SearchCampaignDto[] = await page.evaluate(
      (baseUrl) => {
        const dtoArray: any[] = [];
        const elements = document.querySelectorAll('#gall_ul > li');
        elements.forEach((el: any) => {
          const gangnamId = el.getAttribute('data-product');
          const linkUrl = `${baseUrl}/cp/?id=${gangnamId}`;
          const title =
            el.querySelector('div > div.textArea > dl > dt > a')?.textContent ||
            '';
          const offer =
            el.querySelector('div > div.textArea > dl > dd')?.textContent || '';
          const category = 'BEAUTY'; // 카테고리 값
          const leftDayString =
            el.querySelector('div > div.textArea > dl > span > span > em')
              ?.textContent || '';
          const daysLeft = parseInt(leftDayString.replace(/\D/g, ''), 10); // 숫자만 추출 (예: 5)
          const endDay = new Date();
          if (!isNaN(daysLeft)) {
            endDay.setDate(endDay.getDate() + daysLeft);
          }

          const winnerAnnouncementAt = endDay.toISOString();
          const applyNumberText =
            document.querySelector('span.numb b')?.textContent || '';
          const capacity = Number(applyNumberText.replace(/\D/g, '')); // 숫자만 추출

          // 모집 5에서 숫자 추출
          const applicantText =
            document.querySelector('span.numb')?.textContent || '';
          const applicantCount = Number(
            applicantText.split('모집')[1]?.replace(/\D/g, ''),
          );
          const thumbnail =
            el.querySelector('div > div.imgArea > a > img')?.src || null;

          dtoArray.push({
            linkUrl,
            siteLogo: 'https://xn--939au0g4vj8sq.net/favicon.ico',
            campaign: '강남맛집',
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
      },
      this.baseUrl, // baseUrl을 전달
    );

    await browser.close();
    return restaurantDtos;
  }
}
