import Hapi from '@hapi/hapi';

// Logout
export const logoutPlugin: Hapi.Plugin<null> = {
  name: 'logout',
  register: async (server: Hapi.Server) => {
    server.route({
      method: 'GET',
      path: '/auth/logout',
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
          request.cookieAuth.clear();
          return h.response({ message: 'Logged out.' }).code(200);
        },
      },
    });
  },
};

export default logoutPlugin;
