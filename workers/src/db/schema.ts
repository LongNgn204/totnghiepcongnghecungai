// Drizzle ORM Schema for Cloudflare D1
import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';

// ============= AUTHENTICATION TABLES =============

export const authUsers = sqliteTable('auth_users', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    displayName: text('display_name').notNull(),
    avatar: text('avatar'),
    bio: text('bio'),
    role: text('role').default('user'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at'),
    lastLogin: integer('last_login'),
    isActive: integer('is_active').default(1),
    isAdmin: integer('is_admin').default(0),
});

export const authSessions = sqliteTable('auth_sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: integer('expires_at').notNull(),
    createdAt: integer('created_at').notNull(),
});

export const passwordResetTokens = sqliteTable('password_reset_tokens', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: integer('expires_at').notNull(),
    createdAt: integer('created_at').notNull(),
    used: integer('used').default(0),
});

// ============= LEGACY USER TABLE =============

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    name: text('name').notNull().default('Học sinh'),
    email: text('email').unique(),
    avatar: text('avatar'),
    createdAt: integer('created_at').notNull(),
    lastActive: integer('last_active').notNull(),
});

// ============= EXAM TABLES =============

export const exams = sqliteTable('exams', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    category: text('category').notNull(),
    grade: integer('grade').notNull(),
    questions: text('questions').notNull(), // JSON string
    answers: text('answers'), // JSON string
    score: real('score'),
    totalQuestions: integer('total_questions').notNull(),
    duration: integer('duration'),
    completedAt: integer('completed_at').notNull(),
});

// ============= FLASHCARD TABLES =============

export const flashcardDecks = sqliteTable('flashcard_decks', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    category: text('category').notNull(),
    grade: integer('grade').notNull(),
    isPublic: integer('is_public').default(0),
    color: text('color').default('blue'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
});

export const flashcards = sqliteTable('flashcards', {
    id: text('id').primaryKey(),
    deckId: text('deck_id').notNull().references(() => flashcardDecks.id, { onDelete: 'cascade' }),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    difficulty: text('difficulty').default('medium'),
    tags: text('tags'), // JSON string
    easeFactor: real('ease_factor').default(2.5),
    interval: integer('interval').default(0),
    repetitions: integer('repetitions').default(0),
    masteryLevel: integer('mastery_level').default(0),
    reviewCount: integer('review_count').default(0),
    correctCount: integer('correct_count').default(0),
    nextReview: integer('next_review'),
    lastReviewed: integer('last_reviewed'),
    createdAt: integer('created_at').notNull(),
});

// ============= CHAT TABLES =============

export const chatSessions = sqliteTable('chat_sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    category: text('category'),
    grade: integer('grade'),
    messages: text('messages').notNull(), // JSON string
    messageCount: integer('message_count').default(0),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
});

// ============= PROGRESS TABLES =============

export const studySessions = sqliteTable('study_sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    activity: text('activity').notNull(),
    duration: integer('duration').default(0),
    score: real('score'),
    cardsStudied: integer('cards_studied').default(0),
    questionsAsked: integer('questions_asked').default(0),
    subject: text('subject'),
    grade: integer('grade'),
    sessionDate: integer('session_date').notNull(),
});

export const studyGoals = sqliteTable('study_goals', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    type: text('type').notNull(),
    target: integer('target').notNull(),
    current: integer('current').default(0),
    unit: text('unit').notNull(),
    startDate: text('start_date').notNull(),
    endDate: text('end_date').notNull(),
    deadline: text('deadline'),
    completed: integer('completed').default(0),
    createdAt: integer('created_at').notNull(),
});

// ============= COMMUNITY TABLES =============

export const sharedResources = sqliteTable('shared_resources', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    resourceType: text('resource_type').notNull(),
    resourceId: text('resource_id').notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    category: text('category'),
    grade: integer('grade'),
    isPublic: integer('is_public').default(1),
    views: integer('views').default(0),
    likes: integer('likes').default(0),
    createdAt: integer('created_at').notNull(),
});

export const studyGroups = sqliteTable('study_groups', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    category: text('category').notNull(),
    createdBy: text('created_by').notNull(),
    isPublic: integer('is_public').default(1),
    memberCount: integer('member_count').default(1),
    createdAt: integer('created_at').notNull(),
});

export const groupMembers = sqliteTable('group_members', {
    groupId: text('group_id').notNull(),
    userId: text('user_id').notNull(),
    role: text('role').default('member'),
    points: integer('points').default(0),
    joinedAt: integer('joined_at').notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.groupId, table.userId] })
}));

export const groupMessages = sqliteTable('group_messages', {
    id: text('id').primaryKey(),
    groupId: text('group_id').notNull(),
    userId: text('user_id').notNull(),
    userName: text('user_name').notNull(),
    message: text('message').notNull(),
    timestamp: integer('timestamp').notNull(),
});
