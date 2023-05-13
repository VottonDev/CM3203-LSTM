import Hapi from '@hapi/hapi';
import prisma from '../../common/prisma.js';
import bcrypt from 'bcrypt';

// User login using Prisma.
export const loginPlugin: Hapi.Plugin<null> = {
  name: 'login',
  register: async (server: Hapi.Server) => {
    server.route({
      method: 'POST',
      path: '/auth/login',
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
          const { email, password } = request.payload as { email: string; password: string };
          // Check if the user exists.
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (!user) {
            return h.response({ message: 'User does not exist.' }).code(400);
          }
          // Check if the password matches.
          const passwordMatches = await bcrypt.compare(password, user.password);
          if (!passwordMatches) {
            return h.response({ message: 'Incorrect password.' }).code(400);
          }
          // Check if the user is verified.
          if (!user.verified) {
            return h.response({ message: 'Please verify your email.' }).code(400);
          }
          // If successful, return the user and set the session cookie.
          request.cookieAuth.set({ id: user.id });
          return h.response(user).code(200);
        },
      },
    });
  },
};

export default loginPlugin;
