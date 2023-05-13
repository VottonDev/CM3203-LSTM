import Hapi from '@hapi/hapi';
import prisma from '../../common/prisma.js';

export const predictionPlugin: Hapi.Plugin<null> = {
  name: 'prediction',
  register: async (server: Hapi.Server) => {
    server.route({
      method: 'GET',
      path: '/data/prediction',
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
          const stock = await prisma.stock.findUnique({
            where: {
              name: symbol,
            },
            include: {
              Prediction: true,
            },
          });

          if (!stock) {
            return h.response('Stock not found').code(404);
          }

          return h.response(stock.Prediction).code(200);
        },
      },
    });
  },
};

export default predictionPlugin;
