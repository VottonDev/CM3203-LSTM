import Hapi from '@hapi/hapi';
import { PrismaClient } from '@prisma/client';
import emailInterface from '../email/emailInterface.js';
import prisma from '../../common/prisma.js';
import bcrypt from 'bcrypt';

// User registration using Prisma.
export const registerPlugin: Hapi.Plugin<null> = {
  name: 'register',
  register: async (server: Hapi.Server) => {
    server.route({
      method: 'POST',
      path: '/auth/register',
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
          const { email, password, confirmPassword } = request.payload as { email: string; password: string; confirmPassword: string };
          // Check if the user exists.
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (user) {
            return h.response({ message: 'User already exists.' }).code(400);
          }
          // Check if the password matches.
          if (password !== confirmPassword) {
            return h.response({ message: 'Passwords do not match.' }).code(400);
          }
          // Hash the password.
          const hashedPassword = await bcrypt.hash(password, 10);
          // Generate a random email verification token.
          const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          // Create the user and a email verification token.
          const newUser = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
            },
          });
          // Set the email verification token.
          const emailToken = await prisma.token.create({
            data: {
              emailToken: token,
              expiration: new Date(Date.now() + 1000 * 60 * 60 * 24),
              user: {
                connect: {
                  id: newUser.id,
                },
              },
            },
          });
          // Send the email verification token.
          await emailInterface.sendMail({
            from: '',
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking the link below: http://127.0.0.1:5173/auth/verify/${token}`,
          });
          // If successful, return the user.
          return newUser;
        },
      },
    });
  },
};

export default registerPlugin;
