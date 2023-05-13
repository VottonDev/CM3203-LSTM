import Hapi from '@hapi/hapi';
import prisma from '../../common/prisma.js';
import emailInterface from '../email/emailInterface.js';

// Verify email using Prisma.
export const verifyPlugin: Hapi.Plugin<null> = {
  name: 'verify',
  register: async (server: Hapi.Server) => {
    server.route({
      method: 'GET',
      path: '/auth/verify/{token}',
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
          const { token } = request.params as { token: string };
          // Check if the token exists.
          const tokenExists = await prisma.token.findUnique({
            where: {
              emailToken: token,
            },
          });
          if (!tokenExists) {
            return h
              .response({ message: 'Token does not exist. Double check that you opened the link correctly, if the token expired, then a new one will be sent to you shortly.' })
              .code(400);
          }
          // Check if the token has expired.
          if (tokenExists.expiration < new Date()) {
            // Generate a new token.
            const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            // Set the new token.
            const newTokenSet = await prisma.token.update({
              where: {
                id: tokenExists.id,
              },
              data: {
                emailToken: newToken,
                expiration: new Date(Date.now() + 1000 * 60 * 60 * 24),
              },
            });
            // Send the new token through email.
            const email = await prisma.user.findUnique({
              where: {
                id: tokenExists.userId,
              },
            });
            if (email) {
              await emailInterface.sendMail({
                from: '',
                to: email.email,
                subject: 'Verify your email',
                text: `Please verify your email by clicking the link below: http://127.0.0.1:5173/auth/verify/${newToken}`,
              });
            }
            return h.response({ message: 'Token has expired. A new token has been sent to your email.' }).code(400);
          }
          // Check if the user exists.
          const user = await prisma.user.findUnique({
            where: {
              id: tokenExists.userId,
            },
          });
          if (!user) {
            return h.response({ message: 'User does not exist.' }).code(400);
          }
          // Set verified to true.
          const verified = await prisma.user.update({
            where: {
              id: tokenExists.userId,
            },
            data: {
              verified: true,
            },
          });
          // If successful, return true.
          return verified;
        },
      },
    });
  },
};

export default verifyPlugin;
