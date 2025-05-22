import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LoadScraperService } from '../src/load-scraper/load-scraper.service';
import axios from 'axios';

jest.mock('axios');

describe('AutomationController (e2e)', () => {
  let app: INestApplication;

  const mockLoads = [
    { origin: 'A', destination: 'B', price: 1000, eta: '2024-05-01' },
    { origin: 'C', destination: 'D', price: 1500, eta: '2024-05-02' },
  ];

  const mockSummary = {
    summary: 'These are two loads',
    insights: ['Insight 1', 'Insight 2'],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(LoadScraperService)
      .useValue({
        extractLoads: jest.fn().mockResolvedValue(mockLoads),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/run (GET) should return summary and insights', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: mockSummary });

    const res = await request(app.getHttpServer()).get('/run');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockSummary);
    expect(axios.post).toHaveBeenCalledWith(
      'http://gpt-service:3000/summarize-loads',
      { loads: mockLoads },
    );
  });

  it('/run (GET) should retry and fail if GPT fails', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('GPT Down'));

    const res = await request(app.getHttpServer()).get('/run');
    expect(res.status).toBe(500);
  });

  afterAll(async () => {
    await app.close();
  });
});
