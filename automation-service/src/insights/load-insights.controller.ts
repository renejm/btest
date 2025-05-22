import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

interface LoadSummary {
  load_id: number;
  origin: string;
  destination: string;
  price: number;
  eta: Date;
  summary_text: string;
  summarized_at: Date;
}

@Controller('load-insights')
export class LoadInsightsController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  async getTop5Loads() {
    const result: LoadSummary[] = await this.dataSource.query(`
      SELECT * FROM load_summary_view
      ORDER BY price DESC
      LIMIT 5
    `);

    return result;
  }
}
