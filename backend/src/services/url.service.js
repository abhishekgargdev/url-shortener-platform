import prisma from '../config/prisma.js';
import { generateShortCode } from '../utils/generateShortCode.js';

export const createShortUrl = async (originalUrl, customCode, expirationDate, userId) => {
  let shortCode = customCode;

  if (shortCode) {
    const existingUrl = await prisma.url.findUnique({ where: { shortCode } });
    if (existingUrl) {
      throw new Error('COLLISION');
    }
  } else {
    let isUnique = false;
    while (!isUnique) {
      shortCode = generateShortCode();
      const existingUrl = await prisma.url.findUnique({ where: { shortCode } });
      if (!existingUrl) {
        isUnique = true;
      }
    }
  }

  const url = await prisma.url.create({
    data: {
      originalUrl,
      shortCode,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
      userId: userId || null, // Optional user affiliation
      analytics: {
        create: {
          totalClicks: 0,
          uniqueClicks: 0,
        }
      }
    },
    include: {
      analytics: true
    }
  });

  return url;
};

export const getUrlsByUser = async (userId) => {
  return prisma.url.findMany({
    where: { userId },
    include: {
      analytics: true,
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getUrlById = async (id, userId) => {
  const url = await prisma.url.findUnique({
    where: { id: parseInt(id) },
    include: { analytics: true }
  });

  if (!url) throw new Error('NOT_FOUND');
  if (url.userId !== userId) throw new Error('UNAUTHORIZED');

  return url;
};

export const updateUrl = async (id, userId, data) => {
  const url = await getUrlById(id, userId);

  return prisma.url.update({
    where: { id: parseInt(id) },
    data: {
      originalUrl: data.originalUrl || url.originalUrl,
      expirationDate: data.expirationDate !== undefined ? (data.expirationDate ? new Date(data.expirationDate) : null) : url.expirationDate,
    },
  });
};

export const deleteUrl = async (id, userId) => {
  await getUrlById(id, userId);
  await prisma.url.delete({ where: { id: parseInt(id) } });
};
