import { Module } from '@nestjs/common';
import { AutomationController } from './automation/automation.controller';
import { LoadScraperService } from './load-scraper/load-scraper.service';
import { MetricsController } from './metrics/metrics.controller';

@Module({
  controllers: [AutomationController, MetricsController],
  providers: [LoadScraperService],
})
export class AppModule {}
