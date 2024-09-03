import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => { console.log(err); });

    this.getKey = promisify(this.client.get).bind(this.client);
    this.setKey = promisify(this.client.set).bind(this.client);
    this.delKey = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected === true;
  }

  async get(key) {
    const value = await this.getKey(key);
    return value;
  }

  async set(key, value, duration) {
    await this.setKey(key, value, 'EX', duration);
    return value;
  }

  async del(key) {
    await this.delKey(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
