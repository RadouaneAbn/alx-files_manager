import dbClient from '../utils/db'
import sha1 from 'sha1';


class UsersController {
    static async postNew (req, res) {
        const users = dbClient.usersCollection;
        const {email, password} = req.body;
        if (!email) {
            return res.status(400).json({error: 'Missing email'})
        } else if (!password) {
            return res.status(400).json({error: 'Missing password'});
        }
        const user = await users.findOne({email});
        if (user) {
            return res.status(400).json({error: 'Already exist'});
        }

        users.insertOne({email, password: sha1(password)})
        .then((result) => {
            res.status(201).json({id: result.insertedId, email})
        })
    }
}

module.exports = UsersController;