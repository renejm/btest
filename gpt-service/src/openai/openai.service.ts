import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;

  constructor() {
    //console.log('OpenAI Key:', process.env.OPENAI_API_KEY);
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
  ): Promise<{
    summaries: { origin: string; destination: string; summary: string }[];
  }> {
    const prompt = this.buildPrompt(loads);

    const response = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
    });

    const content = response.choices[0]?.message?.content || '';

    // Expects a response in the format:
    // 1. TX to CA: Summary...
    // 2. NY to FL: Summary...
    const lines = content.split('\n').filter((line) => line.trim());

    const summaries = lines.map((line, index) => {
      const match = line.match(/^\d+\.\s*(.+?)\s*to\s*(.+?):\s*(.+)$/i);
      if (!match) {
        return {
          origin: loads[index]?.origin ?? '',
          destination: loads[index]?.destination ?? '',
          summary: line.trim(),
        };
      }
      const [, origin, destination, summary] = match;
      return { origin, destination, summary };
    });

    return { summaries };
  }

  private buildPrompt(
    loads: {
      origin: string;
      destination: string;
      price: number;
      eta: string;
    }[],
  ): string {
    let prompt =
      'For each of the following truck loads, return a brief summary in the format:\n\n';
    prompt += '1. ORIGIN to DESTINATION: Summary text...\n\n';

    loads.forEach((load, index) => {
      prompt += `${index + 1}. ${load.origin} to ${load.destination}, price: ${load.price}, ETA: ${load.eta}\n`;
    });

    return prompt;
  }
}
