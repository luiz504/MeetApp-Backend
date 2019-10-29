import { Router } from 'express';
import multer from 'multer';

import authentication from './app/middleware/authorization';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import OrganizerController from './app/controllers/OrganizerController';
import SubscritionController from './app/controllers/SubscritionController';

const routes = new Router();

const updload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authentication);

routes.put('/users', UserController.update);

routes.post('/meetups', MeetupController.store);
routes.get('/meetups', MeetupController.index);
routes.put('/meetups/:meetupId', MeetupController.update);
routes.delete('/meetups/:meetupId', MeetupController.delete);

routes.post('/meetups/:meetupId/subscriptions', SubscritionController.store);

routes.get('/organizer', OrganizerController.index);

routes.post('/files', updload.single('file'), FileController.store);

export default routes;
