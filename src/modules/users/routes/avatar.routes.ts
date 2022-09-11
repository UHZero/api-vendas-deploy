import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import UserAvatarController from '../controllers/UserAvatarController';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';

const avatarRouter = Router();
const avatarController = new UserAvatarController();
const upload = multer(uploadConfig.multer);

avatarRouter.patch(
  '/',
  isAuthenticated,
  upload.single('avatar'),
  avatarController.update,
);

export default avatarRouter;
