import { Module } from '@nestjs/common';
import { SummarizeController } from './summarize/summarize.controller';
import { OpenAiService } from './openai/openai.service';
import { HealthController } from './health/health.controller';

@Module({
  controllers: [SummarizeController, HealthController],
  providers: [OpenAiService],
})
export class AppModule {}
