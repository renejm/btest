import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { Load } from './entities/load.entity';
import { Summary } from './entities/summary.entity';
import { SummaryModule } from './summary/summary.module';
import { AutomationController } from './automation/automation.controller';
import { LoadScraperService } from './load-scraper/load-scraper.service';
import { MetricsController } from './metrics/metrics.controller';
import { LoadInsightsController } from './insights/load-insights.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'btest_db',
      synchronize: true, // dev only!
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Driver, Load, Summary]),
    SummaryModule,
  ],
  controllers: [
    AutomationController,
    MetricsController,
    LoadInsightsController,
  ],
  providers: [LoadScraperService],
})
export class AppModule {}
