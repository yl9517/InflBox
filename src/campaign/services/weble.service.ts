// src/search/services/weble.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WebleService {
  private readonly baseUrl: string = process.env.CAMPAIGN_WEBLE;

  //API
  async getWebleData(keyword: string): Promise<string[]> {
    const url = `${this.baseUrl}?keyword=${encodeURIComponent(
      keyword,
    )}&limit=14&page=1&type=play`;

    try {
      const response = await axios.get(url);

      const items = response.data.items;
      const titles = items.map((item) => item.item);

      return titles;
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      throw new Error('Weble API 요청 중 오류 발생');
    }
  }
}
