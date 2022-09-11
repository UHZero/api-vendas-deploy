interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: 'aureo.moraes@uhzero.com.br',
      name: 'Áureo Moraes Filho',
    },
  },
} as IMailConfig;
