import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise';
const JWT_EXPIRES_IN = '7d';

export function createSession(userId, userData) {
  const payload = {
    userId,
    userData,
    iat: Date.now()
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function getSession(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log('Token JWT invalide:', error.message);
    return null;
  }
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/'
};

export function removeSession(token) {
  return true;
}

export function cleanupSessions() {
  console.log('Nettoyage des sessions : non nécessaire avec JWT');
}

setInterval(cleanupSessions, 60 * 60 * 1000);
