import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const users = dbClient.usersCollection;
    const headerAuth = req.headers.authorization;
    const data = headerAuth.split(' ')[1];
    const [email, password] = Buffer.from(data, 'base64').toString('ascii').split(':');

    const user = await users.findOne({ email, password: sha1(password) });
    if (!user) {
      return res.status(400).json({ error: 'Unauthorized' });
    }
    const token = uuidv4();
    const authKey = `auth_${token}`;
    await redisClient.set(authKey, user._id.toString(), 24 * 60 * 60);
    return res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    const authKey = `auth_${token}`;
    const userId = await redisClient.get(authKey);
    if (userId) {
      await redisClient.del(authKey);
      res.status(204).json({});
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

module.exports = AuthController;
