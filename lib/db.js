import pg from 'pg';
// reuse one pool across hot reloads in dev
export const pool = globalThis.__pool ?? (globalThis.__pool = new pg.Pool({ connectionString: process.env.DATABASE_URL }));
