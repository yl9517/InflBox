import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { SearchCampaignDto } from '../dto/search-campaign.dto';
import * as dotenv from 'dotenv';

@Injectable()
export class DinnerQueenService {
  private readonly baseUrl: string = process.env.CAMPAIGN_DINNERQUEEN;

  // 크롤링
  async getDinnerQueenData(search: string): Promise<SearchCampaignDto[]> {
    const url = `${this.baseUrl}/taste?order=dday&query=${search}`;
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

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
        const elements = document.querySelectorAll('#taste_list > div');
        elements.forEach((el: any) => {
          const titleText =
            el.querySelector('div > a').getAttribute('title').trim() || '';

          let platform = '블로그';
          if (titleText.includes('릴스')) {
            platform = '릴스';
          }
          const title = titleText.replace('[릴스]', '').replace('신청하기', '');
          const campaignId =
            el.querySelector('div > a').getAttribute('href') || '';
          const linkUrl = `${baseUrl}${campaignId}`;
          const category =
            el.querySelector(
              'div > div.qz-dq-card__text.mr-t015.mb-mr-t1.mb-pd-t005 > div > div.dis-inline-block.layer-tertiary-o.r-4.pd-r05.mr-r05.pd-v0005 > p > strong',
            )?.textContent || '';
          const thumbnail = el
            .querySelector('div > a > div > img')
            .getAttribute('src');

          const leftDayString =
            el.querySelector(
              'div > div.qz-dq-card__text.mr-t015.mb-mr-t1.mb-pd-t005 > div > div.layer-primary.ver-m.pd-05.r-4.dis-inline-block.mr-r05.mr-v-0005 > p > strong',
            )?.textContent || '';

          const daysLeft = parseInt(leftDayString.replace(/\D/g, ''), 10); // 숫자만 추출 (예: 5)
          const applicationEndAt = new Date();
          if (!isNaN(daysLeft)) {
            applicationEndAt.setDate(applicationEndAt.getDate() + daysLeft);
          }
          const winnerAnnouncementAt = new Date(applicationEndAt);
          winnerAnnouncementAt.setDate(winnerAnnouncementAt.getDate() + 1);

          const applicantCountText =
            el.querySelector(
              'div > div.qz-dq-card__text.mr-t015.mb-mr-t1.mb-pd-t005 > p.color-placeholder.mr-t05.pd-t05.mr-b005.pos-rel > span > span.color-subtitle',
            )?.textContent || '';
          const applicantCount = Number(applicantCountText.replace(/\D/g, ''));

          const capacityText =
            el.querySelector(
              'div > div.qz-dq-card__text.mr-t015.mb-mr-t1.mb-pd-t005 > p.color-placeholder.mr-t05.pd-t05.mr-b005.pos-rel > span > span:nth-child(2)',
            )?.textContent || '';
          const capacity = Number(capacityText.replace(/\D/g, ''));

          dtoArray.push({
            linkUrl,
            siteLogo: 'https://dinnerqueen.net/favicon/dq/favicon-32x32.png',
            campaign: '디너의여왕',
            platform,
            title,
            offer: '',
            category,
            applicationEndAt: applicationEndAt.toISOString(),
            winnerAnnouncementAt: winnerAnnouncementAt.toISOString(),
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
