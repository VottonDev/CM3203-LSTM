import Hapi from '@hapi/hapi';
import hapiAuthCookie from '@hapi/cookie';
import * as dotenv from 'dotenv';
import registerPlugin from './plugins/auth/register.js';
import loginPlugin from './plugins/auth/login.js';
import verifyPlugin from './plugins/auth/verify.js';
import logoutPlugin from './plugins/auth/logout.js';
import symbolsPlugin from './plugins/data/stocks.js';
import historicalPlugin from './plugins/data/historical.js';
import latestPlugin from './plugins/data/latest.js';
import predictionsPlugin from './plugins/data/predictions.js';
import predictionsReceivePlugin from './plugins/ml/preditions.js';
import prisma from './common/prisma.js';
dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: '127.0.0.1',
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
      },
    },
  });

  await server.register(hapiAuthCookie);

  server.auth.strategy('session', 'cookie', {
    cookie: {
      ttl: 24 * 60 * 60 * 1000,
      clearInvalid: true,
      name: 'sid-cm3203',
      password: process.env.COOKIEPASSWORD || '2kGt3ENW3rjmh78d7gqc6pPeQS9o4rMKPKcWyAk6KU4LTch39NUGjNBL3ULoQaVC',
      isSecure: false,
      isSameSite: 'Lax',
      path: '/',
      domain: '127.0.0.1',
    },
    validate: async (request, session: any) => {
      const user = await prisma.user.findUnique({
        where: {
          id: session.id,
        },
      });
      if (!user) {
        return { isValid: false };
      }
      return { isValid: true, credentials: user };
    },
  });

  server.auth.default('session');

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'You have reached the API server.';
    },
  });

  // Auth routes
  await server.register({
    plugin: registerPlugin,
  }),
    await server.register({
      plugin: verifyPlugin,
    }),
    await server.register({
      plugin: loginPlugin,
    }),
    await server.register({
      plugin: logoutPlugin,
    });
  // Data routes
  await server.register({
    plugin: symbolsPlugin,
  });
  await server.register({
    plugin: historicalPlugin,
  });
  await server.register({
    plugin: latestPlugin,
  });
  await server.register({
    plugin: predictionsPlugin,
  });
  // Receive data from ML
  await server.register({
    plugin: predictionsReceivePlugin,
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
