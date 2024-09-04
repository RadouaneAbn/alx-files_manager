import { Router } from 'express';
import AppContorller from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const route = Router();

route.get('/status', AppContorller.getStatus);

route.get('/stats', AppContorller.getStats);

route.post('/users', UsersController.postNew);

module.exports = route;
