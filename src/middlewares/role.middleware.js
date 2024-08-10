export default function roleMiddleware(allowedRoles) {
  return function (req, res, next) {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
}
