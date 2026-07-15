import type { Db, MongoClient } from 'mongodb';

/**
 * MongoDB connection with a graceful fallback (ADR-02).
 *
 * If MONGODB_URI is set, we open a single pooled client (memoised on
 * `globalThis` in dev so HMR doesn't leak connections) and return the DB
 * handle. If it isn't set, we return `null` — callers treat that as
 * "log-only mode" so the app runs before the user provisions Atlas.
 *
 * The MongoClient is imported dynamically so bundlers can code-split it
 * out of pages that never call getDb() (i.e. the entire public site).
 */

type CachedClient = { promise: Promise<MongoClient> | null; client: MongoClient | null };

declare global {
  var __nimikhMongo: CachedClient | undefined;
}

const cache: CachedClient = globalThis.__nimikhMongo ?? { promise: null, client: null };
if (process.env.NODE_ENV !== 'production') globalThis.__nimikhMongo = cache;

async function getClient(): Promise<MongoClient | null> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) return null;
  if (cache.client) return cache.client;
  if (!cache.promise) {
    const { MongoClient } = await import('mongodb');
    cache.promise = new MongoClient(uri, {
      // Reasonable defaults for a serverless/edge-adjacent workload.
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
    })
      .connect()
      .then((c) => {
        cache.client = c;
        return c;
      })
      .catch((err) => {
        cache.promise = null;
        throw err;
      });
  }
  return cache.promise;
}

export async function getDb(): Promise<Db | null> {
  try {
    const client = await getClient();
    if (!client) return null;
    return client.db(process.env.MONGODB_DB ?? 'nimikh');
  } catch (err) {
    console.error('[db] connection failed — falling back to log-only mode:', err);
    return null;
  }
}

export const COLLECTIONS = {
  leads: 'leads',
  feedback: 'feedback',
  clients: 'clients',
  creators: 'creators',
} as const;
