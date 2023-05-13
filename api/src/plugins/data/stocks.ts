import Hapi from '@hapi/hapi';
import prisma from '../../common/prisma.js';

// Return all available symbols.
export const symbolsPlugin: Hapi.Plugin<null> = {
  name: 'symbols',
  register: async (server: Hapi.Server) => {
    server.route({
      method: 'GET',
      path: '/data/stocks',
      options: {
        auth: {
          mode: 'try',
          strategy: 'session',
        },
        plugins: {
          cookie: {
            redirectTo: false,
          },
        },
        handler: async (request, h) => {
          const data = await prisma.stock.findMany({
            select: {
              name: true,
            },
          });
          return h.response(data).code(200);
        },
      },
    });
  },
};

export default symbolsPlugin;
