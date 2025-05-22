import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Load } from '../entities/load.entity';
import { Driver } from '../entities/driver.entity';

interface StoredLoad {
  id: number;
  origin: string;
  destination: string;
  price: number;
  eta: Date;
}

@Injectable()
export class LoadScraperService {
  private readonly logger = new Logger(LoadScraperService.name);

  constructor(
    @InjectRepository(Load)
    private readonly loadRepo: Repository<Load>,

    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
  ) {}

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

    const finalLoads = loads.slice(0, 20);

    type FakeLoad = {
      provider: string;
      origin: string;
      destination: string;
      price: number;
      eta: string;
    };

    for (const item of finalLoads as FakeLoad[]) {
      // Fetch or create the driver
      let driver = await this.driverRepo.findOne({
        where: { name: item.provider },
      });

      if (!driver) {
        driver = this.driverRepo.create({ name: item.provider });
        driver = await this.driverRepo.save(driver);
      }

      const load = this.loadRepo.create({
        origin: item.origin,
        destination: item.destination,
        price: item.price,
        eta: item.eta,
        driver,
      });
      await this.loadRepo.save(load);
    }
    const storedLoads: StoredLoad[] = [];

    for (const item of finalLoads) {
      // Fetch or create driver
      let driver = await this.driverRepo.findOne({
        where: { name: item.provider },
      });
      if (!driver) {
        driver = await this.driverRepo.save(
          this.driverRepo.create({ name: item.provider }),
        );
      }

      const loadEntity = this.loadRepo.create({
        origin: item.origin,
        destination: item.destination,
        price: item.price,
        eta: item.eta,
        driver,
      });

      const saved = await this.loadRepo.save(loadEntity);

      storedLoads.push({
        id: saved.id,
        origin: saved.origin,
        destination: saved.destination,
        price: saved.price,
        eta: saved.eta,
      });
    }

    return storedLoads;
  }

  private generateFakeLoads(provider: string) {
    return Array.from({ length: 10 }).map((_, i) => ({
      provider,
      origin: 'TX',
      destination: 'CA',
      price: Math.floor(Math.random() * 2000 + 500),
      eta: `2025-05-${10 + i}`,
    }));
  }
}
