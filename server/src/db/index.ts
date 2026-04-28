import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

let sqlInstance: ReturnType<typeof postgres> | null = null;

function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL or POSTGRES_URL environment variable is required');
  }
  return connectionString;
}

function getSql(): ReturnType<typeof postgres> {
  if (!sqlInstance) {
    const isVercel = process.env.VERCEL === '1';
    const connectionString = getConnectionString();
    sqlInstance = postgres(connectionString, {
      ssl: isVercel ? 'require' : false,
      max: isVercel ? 1 : 10,
      transform: {
        undefined: null
      }
    });
  }
  return sqlInstance;
}

function createSqlTemplateTag() {
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      const instance = getSql();
      if (prop === 'unsafe') {
        return (query: string, params?: any[]) => (instance as any).unsafe(query, params);
      }
      const value = (instance as any)[prop];
      if (typeof value === 'function') {
        return value.bind(instance);
      }
      return value;
    },
    apply(_target, _thisArg, args) {
      if (args.length === 1 && Array.isArray(args[0])) {
        return (getSql() as any)(args[0]);
      }
      return (getSql() as any)(...args);
    }
  };
  return new Proxy(function() {}, handler) as unknown as ReturnType<typeof postgres>;
}

export const sql: ReturnType<typeof postgres> & { unsafe: (q: string, p?: any[]) => any } = createSqlTemplateTag() as any;

export async function initDatabase(): Promise<void> {
  const db = getSql();
  const schemaPath = path.join(__dirname, 'schema.pg.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  await db.unsafe(schema);
  console.log('Database initialized');
}

export async function closeDatabase(): Promise<void> {
  if (sqlInstance) {
    await sqlInstance.end();
    sqlInstance = null;
  }
}