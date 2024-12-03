import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class GangnamRestaurantService {
  private readonly baseUrl: string = process.env.CAMPAIGN_GANGNAM;

  //크롤링
  async getGangnamRestaurants(search: string): Promise<string[]> {
    const url = `${this.baseUrl}/cp/?stx=${search}`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 1440, height: 900 });

    await page.goto(url, { waitUntil: 'networkidle2' });

    // 무한 스크롤
    let previousHeight;
    let currentHeight = await page.evaluate(() => document.body.scrollHeight);

    while (previousHeight !== currentHeight) {
      previousHeight = currentHeight;
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise((resolve) => setTimeout(resolve, 100));
      currentHeight = await page.evaluate(() => document.body.scrollHeight);
    }

    // 데이터를 추출
    const titles = await page.evaluate(() => {
      const items: string[] = [];
      const elements = document.querySelectorAll('#gall_ul > li');
      elements.forEach((el) => {
        const title =
          el.querySelector('div > div.textArea > dl > dt > a')?.textContent ||
          'No Title';
        items.push(title.trim());
      });
      console.log(items);
      return items;
    });

    await browser.close();
    return titles;
  }
}
