import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async summarize(
    loads: {
      origin: string;
      destination: string;
      price: number;
      eta: string;
    }[],
  ): Promise<{ summary: string; insights: string[] }> {
    const prompt = this.buildPrompt(loads);

    const response = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4', // ou outro conforme disponível
    });

    const content = response.choices[0]?.message?.content || '';
    const [summary, ...insights] = content.split('\n').filter(Boolean);

    return {
      summary,
      insights,
    };
  }

  private buildPrompt(
    loads: {
      origin: string;
      destination: string;
      price: number;
      eta: string;
    }[],
  ): string {
    const intro =
      'Given the following list of truck loads, summarize and give insights:\n';
    const details = loads
      .map(
        (load, i) =>
          `${i + 1}. Origin: ${load.origin}, Destination: ${load.destination}, Price: ${load.price}, ETA: ${load.eta}`,
      )
      .join('\n');
    return `${intro}${details}`;
  }
}
