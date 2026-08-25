import config from "../../config";
import Redis from "ioredis";

export interface OTPRecord {
  hash: string;
  expiresAt: number; // Timestamp in ms
  attempts: number;
  lastSentAt: number; // Timestamp in ms
}

export interface IOTPStore {
  set(email: string, record: OTPRecord): Promise<void>;
  get(email: string): Promise<OTPRecord | null>;
  delete(email: string): Promise<void>;
}

// In-Memory Store Implementation for Development / Fallback
class MemoryOTPStore implements IOTPStore {
  private store = new Map<string, OTPRecord>();

  async set(email: string, record: OTPRecord): Promise<void> {
    const key = email.toLowerCase().trim();
    this.store.set(key, record);
  }

  async get(email: string): Promise<OTPRecord | null> {
    const key = email.toLowerCase().trim();
    const record = this.store.get(key);
    if (!record) return null;

    // Auto-cleanup expired record
    if (Date.now() > record.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return record;
  }

  async delete(email: string): Promise<void> {
    const key = email.toLowerCase().trim();
    this.store.delete(key);
  }
}

// Redis Store Implementation for Production
class RedisOTPStore implements IOTPStore {
  private redis: Redis;

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
    this.redis.connect().catch((err) => {
      console.warn("[Redis OTP Store Warning] Connection failed, fallback active:", err.message);
    });
  }

  async set(email: string, record: OTPRecord): Promise<void> {
    const key = `otp:${email.toLowerCase().trim()}`;
    const ttlSeconds = Math.max(1, Math.ceil((record.expiresAt - Date.now()) / 1000));
    await this.redis.set(key, JSON.stringify(record), "EX", ttlSeconds);
  }

  async get(email: string): Promise<OTPRecord | null> {
    const key = `otp:${email.toLowerCase().trim()}`;
    const raw = await this.redis.get(key);
    if (!raw) return null;
    try {
      const record = JSON.parse(raw) as OTPRecord;
      if (Date.now() > record.expiresAt) {
        await this.delete(email);
        return null;
      }
      return record;
    } catch {
      return null;
    }
  }

  async delete(email: string): Promise<void> {
    const key = `otp:${email.toLowerCase().trim()}`;
    await this.redis.del(key);
  }
}

// Export singleton instance based on environment & redis configuration
const memoryStore = new MemoryOTPStore();
export const otpStore: IOTPStore =
  config.nodeEnv === "production" && config.redisUrl
    ? new RedisOTPStore(config.redisUrl)
    : memoryStore;
