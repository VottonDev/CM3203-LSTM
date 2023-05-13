import Hapi from '@hapi/hapi';
import prisma from '../../common/prisma.js';

// Return the latest data for a symbol.
export const latestPlugin: Hapi.Plugin<null> = {
  name: 'latest',
  register: async (server: Hapi.Server) => {
    server.route({
      method: 'GET',
      path: '/data/latest',
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
          const symbol = request.query.stock;
          const latestData: any = await prisma.currentPrice.findFirst({
            where: {
              stock: {
                name: symbol,
              },
            },
            orderBy: {
              latestTime: 'desc',
            },
          });
          return h.response(latestData).code(200);
        },
      },
    });
  },
};

export default latestPlugin;
