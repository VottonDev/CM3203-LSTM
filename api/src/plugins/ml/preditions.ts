import Hapi from '@hapi/hapi';
import prisma from '../../common/prisma.js';

export const predictionPlugin: Hapi.Plugin<null> = {
  name: 'fetchMLPredictions',
  register: async (server: Hapi.Server) => {
    server.route({
      method: 'GET',
      path: '/ml/predictions',
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
          const data = await prisma.prediction.findMany({
            where: {
              stock: {
                name: symbol,
              },
            },
          });
          return h.response(data).code(200);
        },
      },
    });
  },
};

export default predictionPlugin;
