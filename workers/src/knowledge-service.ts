export interface KnowledgeSegmentInput {
  id?: string;
  title?: string;
  content?: string;
  start_second?: number;
  end_second?: number;
  citation?: string;
}

export interface KnowledgeLessonInput {
  id?: string;
  grade: string;
  subject: string;
  module: string;
  topic: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  locale?: string;
  summary?: string;
  tags?: string[];
  thumbnail?: string;
  duration_seconds?: number;
  published_at?: string;
  segments?: KnowledgeSegmentInput[];
}

export interface KnowledgeResourceInput {
  sourceId?: string;
  sourceType: 'youtube' | 'article' | 'document';
  title: string;
  channel?: string;
  url: string;
  language?: string;
  reliability?: number;
  lesson: KnowledgeLessonInput;
}

export async function upsertKnowledgeResource(db: D1Database, payload: KnowledgeResourceInput) {
  const now = Date.now();
  const sourceId = payload.sourceId || crypto.randomUUID();
  const lessonId = payload.lesson.id || crypto.randomUUID();

  await db
    .prepare(
      `INSERT INTO knowledge_sources (id, source_type, title, channel, url, language, reliability, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         channel = excluded.channel,
         url = excluded.url,
         language = excluded.language,
         reliability = excluded.reliability,
         updated_at = excluded.updated_at`
    )
    .bind(
      sourceId,
      payload.sourceType,
      payload.title,
      payload.channel || null,
      payload.url,
      payload.language || 'en',
      payload.reliability ?? 0.92,
      now,
      now
    )
    .run();

  await db
    .prepare(
      `INSERT INTO knowledge_lessons (id, source_id, grade, subject, module, topic, level, locale, summary, tags, thumbnail, duration_seconds, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         grade = excluded.grade,
         subject = excluded.subject,
         module = excluded.module,
         topic = excluded.topic,
         level = excluded.level,
         summary = excluded.summary,
         tags = excluded.tags,
         thumbnail = excluded.thumbnail,
         duration_seconds = excluded.duration_seconds,
         published_at = excluded.published_at,
         updated_at = excluded.updated_at`
    )
    .bind(
      lessonId,
      sourceId,
      payload.lesson.grade,
      payload.lesson.subject,
      payload.lesson.module,
      payload.lesson.topic,
      payload.lesson.level || 'beginner',
      payload.lesson.locale || 'vi',
      payload.lesson.summary || null,
      payload.lesson.tags ? JSON.stringify(payload.lesson.tags) : null,
      payload.lesson.thumbnail || null,
      payload.lesson.duration_seconds || null,
      payload.lesson.published_at || null,
      now,
      now
    )
    .run();

  if (payload.lesson.segments?.length) {
    for (const segment of payload.lesson.segments) {
      await db
        .prepare(
          `INSERT INTO knowledge_segments (id, lesson_id, title, content, start_second, end_second, citation, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             title = excluded.title,
             content = excluded.content,
             start_second = excluded.start_second,
             end_second = excluded.end_second,
             citation = excluded.citation,
             updated_at = excluded.updated_at`
        )
        .bind(
          segment.id || crypto.randomUUID(),
          lessonId,
          segment.title || null,
          segment.content || null,
          segment.start_second || null,
          segment.end_second || null,
          segment.citation || null,
          now,
          now
        )
        .run();
    }
  }

  return { sourceId, lessonId };
}

export async function queryKnowledgeResources(
  db: D1Database,
  filters: { grade?: string; subject?: string; topic?: string; limit?: number }
) {
  const conditions = [];
  const params: any[] = [];

  if (filters.grade) {
    conditions.push('grade = ?');
    params.push(filters.grade);
  }
  if (filters.subject) {
    conditions.push('subject = ?');
    params.push(filters.subject);
  }
  if (filters.topic) {
    conditions.push('topic LIKE ?');
    params.push(`%${filters.topic}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = filters.limit || 12;

  const lessons = await db
    .prepare(
      `SELECT l.*, s.title as source_title, s.channel, s.url, s.language, s.reliability
       FROM knowledge_lessons l
       JOIN knowledge_sources s ON l.source_id = s.id
       ${where}
       ORDER BY l.updated_at DESC
       LIMIT ${limit}`
    )
    .bind(...params)
    .all();

  return lessons.results?.map((row: any) => ({
    id: row.id,
    topic: row.topic,
    module: row.module,
    subject: row.subject,
    grade: row.grade,
    level: row.level,
    summary: row.summary,
    tags: row.tags ? JSON.parse(row.tags) : [],
    thumbnail: row.thumbnail,
    url: row.url,
    sourceTitle: row.source_title,
    channel: row.channel,
    language: row.language,
    reliability: row.reliability,
    publishedAt: row.published_at,
  }));
}

export async function buildContextFromKnowledge(
  db: D1Database,
  params: { grade?: string; subject?: string; topic?: string; limit?: number }
) {
  const lessons = await queryKnowledgeResources(db, params);
  return {
    requested: params,
    lessons,
    generatedAt: Date.now(),
  };
}


