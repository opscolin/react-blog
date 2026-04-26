import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';
const isVercel = process.env.VERCEL === '1';
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL or POSTGRES_URL environment variable is required');
}
const sql = postgres(connectionString, {
    ssl: isVercel ? 'require' : false,
    max: isVercel ? 1 : 10,
    transform: {
        undefined: null
    }
});
export async function initDatabase() {
    const schemaPath = path.join(__dirname, 'schema.pg.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await sql.unsafe(schema);
    console.log('Database initialized');
}
export { sql };
//# sourceMappingURL=index.js.map