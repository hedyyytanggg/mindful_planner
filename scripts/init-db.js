#!/usr/bin/env node

/**
 * Database Initialization Script
 * 
 * This script sets up the PostgreSQL database with the required schema.
 * 
 * Usage:
 *   node scripts/init-db.js
 * 
 * Make sure DATABASE_URL is set in your .env.local file first!
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const dropSchema = `
  -- Drop all existing tables (in reverse order of dependencies)
  DROP TABLE IF EXISTS project_updates CASCADE;
  DROP TABLE IF EXISTS projects CASCADE;
  DROP TABLE IF EXISTS reflections_today CASCADE;
  DROP TABLE IF EXISTS focus_tomorrow CASCADE;
  DROP TABLE IF EXISTS little_joys CASCADE;
  DROP TABLE IF EXISTS recharge_zones CASCADE;
  DROP TABLE IF EXISTS make_it_happen CASCADE;
  DROP TABLE IF EXISTS quick_wins CASCADE;
  DROP TABLE IF EXISTS deep_work_zones CASCADE;
  DROP TABLE IF EXISTS core_memories CASCADE;
  DROP TABLE IF EXISTS daily_plans CASCADE;
  DROP TABLE IF EXISTS users CASCADE;
`;

const initSchema = `
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(25) PRIMARY KEY NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'UTC',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Daily plans table
  CREATE TABLE IF NOT EXISTS daily_plans (
    id VARCHAR(25) PRIMARY KEY NOT NULL,
    userId VARCHAR(25) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    planDate DATE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, planDate)
  );

  -- Deep work zones table (individual tasks)
  CREATE TABLE IF NOT EXISTS deep_work_zones (
    id VARCHAR(25) PRIMARY KEY NOT NULL,
    planId VARCHAR(25) NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    timeEstimate INTEGER,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Quick wins table
  CREATE TABLE IF NOT EXISTS quick_wins (
    id VARCHAR(25) PRIMARY KEY NOT NULL,
    planId VARCHAR(25) NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Make it happen table
  CREATE TABLE IF NOT EXISTS make_it_happen (
    id VARCHAR(25) PRIMARY KEY NOT NULL,
    planId VARCHAR(25) NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
    task VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Recharge zones table
  CREATE TABLE IF NOT EXISTS recharge_zones (
    id VARCHAR(25) PRIMARY KEY NOT NULL,
    planId VARCHAR(25) NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
    activityId VARCHAR(255),
    customActivity VARCHAR(255),
    completed BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Little joys table
  CREATE TABLE IF NOT EXISTS little_joys (
    id VARCHAR(25) PRIMARY KEY NOT NULL,
    planId VARCHAR(25) NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
    joy TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Reflections today table
  CREATE TABLE IF NOT EXISTS reflections_today (
    id VARCHAR(25) PRIMARY KEY NOT NULL,
    planId VARCHAR(25) NOT NULL UNIQUE REFERENCES daily_plans(id) ON DELETE CASCADE,
    content TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Focus tomorrow table
  CREATE TABLE IF NOT EXISTS focus_tomorrow (
    id VARCHAR(25) PRIMARY KEY NOT NULL,
    planId VARCHAR(25) NOT NULL UNIQUE REFERENCES daily_plans(id) ON DELETE CASCADE,
    content TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Core memories table
  CREATE TABLE IF NOT EXISTS core_memories (
    id VARCHAR(25) PRIMARY KEY NOT NULL,
    userId VARCHAR(25) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    memoryDate DATE NOT NULL,
    tags JSONB DEFAULT '[]',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Projects/Hobbies table
  CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(25) PRIMARY KEY NOT NULL,
    userId VARCHAR(25) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Project updates table
  CREATE TABLE IF NOT EXISTS project_updates (
    id VARCHAR(25) PRIMARY KEY NOT NULL,
    projectId VARCHAR(25) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    planId VARCHAR(25) NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
    updateDate DATE NOT NULL,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create indexes for faster queries
  CREATE INDEX IF NOT EXISTS idx_daily_plans_userId ON daily_plans(userId);
  CREATE INDEX IF NOT EXISTS idx_daily_plans_planDate ON daily_plans(planDate);
  CREATE INDEX IF NOT EXISTS idx_deep_work_zones_planId ON deep_work_zones(planId);
  CREATE INDEX IF NOT EXISTS idx_quick_wins_planId ON quick_wins(planId);
  CREATE INDEX IF NOT EXISTS idx_core_memories_userId ON core_memories(userId);
  CREATE INDEX IF NOT EXISTS idx_core_memories_memoryDate ON core_memories(memoryDate);
  CREATE INDEX IF NOT EXISTS idx_projects_userId ON projects(userId);
  CREATE INDEX IF NOT EXISTS idx_project_updates_projectId ON project_updates(projectId);
  CREATE INDEX IF NOT EXISTS idx_project_updates_planId ON project_updates(planId);
  CREATE INDEX IF NOT EXISTS idx_project_updates_updateDate ON project_updates(updateDate);
`;

async function initDb() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
    });

    try {
        console.log('📦 Initializing database...');
        console.log(`📍 Database URL: ${process.env.DATABASE_URL}`);

        const client = await pool.connect();

        // Drop existing schema first
        console.log('🗑️  Dropping existing tables...');
        await client.query(dropSchema);

        // Create new schema
        console.log('🔨 Creating new schema...');
        await client.query(initSchema);

        client.release();

        console.log('✅ Database schema created successfully!');
        console.log('📊 Tables created:');
        console.log('  - users');
        console.log('  - daily_plans');
        console.log('  - deep_work_zones');
        console.log('  - quick_wins');
        console.log('  - make_it_happen');
        console.log('  - recharge_zones');
        console.log('  - little_joys');
        console.log('  - reflections_today');
        console.log('  - focus_tomorrow');
        console.log('  - core_memories');
        console.log('  - projects');
        console.log('  - project_updates');
        console.log('✨ All indexes created successfully!');
        console.log('');
        console.log('🎉 Ready to use! Start your app with: npm run dev');
    } catch (error) {
        console.error('❌ Database initialization failed:');
        console.error(error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

initDb();
