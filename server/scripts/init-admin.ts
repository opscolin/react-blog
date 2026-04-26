import bcrypt from 'bcrypt';
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  console.error('DATABASE_URL or POSTGRES_URL environment variable is required');
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: 'require' });

const schemaPath = path.join(__dirname, '../src/db/schema.pg.sql');
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  await sql.unsafe(schema);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('=== Blog Admin Account Initialization ===\n');

  const username = await question('Enter admin username (default: admin): ');
  const finalUsername = username.trim() || 'admin';

  const password = await question('Enter admin password: ');
  if (!password) {
    console.error('Password is required');
    process.exit(1);
  }

  const existingResult = await sql`SELECT id FROM users WHERE username = ${finalUsername}`;
  const existing = existingResult[0];

  if (existing) {
    console.log(`User "${finalUsername}" already exists. Updating password...`);
    const hash = await bcrypt.hash(password, 12);
    await sql`UPDATE users SET password_hash = ${hash} WHERE username = ${finalUsername}`;
    console.log('Password updated successfully!');
  } else {
    console.log(`Creating user "${finalUsername}"...`);
    const hash = await bcrypt.hash(password, 12);
    await sql`INSERT INTO users (username, password_hash) VALUES (${finalUsername}, ${hash})`;
    console.log('Admin account created successfully!');
  }

  rl.close();
  await sql.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});