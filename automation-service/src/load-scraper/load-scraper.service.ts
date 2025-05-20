import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class LoadScraperService {
  private readonly logger = new Logger(LoadScraperService.name);

  async extractLoads(): Promise<any[]> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const loads: any[] = [];

    try {
      // Portal fictício 1: JB Hunt
      await page.goto('https://www.jbhunt.com/loadboard/load-board/map');
      await new Promise((res) => setTimeout(res, 3000)); // mock de scraping
      loads.push(...this.generateFakeLoads('JB Hunt'));

      // Portal fictício 2: Landstar
      await page.goto('https://www.landstaronline.com/loadspublic');
      await new Promise((res) => setTimeout(res, 3000)); // mock de scraping
      loads.push(...this.generateFakeLoads('Landstar'));
    } catch (err) {
      this.logger.error('Error during scraping:', err);
    } finally {
      await browser.close();
    }

    return loads.slice(0, 20); // últimos 20
  }

  private generateFakeLoads(provider: string) {
    return Array.from({ length: 10 }).map((_, i) => ({
      provider,
      origin: 'TX',
      destination: 'CA',
      price: Math.floor(Math.random() * 2000 + 500),
      eta: `2024-05-${10 + i}`,
    }));
  }
}
