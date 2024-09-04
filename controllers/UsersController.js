import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const users = dbClient.usersCollection;
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const user = await users.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const result = await users.insertOne({ email, password: sha1(password) });
    return res.status(201).json({ id: result.insertedId, email });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    console.log({ token });
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const authkey = `auth_${token}`;
    const userId = await redisClient.get(authkey);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log({ userId });
    const user = await dbClient.usersCollection.findOne({
      _id: new ObjectId(userId),
    });
    console.log({ user });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(200).json({ id: userId, email: user.email });
  }
}

module.exports = UsersController;
