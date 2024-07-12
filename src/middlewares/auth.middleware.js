import jsonwebtoken from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const jwt = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.userId = jwt;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}