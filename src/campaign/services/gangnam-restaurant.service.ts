import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { SearchCampaignDto } from '../dto/search-campaign.dto';
import * as dotenv from 'dotenv';
import { CampaignSite } from '../enum/campaign-site.enum';

@Injectable()
export class GangnamRestaurantService {
  private readonly baseUrl: string = process.env.CAMPAIGN_GANGNAM;
  async getGangnamRestaurants(search: string): Promise<SearchCampaignDto[]> {
    const url = `${this.baseUrl}/cp/?stx=${search}`;
    console.log('Using URL:', url);

    // 백그라운드 작업 실행
    const task = new Promise<SearchCampaignDto[]>(async (resolve, reject) => {
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.GOOGLE_CHROME_BIN,
        protocolTimeout: 180000,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer',
          '--single-process',
          '--no-zygote',
        ],
      });

      try {
        console.log('Browser launched');
        const page = await browser.newPage();

        // User-Agent 설정
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        );

        // 네트워크 리소스 차단
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          if (
            ['image', 'stylesheet', 'font', 'media'].includes(
              req.resourceType(),
            )
          ) {
            req.abort(); // 불필요한 리소스 차단
          } else {
            req.continue();
          }
        });
        try {
          console.log('Navigating to page...');
          await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 66660000,
          });
          console.log('Page loaded');
        } catch (err) {
          console.error('Failed to navigate:', err.message);
          throw new Error(`Page navigation failed: ${err.message}`);
        }
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
                el.querySelector('div > div.textArea > dl > dt > a')
                  ?.textContent || '';
              const offer =
                el.querySelector('div > div.textArea > dl > dd')?.textContent ||
                '';
              const platformtText =
                el.querySelector('div > div.textArea > dl > span > em')
                  ?.textContent || '';
              const platform = platformtText === 'Blog' ? '블로그' : '';
              const type =
                el.querySelector('div > div.textArea > dl > span > em.type')
                  ?.textContent || '';
              const leftDayString =
                el.querySelector('div > div.textArea > dl > span > span > em')
                  ?.textContent || '';
              let daysLeft = 0;
              if (leftDayString.includes('일 남음')) {
                daysLeft = parseInt(leftDayString.replace(/\D/g, ''), 10);
              } else if (leftDayString.includes('하루전')) {
                daysLeft = 1;
              }
              const endDay = new Date();
              if (!isNaN(daysLeft)) {
                endDay.setDate(endDay.getDate() + daysLeft);
              }
              endDay.setHours(endDay.getHours() + 9);

              const applicantText =
                el.querySelector('div > div.textArea > div > p > span > b')
                  ?.textContent || '';
              const applicantCount = Number(applicantText.replace(/\D/g, ''));

              const capacityText =
                el.querySelector('div > div.textArea > div > p > span')
                  ?.textContent || '';
              const capacity = Number(
                capacityText.split('/ 모집 ')[1]?.replace(/\D/g, ''),
              );

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
          this.baseUrl,
        );

        console.log('Data extracted:', restaurantDtos.length, 'items');
        resolve(restaurantDtos);
      } catch (err) {
        console.error('Error during navigation:', err);
        reject(new Error('Failed to load the page'));
      } finally {
        await browser.close();
      }
    });

    // 비동기 작업 완료 시 결과 반환
    return task;
  }
}
