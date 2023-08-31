const jwt = require('jsonwebtoken');
const private_key = process.env.PRIVATE_KEY;

const authenticateJWT = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
      return res.status(401).json({ message });
    }
    const decoded = jwt.verify(token, private_key);
    req.user = decoded; // crée une propriété user dans req qui va me permettre de passer un userId directement dans mes routes si besoin.
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(400).json({ message: 'An error occurred', error });
  }
};

module.exports = authenticateJWT;
