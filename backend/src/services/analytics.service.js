import prisma from '../config/prisma.js';

export const getAnalyticsForUrl = async (urlId, userId) => {
  const url = await prisma.url.findUnique({
    where: { id: parseInt(urlId) },
    include: {
      analytics: true,
      clicks: {
        orderBy: { createdAt: 'desc' },
        take: 100 // Last 100 clicks
      }
    }
  });

  if (!url) throw new Error('NOT_FOUND');
  if (url.userId && url.userId !== userId) throw new Error('UNAUTHORIZED');

  return url;
};
