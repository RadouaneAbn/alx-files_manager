import { Router } from 'express';
import AppContorller from '../controllers/AppController';

const route = Router();

route.get('/status', AppContorller.getStatus);

route.get('/stats', AppContorller.getStats);

module.exports = route;
