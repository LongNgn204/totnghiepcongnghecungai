import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { curriculumMap, CurriculumTopic } from './taxonomy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data/knowledge');
const API_KEY = process.env.YOUTUBE_API_KEY;

if (!API_KEY) {
  console.error('YOUTUBE_API_KEY is missing. Please add it to your .env file.');
  process.exit(1);
}

interface YoutubeVideoItem {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnails: Record<string, { url: string }>;
}

interface KnowledgeResourcePayload {
  topicId: string;
  grade: string;
  subject: string;
  module: string;
  locale: string;
  sourceType: 'youtube';
  url: string;
  title: string;
  channel: string;
  publishedAt: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  thumbnail: string;
}

async function searchYoutube(topic: CurriculumTopic): Promise<KnowledgeResourcePayload[]> {
  const results: KnowledgeResourcePayload[] = [];

  for (const query of topic.youtubeQueries) {
    const params = new URLSearchParams({
      part: 'snippet',
      maxResults: '6',
      q: query,
      key: API_KEY,
      relevanceLanguage: 'en',
      safeSearch: 'moderate',
      type: 'video',
      videoDuration: 'medium',
      videoCaption: 'closedCaption',
    });

    const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error('YouTube API error for query', query, response.statusText);
      continue;
    }
    const data = await response.json();

    for (const item of data.items || []) {
      const snippet = item.snippet as any;
      const videoId = item.id.videoId;
      if (!videoId) continue;
      const payload: KnowledgeResourcePayload = {
        topicId: topic.id,
        grade: topic.grade,
        subject: topic.subject,
        module: topic.module,
        locale: topic.locale,
        sourceType: 'youtube',
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: snippet.title,
        channel: snippet.channelTitle,
        publishedAt: snippet.publishedAt,
        level: topic.priority === 1 ? 'beginner' : topic.priority === 2 ? 'intermediate' : 'advanced',
        description: snippet.description,
        thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || '',
      };
      results.push(payload);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return results;
}

async function persist(topic: CurriculumTopic, resources: KnowledgeResourcePayload[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const outputPath = path.join(DATA_DIR, `${topic.id}.json`);
  fs.writeFileSync(outputPath, JSON.stringify({ topic, resources, generatedAt: new Date().toISOString() }, null, 2), 'utf-8');
  console.log(`Saved ${resources.length} resources for ${topic.topic} → ${outputPath}`);
}

async function main() {
  console.log('Starting YouTube STEM crawler...');
  for (const topic of curriculumMap) {
    try {
      const resources = await searchYoutube(topic);
      if (resources.length === 0) {
        console.warn(`No videos found for ${topic.topic}`);
        continue;
      }
      await persist(topic, resources);
    } catch (error) {
      console.error('Crawler error', topic.id, error);
    }
  }
  console.log('Crawler finished.');
}

main();


