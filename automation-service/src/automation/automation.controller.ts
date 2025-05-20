import { Controller, Get, Res } from '@nestjs/common';
import { LoadScraperService } from '../load-scraper/load-scraper.service';
import axios from 'axios';
import { Response } from 'express';
import { retry } from '../utils/retry';

@Controller()
export class AutomationController {
  constructor(private readonly scraper: LoadScraperService) {}

  @Get('/run')
  async run(@Res() res: Response) {
    const loads = await this.scraper.extractLoads();

    const summarize = async () =>
      await axios.post('http://gpt-service:3000/summarize-loads', { loads });

    const response = await retry(summarize, 3, 2000);

    res.json(response.data);
  }
}
