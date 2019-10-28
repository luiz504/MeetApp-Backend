import { Router } from 'express';
import multer from 'multer';

import authentication from './app/middleware/authorization';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';

const routes = new Router();

const updload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authentication);
routes.put('/users', UserController.update);

routes.post('/meetups', MeetupController.store);

routes.post('/files', updload.single('file'), FileController.store);

export default routes;
