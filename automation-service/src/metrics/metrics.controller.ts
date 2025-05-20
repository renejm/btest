import { Controller, Get, Res } from '@nestjs/common';
import * as client from 'prom-client';
import { Response } from 'express';

@Controller()
export class MetricsController {
  @Get('/metrics')
  async getMetrics(@Res() res: Response) {
    res.set('Content-Type', client.register.contentType);
    res.send(await client.register.metrics());
  }
}
