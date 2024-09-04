import { Router } from 'express';
import AppContorller from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

const route = Router();

route.get('/status', AppContorller.getStatus);

route.get('/stats', AppContorller.getStats);

route.post('/users', UsersController.postNew);

route.get('/connect', AuthController.getConnect);

route.get('/disconnect', AuthController.getDisconnect);

route.get('/users/me', UsersController.getMe);

module.exports = route;
