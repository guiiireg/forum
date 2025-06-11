/**
 * Middleware de vérification d'authentification
 * @param {import('express').Request} req - La requête
 * @param {import('express').Response} res - La réponse
 * @param {import('express').NextFunction} next - La fonction next
 */
export function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    if (req.xhr || req.path.startsWith("/api/")) {
      return res.status(401).json({
        success: false,
        message: "Authentification requise",
      });
    }
    return res.redirect("/login");
  }
  next();
}

/**
 * Middleware pour vérifier si l'utilisateur n'est PAS connecté
 * (utile pour les pages de login/register)
 * @param {import('express').Request} req - La requête
 * @param {import('express').Response} res - La réponse
 * @param {import('express').NextFunction} next - La fonction next
 */
export function requireGuest(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect("/");
  }
  next();
}
