import cron from 'node-cron';
import { sql } from '../db';
import OpenAI from 'openai';

export function initScheduledTasks() {
  cron.schedule('0 0 1 * *', async () => {
    console.log('[Cron] Running monthly AI growth analysis...');
    
    try {
      const configResult = await sql`SELECT api_key, base_url, model, enabled FROM ai_config ORDER BY id DESC LIMIT 1`;
      const config = configResult[0];

      if (!config || !config.enabled || !config.api_key) {
        console.log('[Cron] AI analysis disabled or not configured, skipping.');
        return;
      }

      const entriesResult = await sql`
        SELECT title, content, created_at::text FROM diaries
        WHERE type = 'diary'
        ORDER BY created_at DESC LIMIT 10
      `;

      if (entriesResult.length === 0) {
        console.log('[Cron] No diary entries to analyze, skipping.');
        return;
      }

      const client = new OpenAI({
        apiKey: config.api_key,
        baseURL: config.base_url || 'https://api.openai.com/v1'
      });

      const prompt = `You are an expert life coach and psychologist. Analyze the following diary entries and provide:
1. A short, poetic summary (max 20 words).
2. 3 concrete growth tips for the user based on their patterns.
3. A one-word sentiment descriptor.

Entries:
${entriesResult.map((e: any) => `[${e.created_at}] ${e.title}: ${e.content}`).join('\n\n')}

Respond ONLY with a JSON object:
{
  "summary": "...",
  "growthTips": ["...", "...", "..."],
  "sentiment": "..."
}`;

      const response = await client.chat.completions.create({
        model: config.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI service');
      }

      const result = JSON.parse(content);

      await sql`
        INSERT INTO diaries (title, content, tags, type, ai_summary, ai_growth_tips, ai_sentiment)
        VALUES (
          'SoulNotes AI 月度洞察',
          ${result.summary + '\n\n成长建议:\n' + result.growthTips.join('\n')},
          ${['AI分析', '成长', '月度总结']},
          'ai',
          ${result.summary},
          ${result.growthTips},
          ${result.sentiment}
        )
      `;

      console.log('[Cron] Monthly AI growth analysis completed successfully.');
    } catch (error: any) {
      console.error('[Cron] Monthly AI analysis failed:', error.message);
    }
  });

  console.log('[Cron] Scheduled tasks initialized. Monthly AI analysis runs on the 1st of every month at 00:00.');
}