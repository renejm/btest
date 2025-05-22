import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OpenAiService } from '../openai/openai.service';

@Controller('summarize-loads')
export class SummarizeController {
  constructor(private readonly openaiService: OpenAiService) {}

  @Post()
  async summarize(@Body() body: { loads: unknown[] }) {
    if (!Array.isArray(body.loads)) {
      throw new BadRequestException('Body must contain an array of loads');
    }

    const isValidLoad = (
      load: Record<string, unknown>,
    ): load is {
      origin: string;
      destination: string;
      price: number;
      eta: string;
    } =>
      typeof load === 'object' &&
      load !== null &&
      'origin' in load &&
      typeof load.origin === 'string' &&
      'destination' in load &&
      typeof load.destination === 'string' &&
      'price' in load &&
      typeof load.price === 'number' &&
      'eta' in load &&
      typeof load.eta === 'string';

    if (!body.loads.every(isValidLoad)) {
      throw new BadRequestException(
        'Each load must have origin, destination, price, and eta',
      );
    }

    return this.openaiService.summarize(
      body.loads as {
        origin: string;
        destination: string;
        price: number;
        eta: string;
      }[],
    );
  }
}
