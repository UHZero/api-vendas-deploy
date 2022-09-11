import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppErrors';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UsersTokensRepository from '../typeorm/repositories/UsersTokensRepository';
import Ethereal from '@config/mail/Ethereal';
import SESMail from '@config/mail/SESMail';
import mailConfig from '@config/mail/mail';
import path from 'path';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UsersTokensRepository);

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists!');
    }

    const { token } = await userTokensRepository.generate(user.id);

    const forgotMailTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    if (mailConfig.driver === 'ses') {
      await SESMail.sendMail({
        to: {
          name: user.name,
          email: user.email,
        },
        subject: '[API Vendas] - Password Recovery Key',
        templateData: {
          file: forgotMailTemplate,
          variables: {
            name: user.name,
            link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
          },
        },
      });
      return;
    }

    await Ethereal.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] - Password Recovery Key',
      templateData: {
        file: forgotMailTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
