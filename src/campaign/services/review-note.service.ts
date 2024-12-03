import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

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
      
      const titles = response.data.objects.map((item) => item.title);
      return titles;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw new HttpException(
        'Failed to fetch data from ReviewNote API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
