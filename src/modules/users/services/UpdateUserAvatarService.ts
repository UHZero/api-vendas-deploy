import uploadConfig from '@config/upload';
import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppErrors';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import User from '../typeorm/entities/User';
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider';
import S3StorageProvider from '@shared/providers/StorageProvider/S3StorageProvider';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found!');
    }

    if (!uploadConfig.driver) {
      throw new AppError(
        'Server is under maintenance, please wait a moment and try again later!',
        503,
      );
    }

    if (uploadConfig.driver === 's3') {
      const S3Provider = new S3StorageProvider();
      if (user.avatar) {
        await S3Provider.deleteFile(user.avatar);
      }
      const fileName = await S3Provider.saveFile(avatarFileName);
      user.avatar = fileName;
    }

    if (uploadConfig.driver === 'disk') {
      const diskProvider = new DiskStorageProvider();
      if (user.avatar) {
        await diskProvider.deleteFile(user.avatar);
      }
      const fileName = await diskProvider.saveFile(avatarFileName);
      user.avatar = fileName;
    }

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
