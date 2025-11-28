// Main API Router
import { Router } from 'itty-router';
import {
  corsHeaders,
  jsonResponse,
  errorResponse,
  successResponse,
  badRequestResponse,
  unauthorizedResponse,
} from './utils';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  updateUserProfile,
  changePassword,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  requireAuth,
  hashPassword
} from './auth-service';
import {
  updateUserData,
  changeUserPassword as changeUserPasswordAdmin
} from './management/data-manager';
import {
  upsertKnowledgeResource,
  queryKnowledgeResources,
  buildContextFromKnowledge
} from './knowledge-service';

export interface Env {
  DB: D1Database;
  GEMINI_API_KEY?: string;
  ALLOWED_ORIGINS?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  EMAIL_FROM_NAME?: string;
}

const router = Router();

// CORS preflight
router.options('*', () => new Response(null, { headers: corsHeaders }));

// Health check
router.get('/api/health', () =>
  successResponse({ status: 'ok', version: '2.0.0' })
);

// ============= AUTHENTICATION =============

// Register
router.post('/api/users/register', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { username, email, password, displayName } = body;

    if (!email || !password || !displayName) {
      return badRequestResponse('Missing required fields: email, password, displayName');
    }

    const result = await registerUser(env.DB, {
      username,
      email,
      password,
      displayName
    });

    return successResponse(result, 'Registration successful');
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
});

// Login
router.post('/api/users/login', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { username, email, password } = body;

    const identifier = username || email;

    if (!identifier || !password) {
      return badRequestResponse('Email/Username and password are required');
    }

    const result = await loginUser(env.DB, identifier, password);

    return successResponse(result, 'Login successful');
  } catch (error: any) {
    return errorResponse(error.message, 401);
  }
});

// Logout
router.post('/api/users/logout', async (request, env: Env) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return unauthorizedResponse();
    }

    const token = authHeader.substring(7);
    await logoutUser(env.DB, token);

    return successResponse(null, 'Logout successful');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// Get current user
router.get('/api/users/me', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const user = await getUserById(env.DB, userId);

    return successResponse(user);
  } catch (error: any) {
    return unauthorizedResponse(error.message);
  }
});

// Update profile
router.put('/api/users/profile', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();

    const { displayName, avatar, bio } = body;
    const updatedUser = await updateUserProfile(env.DB, userId, {
      displayName,
      avatar,
      bio
    });

    return successResponse(updatedUser, 'Profile updated');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// Change password
router.post('/api/users/change-password', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();

    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return badRequestResponse('Old and new passwords are required');
    }

    await changePassword(env.DB, userId, oldPassword, newPassword);

    return successResponse(null, 'Password changed successfully');
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
});

// Forgot password
router.post('/api/deprecated/forgot-password', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { email, newPassword } = body;

    if (!email || !newPassword || newPassword.length < 6) {
      return badRequestResponse('Email và mật khẩu mới (≥6 ký tự) là bắt buộc');
    }

    const passwordHash = await hashPassword(newPassword);

    const updated = await env.DB.prepare('UPDATE auth_users SET password_hash = ? WHERE email = ?')
      .bind(passwordHash, email.toLowerCase())
      .run();

    if (updated.meta.changes === 0) {
      return errorResponse('Không tìm thấy email', 404);
    }

    // Invalidate all sessions
    await env.DB.prepare('DELETE FROM auth_sessions WHERE user_id IN (SELECT id FROM auth_users WHERE email = ?)')
      .bind(email.toLowerCase())
      .run();

    return successResponse({ success: true, message: 'Mật khẩu đã được cập nhật thành công! Đăng nhập ngay.' });
  } catch (error: any) {
    return errorResponse('Lỗi hệ thống', 500);
  }
});

// ============= PASSWORD RESET (SECURE) =============

// Request password reset (send code)
router.post('/api/users/request-password-reset', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { email } = body;
    if (!email) return badRequestResponse('Email is required');

    const emailConfig = env.RESEND_API_KEY && env.EMAIL_FROM ? {
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
      fromName: env.EMAIL_FROM_NAME || 'AI Hoc Tap'
    } : undefined as any;

    const result = await requestPasswordReset(env.DB, email.toLowerCase(), emailConfig);
    return successResponse(result, 'Reset code requested');
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
});

// Verify reset token (optional)
router.get('/api/users/verify-reset-token', async (request, env: Env) => {
  try {
    const url = new URL(request.url);
    const email = (url.searchParams.get('email') || '').toLowerCase();
    const token = url.searchParams.get('token') || '';
    if (!email || !token) return badRequestResponse('Email and token are required');

    const result = await verifyResetToken(env.DB, email, token);
    return successResponse(result, 'Token verified');
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
});

// Reset password
router.post('/api/users/reset-password', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { email, token, newPassword } = body;
    if (!email || !token || !newPassword) return badRequestResponse('Email, token, newPassword are required');

    const result = await resetPassword(env.DB, email.toLowerCase(), token, newPassword);
    return successResponse(result, 'Password reset successful');
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
});

// ============= DASHBOARD & STATS =============

router.get('/api/dashboard/stats', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);

    // Comprehensive dashboard stats
    const [sessions, exams, flashcards] = await Promise.all([
      env.DB.prepare(
        `SELECT
          COUNT(*) as total_sessions,
          SUM(duration) as total_time_seconds,
          COUNT(DISTINCT CASE WHEN activity = 'exam' THEN id END) as exams_completed,
          SUM(CASE WHEN activity = 'flashcard' THEN cards_studied ELSE 0 END) as flashcards_learned,
          SUM(CASE WHEN activity = 'chat' THEN questions_asked ELSE 0 END) as chat_questions
        FROM study_sessions WHERE user_id = ?`
      ).bind(userId).first(),
      
      env.DB.prepare(
        `SELECT
          COUNT(*) as total_exams,
          AVG(score) as avg_exam_score,
          MAX(score) as best_exam_score
        FROM exams WHERE user_id = ?`
      ).bind(userId).first(),
      
      env.DB.prepare(
        `SELECT COUNT(*) as total_decks FROM flashcard_decks WHERE user_id = ?`
      ).bind(userId).first()
    ]);

    // Streak calculation (simplified - last 30 days)
    const recentSessions = await env.DB.prepare(
      `SELECT DISTINCT date(session_date / 1000, 'unixepoch', 'localtime') as study_day
       FROM study_sessions WHERE user_id = ?
       ORDER BY study_day DESC LIMIT 30`
    ).bind(userId).all();

    let currentStreak = 0;
    if (recentSessions.results.length > 0) {
      const today = new Date().toDateString();
      let streakDate = new Date();
      
      for (const session of recentSessions.results) {
        const sessionDay = new Date(session.study_day as string).toDateString();
        if (sessionDay === streakDate.toDateString()) {
          currentStreak++;
          streakDate.setDate(streakDate.getDate() - 1);
        } else if (streakDate.toDateString() === today && sessionDay === new Date(Date.now() - 86400000).toDateString()) {
          // Allow yesterday to count for today
          currentStreak++;
          streakDate.setDate(streakDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    const totalStudyTime = Math.round((sessions?.total_time_seconds || 0) / 60); // minutes
    const weeklyActiveDays = await env.DB.prepare(
      `SELECT COUNT(DISTINCT date(session_date / 1000, 'unixepoch', 'localtime')) as active_days
       FROM study_sessions WHERE user_id = ? AND session_date >= ?`
    ).bind(userId, Date.now() - 7*24*60*60*1000).first();

    return successResponse({
      totalStudyTime,
      totalExams: sessions?.exams_completed || exams?.total_exams || 0,
      averageScore: parseFloat((exams?.avg_exam_score || 0).toFixed(1)),
      currentStreak,
      longestStreak: currentStreak, // Simplified
      flashcardsLearned: sessions?.flashcards_learned || 0,
      chatSessions: sessions?.chat_questions || 0,
      weeklyActiveDays: weeklyActiveDays?.active_days || 0,
      bestScore: exams?.best_exam_score || 0,
      totalDecks: flashcards?.total_decks || 0
    });

  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= EXAMS =============

router.post('/api/exams', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();
    const {
      id,
      title,
      category,
      grade,
      questions,
      answers,
      score,
      total_questions,
      duration,
      completed_at,
    } = body;

    await env.DB.prepare(
      `INSERT INTO exams (id, user_id, title, category, grade, questions, answers, score, total_questions, duration, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        userId,
        title,
        category,
        grade,
        JSON.stringify(questions),
        JSON.stringify(answers),
        score,
        total_questions,
        duration,
        completed_at
      )
      .run();

    // Also record in study_sessions
    await env.DB.prepare(
      `INSERT INTO study_sessions (id, user_id, activity, duration, score, questions_asked, subject, grade, session_date)
       VALUES (?, ?, 'exam', ?, ?, ?, ?, ?, ?)`
    ).bind(
      crypto.randomUUID(),
      userId,
      duration,
      score,
      total_questions,
      category,
      grade,
      completed_at
    ).run();

    return successResponse({ id }, 'Exam saved successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/exams', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';
    const grade = url.searchParams.get('grade') || '';

    let query = 'SELECT * FROM exams WHERE user_id = ?';
    const params = [userId];

    if (search) {
      query += ' AND (title LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (grade) {
      query += ' AND grade = ?';
      params.push(grade);
    }

    query += ' ORDER BY completed_at DESC LIMIT ? OFFSET ?';
    params.push(limit.toString(), offset.toString());

    const exams = await env.DB.prepare(query).bind(...params).all();

    const results = exams.results.map((exam: any) => ({
      ...exam,
      questions: JSON.parse(exam.questions),
      answers: exam.answers ? JSON.parse(exam.answers) : null,
    }));

    return successResponse({
      exams: results,
      total: exams.results.length,
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/exams/:id', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const { id } = request.params;

    const exam = await env.DB.prepare(
      'SELECT * FROM exams WHERE id = ? AND user_id = ?'
    )
      .bind(id, userId)
      .first();

    if (!exam) {
      return errorResponse('Exam not found', 404);
    }

    return successResponse({
      ...exam,
      questions: JSON.parse(exam.questions as string),
      answers: exam.answers ? JSON.parse(exam.answers as string) : null,
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// Get exam statistics
router.get('/api/exams/stats', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);

    const stats = await env.DB.prepare(
      `SELECT 
        COUNT(*) as total_exams,
        AVG(score) as avg_score,
        SUM(COALESCE(duration, 0)) as total_duration
       FROM exams WHERE user_id = ?`
    ).bind(userId).first();

    return successResponse({
      totalExams: stats?.total_exams || 0,
      avgScore: parseFloat((stats?.avg_score || 0).toFixed(1)),
      totalDuration: stats?.total_duration || 0
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.delete('/api/exams/:id', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const { id } = request.params;

    await env.DB.prepare('DELETE FROM exams WHERE id = ? AND user_id = ?')
      .bind(id, userId)
      .run();

    return successResponse(null, 'Exam deleted');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= FLASHCARDS =============

router.post('/api/flashcards/decks', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();
    const { id, title, description, category, grade, is_public, color } = body;
    const now = Date.now();

    await env.DB.prepare(
      `INSERT INTO flashcard_decks (id, user_id, title, description, category, grade, is_public, color, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, userId, title, description, category, grade, is_public ? 1 : 0, color, now, now)
      .run();

    return successResponse({ id }, 'Deck created successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/flashcards/decks', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';
    const grade = url.searchParams.get('grade') || '';

    let query = 'SELECT * FROM flashcard_decks WHERE user_id = ?';
    const params = [userId];

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (grade) {
      query += ' AND grade = ?';
      params.push(grade);
    }

    query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
    params.push(limit.toString(), offset.toString());

    const decks = await env.DB.prepare(query).bind(...params).all();

    return successResponse({ decks: decks.results });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/flashcards/decks/:id', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const { id } = request.params;

    const deck = await env.DB.prepare(
      'SELECT * FROM flashcard_decks WHERE id = ? AND user_id = ?'
    )
      .bind(id, userId)
      .first();

    if (!deck) {
      return errorResponse('Deck not found', 404);
    }

    const cards = await env.DB.prepare(
      'SELECT * FROM flashcards WHERE deck_id = ? ORDER BY created_at DESC'
    )
      .bind(id)
      .all();

    return successResponse({
      ...deck,
      cards: cards.results.map((card: any) => ({
        ...card,
        tags: card.tags ? JSON.parse(card.tags) : [],
      })),
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.delete('/api/flashcards/decks/:id', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const { id } = request.params;

    await env.DB.prepare('DELETE FROM flashcard_decks WHERE id = ? AND user_id = ?')
      .bind(id, userId)
      .run();

    return successResponse(null, 'Deck deleted');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.post('/api/flashcards/decks/:deckId/cards', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const { deckId } = request.params;
    const body: any = await request.json();

    const { id, question, answer, difficulty, tags } = body;
    const now = Date.now();

    await env.DB.prepare(
      `INSERT INTO flashcards (id, deck_id, question, answer, difficulty, tags, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, deckId, question, answer, difficulty, JSON.stringify(tags), now)
      .run();

    // Update deck updated_at
    await env.DB.prepare('UPDATE flashcard_decks SET updated_at = ? WHERE id = ?')
      .bind(now, deckId)
      .run();

    return successResponse({ id }, 'Card created successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.put('/api/flashcards/cards/:id', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const { id } = request.params;
    const body: any = await request.json();

    // Verify card belongs to user's deck - SECURITY CHECK
    const card = await env.DB.prepare(
      `SELECT f.* FROM flashcards f
       JOIN flashcard_decks d ON f.deck_id = d.id
       WHERE f.id = ? AND d.user_id = ?`
    ).bind(id, userId).first();

    if (!card) {
      return unauthorizedResponse('Card not found or access denied');
    }

    const {
      ease_factor,
      interval,
      repetitions,
      mastery_level,
      review_count,
      correct_count,
      next_review,
      last_reviewed,
    } = body;

    await env.DB.prepare(
      `UPDATE flashcards SET 
        ease_factor = ?, interval = ?, repetitions = ?, mastery_level = ?,
        review_count = ?, correct_count = ?, next_review = ?, last_reviewed = ?,
        updated_at = ?
       WHERE id = ?`
    )
      .bind(
        ease_factor,
        interval,
        repetitions,
        mastery_level,
        review_count,
        correct_count,
        next_review,
        last_reviewed,
        Date.now(),
        id
      )
      .run();

    return successResponse({ id }, 'Card updated');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.delete('/api/flashcards/cards/:id', async (request, env: Env) => {
  try {
    const { id } = request.params;

    await env.DB.prepare('DELETE FROM flashcards WHERE id = ?')
      .bind(id)
      .run();

    return successResponse(null, 'Card deleted');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// POST /api/flashcards/review - Update spaced repetition stats for a card
router.post('/api/flashcards/review', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();
    const {
      cardId,
      correct, // boolean: was answer correct?
      ease_factor = 2.5,
      interval,
      repetitions,
      mastery_level,
      review_count,
      correct_count,
      next_review,
      last_reviewed
    } = body;

    if (!cardId) {
      return badRequestResponse('cardId is required');
    }

    const now = Date.now();

    // Update card review stats
    await env.DB.prepare(
      `UPDATE flashcards
       SET
         ease_factor = COALESCE(?, ease_factor),
         interval = COALESCE(?, interval),
         repetitions = COALESCE(?, repetitions),
         mastery_level = COALESCE(?, mastery_level),
         review_count = COALESCE(review_count, 0) + 1,
         correct_count = CASE WHEN ? = 1 THEN COALESCE(correct_count, 0) + 1 ELSE correct_count END,
         next_review = ?,
         last_reviewed = ?,
         updated_at = ?
       WHERE id = ? AND deck_id IN (SELECT id FROM flashcard_decks WHERE user_id = ?)`
    )
    .bind(
      ease_factor,
      interval,
      repetitions,
      mastery_level,
      correct ? 1 : 0,
      next_review || null,
      last_reviewed || now,
      now,
      cardId,
      userId
    )
    .run();

    // Record study session
    const sessionId = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO study_sessions (id, user_id, activity, cards_studied, session_date)
       VALUES (?, ?, 'flashcard', 1, ?)`
    )
    .bind(sessionId, userId, now)
    .run();

    return successResponse({ cardId, sessionId }, 'Review recorded successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= CHAT =============

router.post('/api/chat/sessions', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();
    const { id, title, category, grade, messages } = body;
    const now = Date.now();

    await env.DB.prepare(
      `INSERT INTO chat_sessions (id, user_id, title, category, grade, messages, message_count, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        userId,
        title,
        category,
        grade,
        JSON.stringify(messages),
        messages.length,
        now,
        now
      )
      .run();

    return successResponse({ id }, 'Chat session created');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/chat/sessions', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';
    const grade = url.searchParams.get('grade') || '';

    let query = 'SELECT * FROM chat_sessions WHERE user_id = ?';
    const params = [userId];

    if (search) {
      query += ' AND (title LIKE ? OR json_extract(messages, "$[*].content") LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (grade) {
      query += ' AND grade = ?';
      params.push(grade);
    }

    query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
    params.push(limit.toString(), offset.toString());

    const sessions = await env.DB.prepare(query).bind(...params).all();

    return successResponse({
      sessions: sessions.results.map((s: any) => ({
        ...s,
        messages: JSON.parse(s.messages),
      })),
      total: sessions.meta.count || 0,
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/chat/sessions/:id', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const { id } = request.params;

    const session = await env.DB.prepare(
      'SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?'
    )
      .bind(id, userId)
      .first();

    if (!session) {
      return errorResponse('Chat session not found', 404);
    }

    return successResponse({
      ...session,
      messages: JSON.parse(session.messages as string),
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.put('/api/chat/sessions/:id', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const { id } = request.params;
    const body: any = await request.json();
    const { messages } = body;

    await env.DB.prepare(
      'UPDATE chat_sessions SET messages = ?, message_count = ?, updated_at = ? WHERE id = ? AND user_id = ?'
    )
      .bind(JSON.stringify(messages), messages.length, Date.now(), id, userId)
      .run();

    return successResponse(null, 'Chat updated');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.delete('/api/chat/sessions/:id', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const { id } = request.params;

    await env.DB.prepare('DELETE FROM chat_sessions WHERE id = ? AND user_id = ?')
      .bind(id, userId)
      .run();

    return successResponse(null, 'Chat deleted');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= PROGRESS =============

router.post('/api/progress/sessions', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();
    const { id, activity, duration, score, cards_studied, questions_asked, subject, grade, session_date } = body;

    await env.DB.prepare(
      `INSERT INTO study_sessions (id, user_id, activity, duration, score, cards_studied, questions_asked, subject, grade, session_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, userId, activity, duration, score, cards_studied, questions_asked, subject, grade, session_date)
      .run();

    return successResponse({ id }, 'Session recorded');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/progress/stats', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);

    // Comprehensive stats
    const [sessionsStats, examsStats] = await Promise.all([
      env.DB.prepare(
        `SELECT
          COUNT(*) as total_sessions,
          SUM(duration) as total_time,
          AVG(CASE WHEN activity = 'exam' THEN score END) as avg_exam_score,
          SUM(CASE WHEN activity = 'flashcard' THEN cards_studied ELSE 0 END) as total_cards,
          SUM(CASE WHEN activity = 'chat' THEN questions_asked ELSE 0 END) as total_questions,
          COUNT(DISTINCT CASE WHEN activity = 'exam' THEN id END) as total_exams
        FROM study_sessions WHERE user_id = ?`
      ).bind(userId).first(),
      
      env.DB.prepare(
        `SELECT
          COUNT(*) as exams_count,
          AVG(score) as exams_avg_score,
          MAX(score) as best_score
        FROM exams WHERE user_id = ?`
      ).bind(userId).first()
    ]);

    return successResponse({
      totalSessions: sessionsStats?.total_sessions || 0,
      totalTime: sessionsStats?.total_time || 0,
      avgExamScore: sessionsStats?.avg_exam_score || 0,
      totalCards: sessionsStats?.total_cards || 0,
      totalQuestions: sessionsStats?.total_questions || 0,
      totalExams: sessionsStats?.total_exams || examsStats?.exams_count || 0,
      bestScore: examsStats?.best_score || 0
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/progress/chart/:period', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const { period } = request.params;
    const days = parseInt(period) || 7;

    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    const sessions = await env.DB.prepare(
      'SELECT * FROM study_sessions WHERE user_id = ? AND session_date >= ? ORDER BY session_date ASC'
    )
      .bind(userId, cutoff)
      .all();

    return successResponse({ sessions: sessions.results });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= LEADERBOARD =============

router.get('/api/leaderboard', async (request, env: Env) => {
  try {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'all'; // all, week, month
    const limit = parseInt(url.searchParams.get('limit') || '100');

    let timeFilter = '';
    const now = Date.now();

    if (period === 'week') {
      const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
      timeFilter = `AND s.session_date >= ${weekAgo}`;
    } else if (period === 'month') {
      const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
      timeFilter = `AND s.session_date >= ${monthAgo}`;
    }

    const leaderboard = await env.DB.prepare(
      `SELECT
        au.id as user_id,
        au.display_name as user_name,
        COUNT(DISTINCT CASE WHEN s.activity = 'exam' THEN s.id END) as exams_completed,
        SUM(CASE WHEN s.activity = 'flashcard' THEN s.cards_studied ELSE 0 END) as flashcards_learned,
        SUM(s.duration) as study_time,
        (COUNT(DISTINCT CASE WHEN s.activity = 'exam' THEN s.id END) * 10 +
         SUM(CASE WHEN s.activity = 'flashcard' THEN s.cards_studied ELSE 0 END) +
         SUM(s.duration) / 60) as points
      FROM auth_users au
      LEFT JOIN study_sessions s ON au.id = s.user_id ${timeFilter}
      GROUP BY au.id
      ORDER BY points DESC
      LIMIT ${limit}`
    )
      .all();

    return successResponse({
      leaderboard: leaderboard.results.map((row: any, index: number) => ({
        ...row,
        rank: index + 1
      })),
      period,
      total: leaderboard.results.length
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= SYNC API =============

// Sync data from client to server (BATCH OPTIMIZED)
router.post('/api/sync', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();
    const now = Date.now();

    const exams = Array.isArray(body.exams) ? body.exams.slice(0, 100) : []; // Limit 100 per type
    const decks = Array.isArray(body.decks) ? body.decks.slice(0, 100) : [];
    const cards = Array.isArray(body.cards) ? body.cards.slice(0, 100) : [];
    const chats = Array.isArray(body.chats) ? body.chats.slice(0, 100) : [];
    const sessions = Array.isArray(body.sessions) ? body.sessions.slice(0, 100) : [];

    if (exams.length + decks.length + cards.length + chats.length + sessions.length > 400) {
      return errorResponse('Batch too large. Max 400 items total (100 per type).', 413);
    }

    // Collect statements
    const statements: D1PreparedStatement[] = [];
    const results: any = { synced: { exams: 0, decks: 0, cards: 0, chats: 0, sessions: 0 }, errors: [] };

    // UPSERT helpers with soft delete check
    const upsertExam = (e: any) => {
      const completed_at = e.completed_at || now;
      const updated_at = e.updated_at || completed_at || now;
      statements.push(env.DB.prepare(
        `INSERT INTO exams (id, user_id, title, category, grade, questions, answers, score, total_questions, duration, completed_at, updated_at, deleted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title, category = excluded.category, grade = excluded.grade,
           questions = excluded.questions, answers = excluded.answers,
           score = excluded.score, total_questions = excluded.total_questions, duration = excluded.duration,
           completed_at = excluded.completed_at, updated_at = excluded.updated_at,
           deleted_at = CASE WHEN excluded.deleted_at IS NOT NULL THEN excluded.deleted_at ELSE exams.deleted_at END
         WHERE (excluded.updated_at > COALESCE(exams.updated_at, 0) OR excluded.deleted_at IS NOT NULL)
           AND (exams.deleted_at IS NULL OR excluded.deleted_at IS NOT NULL)`
      ).bind(
        e.id, userId, e.title, e.category, e.grade,
        JSON.stringify(e.questions || []), e.answers ? JSON.stringify(e.answers) : null,
        e.score ?? null, e.total_questions ?? null, e.duration ?? null,
        completed_at, updated_at, e.deleted_at || null
      ));
      results.synced.exams++;
    };

    const upsertDeck = (d: any) => {
      const created_at = d.created_at || now;
      const updated_at = d.updated_at || now;
      statements.push(env.DB.prepare(
        `INSERT INTO flashcard_decks (id, user_id, title, description, category, grade, is_public, color, created_at, updated_at, deleted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
         ON CONFLICT(id) DO UPDATE SET
           title=excluded.title, description=excluded.description, category=excluded.category,
           grade=excluded.grade, is_public=excluded.is_public, color=excluded.color,
           updated_at=excluded.updated_at,
           deleted_at=CASE WHEN excluded.deleted_at IS NOT NULL THEN excluded.deleted_at ELSE flashcard_decks.deleted_at END
         WHERE (excluded.updated_at > COALESCE(flashcard_decks.updated_at, 0) OR excluded.deleted_at IS NOT NULL)
           AND (flashcard_decks.deleted_at IS NULL OR excluded.deleted_at IS NOT NULL)`
      ).bind(
        d.id, userId, d.title, d.description ?? null, d.category ?? null, d.grade ?? null,
        d.is_public ? 1 : 0, d.color ?? null, created_at, updated_at, d.deleted_at || null
      ));
      results.synced.decks++;
    };

    const upsertCard = (c: any) => {
      const created_at = c.created_at || now;
      const updated_at = c.updated_at || created_at || now;
      statements.push(env.DB.prepare(
        `INSERT INTO flashcards (id, deck_id, question, answer, difficulty, tags, ease_factor, interval, repetitions, mastery_level, review_count, correct_count, next_review, last_reviewed, created_at, updated_at, deleted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
         ON CONFLICT(id) DO UPDATE SET
           deck_id=excluded.deck_id, question=excluded.question, answer=excluded.answer,
           difficulty=excluded.difficulty, tags=excluded.tags,
           ease_factor=excluded.ease_factor, interval=excluded.interval, repetitions=excluded.repetitions,
           mastery_level=excluded.mastery_level, review_count=excluded.review_count, correct_count=excluded.correct_count,
           next_review=excluded.next_review, last_reviewed=excluded.last_reviewed,
           updated_at=excluded.updated_at,
           deleted_at=CASE WHEN excluded.deleted_at IS NOT NULL THEN excluded.deleted_at ELSE flashcards.deleted_at END
         WHERE (excluded.updated_at > COALESCE(flashcards.updated_at, 0) OR excluded.deleted_at IS NOT NULL)
           AND (flashcards.deleted_at IS NULL OR excluded.deleted_at IS NOT NULL)`
      ).bind(
        c.id, c.deck_id, c.question, c.answer, c.difficulty ?? 'medium',
        c.tags ? JSON.stringify(c.tags) : null, c.ease_factor ?? 2.5, c.interval ?? 0,
        c.repetitions ?? 0, c.mastery_level ?? 0, c.review_count ?? 0, c.correct_count ?? 0,
        c.next_review ?? null, c.last_reviewed ?? null, created_at, updated_at, c.deleted_at || null
      ));
      results.synced.cards++;
    };

    const upsertChat = (s: any) => {
      const created_at = s.created_at || now;
      const updated_at = s.updated_at || now;
      statements.push(env.DB.prepare(
        `INSERT INTO chat_sessions (id, user_id, title, category, grade, messages, message_count, created_at, updated_at, deleted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
         ON CONFLICT(id) DO UPDATE SET
           title=excluded.title, category=excluded.category, grade=excluded.grade,
           messages=excluded.messages, message_count=excluded.message_count,
           updated_at=excluded.updated_at,
           deleted_at=CASE WHEN excluded.deleted_at IS NOT NULL THEN excluded.deleted_at ELSE chat_sessions.deleted_at END
         WHERE (excluded.updated_at > COALESCE(chat_sessions.updated_at, 0) OR excluded.deleted_at IS NOT NULL)
           AND (chat_sessions.deleted_at IS NULL OR excluded.deleted_at IS NOT NULL)`
      ).bind(
        s.id, userId, s.title, s.category ?? null, s.grade ?? null,
        JSON.stringify(s.messages || []), Array.isArray(s.messages) ? s.messages.length : (s.message_count ?? 0),
        created_at, updated_at, s.deleted_at || null
      ));
      results.synced.chats++;
    };

    const upsertSession = (ss: any) => {
      const session_date = ss.session_date ?? now;
      const updated_at = ss.updated_at || session_date || now;
      statements.push(env.DB.prepare(
        `INSERT INTO study_sessions (id, user_id, activity, duration, score, cards_studied, questions_asked, subject, grade, session_date, updated_at, deleted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
         ON CONFLICT(id) DO UPDATE SET
           activity=excluded.activity, duration=excluded.duration, score=excluded.score,
           cards_studied=excluded.cards_studied, questions_asked=excluded.questions_asked,
           subject=excluded.subject, grade=excluded.grade, session_date=excluded.session_date,
           updated_at=excluded.updated_at,
           deleted_at=CASE WHEN excluded.deleted_at IS NOT NULL THEN excluded.deleted_at ELSE study_sessions.deleted_at END
         WHERE (excluded.updated_at > COALESCE(study_sessions.updated_at, 0) OR excluded.deleted_at IS NOT NULL)
           AND (study_sessions.deleted_at IS NULL OR excluded.deleted_at IS NOT NULL)`
      ).bind(
        ss.id, userId, ss.activity, ss.duration ?? 0, ss.score ?? null,
        ss.cards_studied ?? 0, ss.questions_asked ?? 0, ss.subject ?? null, ss.grade ?? null,
        session_date, updated_at, ss.deleted_at || null
      ));
      results.synced.sessions++;
    };

    // Process all items
    exams.forEach(upsertExam);
    decks.forEach(upsertDeck);
    cards.forEach(upsertCard);
    chats.forEach(upsertChat);
    sessions.forEach(upsertSession);

    // Execute batch (max ~500 statements safe for Workers)
    if (statements.length > 0 && statements.length <= 500) {
      const batchResults = await env.DB.batch(statements);
      results.batch_results = { success: batchResults.length, total: statements.length };
    } else if (statements.length > 500) {
      results.errors.push('Batch exceeded 500 statements limit');
    }

    return successResponse(results, `Synced ${results.synced.exams + results.synced.decks + results.synced.cards + results.synced.chats + results.synced.sessions} items`);
  } catch (error: any) {
    console.error('Sync Error:', error);
    return errorResponse(`Sync failed: ${error.message}`, 500);
  }
});

// Get changes since a timestamp (milliseconds since epoch)
router.get('/api/sync/changes', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const url = new URL(request.url);
    const since = parseInt(url.searchParams.get('since') || '0');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    const result: any = {};

    // Filter deleted_at IS NULL for all queries
    const whereClause = `user_id = ? AND updated_at >= ? AND deleted_at IS NULL`;

    // Exams
    const examsRes = await env.DB.prepare(
      `SELECT * FROM exams WHERE ${whereClause} ORDER BY updated_at ASC LIMIT ?`
    )
    .bind(userId, since, limit)
    .all();
    result.exams = examsRes.results.map((r: any) => ({
      ...r,
      questions: JSON.parse(r.questions || '[]'),
      answers: r.answers ? JSON.parse(r.answers) : null
    }));

    // Decks
    const decksRes = await env.DB.prepare(
      `SELECT * FROM flashcard_decks WHERE ${whereClause} ORDER BY updated_at ASC LIMIT ?`
    )
    .bind(userId, since, limit)
    .all();
    result.decks = decksRes.results;

    // Cards (join with decks for user ownership)
    const cardsRes = await env.DB.prepare(
      `SELECT f.* FROM flashcards f
       JOIN flashcard_decks d ON f.deck_id = d.id
       WHERE d.user_id = ? AND f.updated_at >= ? AND f.deleted_at IS NULL AND d.deleted_at IS NULL
       ORDER BY f.updated_at ASC LIMIT ?`
    )
    .bind(userId, since, limit)
    .all();
    result.cards = cardsRes.results.map((c: any) => ({
      ...c,
      tags: c.tags ? JSON.parse(c.tags) : []
    }));

    // Chats
    const chatsRes = await env.DB.prepare(
      `SELECT * FROM chat_sessions WHERE ${whereClause} ORDER BY updated_at ASC LIMIT ?`
    )
    .bind(userId, since, limit)
    .all();
    result.chats = chatsRes.results.map((s: any) => ({
      ...s,
      messages: JSON.parse(s.messages || '[]')
    }));

    // Study sessions
    const sessionsRes = await env.DB.prepare(
      `SELECT * FROM study_sessions WHERE ${whereClause} ORDER BY session_date ASC LIMIT ?`
    )
    .bind(userId, since, limit)
    .all();
    result.sessions = sessionsRes.results;

    return successResponse({
      ...result,
      since,
      limit,
      timestamp: Date.now()
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= KNOWLEDGE BASE =============

router.post('/api/knowledge/resources', async (request, env: Env) => {
  try {
    await requireAuth(request, env.DB);
    const body: any = await request.json();
    const resources = Array.isArray(body) ? body : body.resources;
    if (!Array.isArray(resources) || resources.length === 0) {
      return badRequestResponse('Danh sách tài nguyên trống');
    }

    for (const resource of resources) {
      await upsertKnowledgeResource(env.DB, resource);
    }

    return successResponse({ inserted: resources.length }, 'Đã thêm tài nguyên kiến thức');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/knowledge/resources', async (request, env: Env) => {
  try {
    await requireAuth(request, env.DB);
    const url = new URL(request.url);
    const grade = url.searchParams.get('grade') || undefined;
    const subject = url.searchParams.get('subject') || undefined;
    const topic = url.searchParams.get('topic') || undefined;
    const limit = url.searchParams.get('limit');

    const lessons = await queryKnowledgeResources(env.DB, {
      grade,
      subject,
      topic,
      limit: limit ? parseInt(limit) : undefined
    });

    return successResponse({ lessons });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/ai/context', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const url = new URL(request.url);
    const grade = url.searchParams.get('grade') || undefined;
    const subject = url.searchParams.get('subject') || undefined;
    const topic = url.searchParams.get('topic') || undefined;

    const context = await buildContextFromKnowledge(env.DB, {
      grade,
      subject,
      topic,
      limit: 8
    });

    return successResponse({
      ...context,
      userId
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= MANAGEMENT =============

router.post('/api/management/update-user', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();

    // In a real app, you might want to check for Admin role here
    // const user = await getUserById(env.DB, userId);
    // if (user.role !== 'admin') return unauthorizedResponse('Admin access required');

    const { targetUserId, data } = body;
    const idToUpdate = targetUserId || userId; // Allow updating self if no target provided

    const updatedUser = await updateUserData(env.DB, idToUpdate, data);
    return successResponse(updatedUser, 'User data updated successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.post('/api/management/change-password', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();

    const { targetUserId, newPassword } = body;
    const idToUpdate = targetUserId || userId;

    await changeUserPasswordAdmin(env.DB, idToUpdate, newPassword);
    return successResponse(null, 'Password changed successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// 404
router.all('*', () => errorResponse('Not Found', 404));

// Export handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      return await router.handle(request, env, ctx);
    } catch (error: any) {
      return errorResponse(error.message || 'Internal Server Error', 500);
    }
  },
};
