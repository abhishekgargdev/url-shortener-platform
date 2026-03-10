import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

export const registerUser = async (email, password) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('USER_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return user;
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  return user;
};

export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, createdAt: true },
  });
};
