"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
exports.initDatabase = initDatabase;
exports.closeDatabase = closeDatabase;
exports.getRedis = getRedis;
const postgres_1 = __importDefault(require("postgres"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const redis_1 = require("redis");
let sqlInstance = null;
let redisClient = null;
function getConnectionString() {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL or POSTGRES_URL environment variable is required');
    }
    return connectionString;
}
function getSql() {
    if (!sqlInstance) {
        const isVercel = process.env.VERCEL === '1';
        const connectionString = getConnectionString();
        sqlInstance = (0, postgres_1.default)(connectionString, {
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
    const handler = {
        get(_target, prop) {
            const instance = getSql();
            if (prop === 'unsafe') {
                return (query, params) => instance.unsafe(query, params);
            }
            const value = instance[prop];
            if (typeof value === 'function') {
                return value.bind(instance);
            }
            return value;
        },
        apply(_target, _thisArg, args) {
            if (args.length === 1 && Array.isArray(args[0])) {
                return getSql()(args[0]);
            }
            return getSql()(...args);
        }
    };
    return new Proxy(function () { }, handler);
}
exports.sql = createSqlTemplateTag();
async function initDatabase() {
    const db = getSql();
    const schemaPath = path.join(__dirname, 'schema.pg.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await db.unsafe(schema);
    console.log('Database initialized');
}
async function closeDatabase() {
    if (sqlInstance) {
        await sqlInstance.end();
        sqlInstance = null;
    }
}
async function getRedis() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        return null;
    }
    if (!redisClient) {
        redisClient = (0, redis_1.createClient)({ url: redisUrl });
        redisClient.on('error', (err) => console.error('Redis Client Error', err));
    }
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    return redisClient;
}
//# sourceMappingURL=index.js.map