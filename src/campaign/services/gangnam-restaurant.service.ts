import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { SearchCampaignDto } from '../dto/search-campaign.dto';
import * as dotenv from 'dotenv';
import { CampaignSite } from '../enum/campaign-site.enum';

@Injectable()
export class GangnamRestaurantService {
  private readonly baseUrl: string = process.env.CAMPAIGN_GANGNAM;

  // 크롤링
  async getGangnamRestaurants(search: string): Promise<SearchCampaignDto[]> {
    const url = `${this.baseUrl}/cp/?stx=${search}`;
    // Puppeteer 인스턴스 최적화
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome',
    });
    const page = await browser.newPage();

    // 네트워크 리소스 차단 (이미지, 스타일시트 등)
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // DOM만 로드되면 작업 실행
    await page.goto(url, { waitUntil: 'domcontentloaded' });

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
        const dtoArray: SearchCampaignDto[] = [];
        const elements = document.querySelectorAll('#gall_ul > li');
        const noCampaignMessage = document.querySelector('.list-no-item');
        if (noCampaignMessage) {
          return [];
        }

        elements.forEach((el: any) => {
          const gangnamId = el.getAttribute('data-product');
          const linkUrl = `${baseUrl}/cp/?id=${gangnamId}`;
          const title =
            el.querySelector('div > div.textArea > dl > dt > a')?.textContent ||
            '';
          const offer =
            el.querySelector('div > div.textArea > dl > dd')?.textContent || '';
          const platformtText =
            el.querySelector('div > div.textArea > dl > span > em')
              ?.textContent || '';
          const platform = platformtText == 'Blog' ? '블로그' : '';
          const type =
            el.querySelector('div > div.textArea > dl > span > em.type')
              ?.textContent || '';
          const leftDayString =
            el.querySelector('div > div.textArea > dl > span > span > em')
              ?.textContent || '';
          let daysLeft = 0;
          if (leftDayString.includes('일 남음')) {
            // "3일 남음"과 같은 경우
            daysLeft = parseInt(leftDayString.replace(/\D/g, ''), 10);
          } else if (leftDayString.includes('하루전')) {
            // "하루 전"을 숫자 1로 변환
            daysLeft = 1;
          }
          const endDay = new Date();
          if (!isNaN(daysLeft)) {
            endDay.setDate(endDay.getDate() + daysLeft);
          }
          //KT 변환
          endDay.setHours(endDay.getHours() + 9);

          // 모집 5에서 숫자 추출
          const applicantText =
            el.querySelector('div > div.textArea > div > p > span > b')
              ?.textContent || '';
          const applicantCount = Number(applicantText.replace(/\D/g, '')); // 숫자만 추출

          const capacityText =
            el.querySelector('div > div.textArea > div > p > span')
              ?.textContent || '';
          // ::after의 content 가져오기=
          const capacity = Number(
            capacityText.split('/ 모집 ')[1]?.replace(/\D/g, ''),
          ); // 숫자만 추출

          const thumbnail =
            el.querySelector('div > div.imgArea > a > img')?.src || 'null';

          dtoArray.push({
            linkUrl,
            siteLogo: 'https://xn--939au0g4vj8sq.net/favicon.ico',
            campaign: '강남맛집',
            platform,
            type,
            title,
            offer,
            applicationEndAt: endDay.toISOString(),
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
