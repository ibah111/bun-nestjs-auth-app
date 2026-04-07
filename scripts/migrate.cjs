const path = require('node:path');
const fs = require('node:fs');
const { Client } = require('pg');

const sleep = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));

const dbConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'USER',
  password: process.env.POSTGRES_PASSWORD || 'PASSWORD',
  database: process.env.POSTGRES_DATABASE || process.env.POSTGRES_DB || 'BASE',
};

const maxRetries = Number(process.env.DB_READY_RETRIES || 30);
const retryDelayMs = Number(process.env.DB_READY_DELAY_MS || 2000);

const projectRoot = path.resolve(__dirname, '..');
const migrationsDir = path.join(projectRoot, 'migrations');

const connectionConfig = {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
};

async function waitForDatabase() {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    const probeClient = new Client(connectionConfig);

    try {
      await probeClient.connect();
      await probeClient.end();
      console.log(`PostgreSQL is ready on attempt ${attempt}`);
      return;
    } catch (error) {
      lastError = error;
      await probeClient.end().catch(() => undefined);
      console.log(`Waiting for PostgreSQL (${attempt}/${maxRetries})...`);

      if (attempt < maxRetries) {
        await sleep(retryDelayMs);
      }
    }
  }

  throw lastError;
}

let exitCode = 0;

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) PRIMARY KEY,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getPendingMigrations(client) {
  const allMigrations = fs
    .readdirSync(migrationsDir)
    .filter((fileName) => fileName.endsWith('.cjs'))
    .sort();

  const { rows } = await client.query('SELECT name FROM schema_migrations');
  const executedMigrations = new Set(rows.map(({ name }) => name));

  return allMigrations.filter((fileName) => !executedMigrations.has(fileName));
}

async function runMigrations(client, migrationNames) {
  for (const migrationName of migrationNames) {
    const migrationPath = path.join(migrationsDir, migrationName);
    const migration = require(migrationPath);

    if (typeof migration.up !== 'function') {
      throw new Error(`Migration "${migrationName}" does not export an "up" function`);
    }

    console.log(`Applying migration: ${migrationName}`);

    await client.query('BEGIN');

    try {
      await migration.up(client);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [
        migrationName,
      ]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }
}

async function main() {
  const client = new Client(connectionConfig);

  try {
    console.log(
      `Connecting to PostgreSQL at ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`,
    );

    await waitForDatabase();
    await client.connect();
    await ensureMigrationsTable(client);

    const pendingMigrations = await getPendingMigrations(client);
    if (pendingMigrations.length > 0) {
      console.log(
        `Applying ${pendingMigrations.length} pending migration(s): ${pendingMigrations.join(
          ', ',
        )}`,
      );
    } else {
      console.log('No pending migrations');
    }

    await runMigrations(client, pendingMigrations);

    if (pendingMigrations.length > 0) {
      console.log(`Applied ${pendingMigrations.length} migration(s)`);
    }

    console.log('Database migrations completed successfully');
  } catch (error) {
    exitCode = 1;
    console.error('Database migration failed');
    console.error(error);
  } finally {
    await client.end().catch(() => undefined);
    process.exit(exitCode);
  }
}

main();
