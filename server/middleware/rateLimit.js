// Simple in-memory rate limiter
const requests = new Map();
const MAX_REQUESTS = 100;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientId(req) {
  return req.ip || req.socket?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
}

function rateLimitMiddleware(req, res, next) {
  const clientId = getClientId(req);
  const now = Date.now();

  // Clean up old entries
  if (requests.has(clientId)) {
    const clientRequests = requests.get(clientId);
    requests.set(clientId, clientRequests.filter(time => now - time < WINDOW_MS));
  }

  const clientRequests = requests.get(clientId) || [];
  
  if (clientRequests.length >= MAX_REQUESTS) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.' 
    });
  }

  clientRequests.push(now);
  requests.set(clientId, clientRequests);

  next();
}

module.exports = rateLimitMiddleware;

