import prisma from '../config/prisma.js';
import geoip from 'geoip-lite';
import UAParser from 'ua-parser-js';

// Simple in-memory cache
const cache = new Map();

export const getUrlForRedirect = async (shortCode) => {
  // Check cache first
  if (cache.has(shortCode)) {
    const cachedUrl = cache.get(shortCode);
    if (!cachedUrl.expirationDate || new Date() < new Date(cachedUrl.expirationDate)) {
      return cachedUrl;
    }
  }

  const url = await prisma.url.findUnique({
    where: { shortCode }
  });

  if (!url) {
    throw new Error('NOT_FOUND');
  }

  if (url.expirationDate && new Date() > new Date(url.expirationDate)) {
    throw new Error('EXPIRED');
  }

  // Cache it for 5 minutes
  cache.set(shortCode, url);
  setTimeout(() => cache.delete(shortCode), 5 * 60 * 1000);

  return url;
};

export const trackClick = async (urlId, req) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgentStr = req.headers['user-agent'];
    const parser = new UAParser(userAgentStr);
    const parsedUa = parser.getResult();
    
    let location = 'Unknown';
    if (ipAddress) {
      const geo = geoip.lookup(ipAddress);
      if (geo) {
        location = `${geo.city}, ${geo.country}`;
      }
    }

    // Record click
    await prisma.click.create({
      data: {
        urlId,
        ipAddress,
        location,
        browser: parsedUa.browser.name || 'Unknown',
        device: parsedUa.device.type || 'desktop',
        os: parsedUa.os.name || 'Unknown',
      }
    });

    // Update analytics summary
    // Just increment total clicks for now, unique clicks logic can be complex (based on IP)
    const existingClickFromIp = await prisma.click.findFirst({
      where: { urlId, ipAddress }
    });

    const isUnique = !existingClickFromIp;

    await prisma.analytics.update({
      where: { urlId },
      data: {
        totalClicks: { increment: 1 },
        uniqueClicks: isUnique ? { increment: 1 } : undefined,
        lastClickedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    // don't throw, tracking should not break the redirect
  }
};
