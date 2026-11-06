-- ==============================================================================
-- LangLearn Production Database Schema
-- Compatible with PostgreSQL 15+ / SQLite 3
-- ==============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'learner' CHECK (role IN ('learner', 'tutor', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 2. User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    native_language VARCHAR(10) NOT NULL DEFAULT 'en',
    target_language VARCHAR(10) NOT NULL DEFAULT 'es',
    daily_goal_minutes INTEGER NOT NULL DEFAULT 15,
    theme VARCHAR(10) NOT NULL DEFAULT 'system',
    sound_effects BOOLEAN NOT NULL DEFAULT TRUE,
    ai_feedback_level VARCHAR(20) NOT NULL DEFAULT 'conversational'
);

-- 3. Languages
CREATE TABLE IF NOT EXISTS languages (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50) NOT NULL,
    flag_emoji VARCHAR(10) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 4. Courses
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(36) PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    cefr_level VARCHAR(10) NOT NULL CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    category VARCHAR(50) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Lessons
CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    type VARCHAR(30) NOT NULL CHECK (type IN ('vocabulary', 'grammar', 'dialogue', 'listening', 'quiz')),
    duration_minutes INTEGER NOT NULL DEFAULT 5,
    xp_reward INTEGER NOT NULL DEFAULT 20,
    order_index INTEGER NOT NULL DEFAULT 0
);

-- 6. Vocabulary Items
CREATE TABLE IF NOT EXISTS vocabulary_items (
    id VARCHAR(36) PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code),
    term VARCHAR(100) NOT NULL,
    phonetic VARCHAR(100),
    part_of_speech VARCHAR(30) NOT NULL,
    translation VARCHAR(255) NOT NULL,
    example_sentence TEXT,
    example_translation TEXT,
    audio_url TEXT
);

-- 7. User Progress & Spaced Repetition (SRS)
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id VARCHAR(36) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    score_percentage INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS user_vocabulary_mastery (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vocab_id VARCHAR(36) NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
    interval_days INTEGER NOT NULL DEFAULT 1,
    ease_factor NUMERIC(3, 2) NOT NULL DEFAULT 2.50,
    times_reviewed INTEGER NOT NULL DEFAULT 0,
    next_review_at TIMESTAMP WITH TIME ZONE NOT NULL,
    mastery_status VARCHAR(20) NOT NULL DEFAULT 'learning',
    UNIQUE(user_id, vocab_id)
);

-- Indexes for maximum query performance
CREATE INDEX IF NOT EXISTS idx_courses_lang ON courses(language_code);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_vocab_lang ON vocabulary_items(language_code);
CREATE INDEX IF NOT EXISTS idx_user_vocab_due ON user_vocabulary_mastery(user_id, next_review_at);
