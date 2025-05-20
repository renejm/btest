import { Module } from '@nestjs/common';
import { SummarizeController } from './summarize/summarize.controller';
import { OpenAiService } from './openai/openai.service';

@Module({
  controllers: [SummarizeController],
  providers: [OpenAiService],
})
export class AppModule {}
