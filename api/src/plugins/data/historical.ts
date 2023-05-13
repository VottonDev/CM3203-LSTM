import Hapi from '@hapi/hapi';
import prisma from '../../common/prisma.js';

// Return all historical data for a symbol.
export const historicalPlugin: Hapi.Plugin<null> = {
  name: 'historical',
  register: async (server: Hapi.Server) => {
    server.route({
      method: 'GET',
      path: '/data/historical',
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
          const data = await prisma.historicalPrice.findMany({
            where: {
              stock: {
                name: symbol,
              },
            },
            orderBy: {
              priceDate: 'desc',
            },
          });
          return h.response(data).code(200);
        },
      },
    });
  },
};

export default historicalPlugin;
