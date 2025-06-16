import { getSession } from "../cache.js";

export function requireAuth(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    if (req.xhr || req.path.startsWith("/api/")) {
      return res.status(401).json({
        success: false,
        message: "Authentification requise",
      });
    }
    return res.redirect("/login");
  }

  const sessionData = getSession(token);
  if (!sessionData || !sessionData.userId) {
    res.clearCookie("authToken");

    if (req.xhr || req.path.startsWith("/api/")) {
      return res.status(401).json({
        success: false,
        message: "Session expirée, veuillez vous reconnecter",
      });
    }
    return res.redirect("/login");
  }

  req.user = {
    userId: sessionData.userId,
    userData: sessionData.userData,
  };

  next();
}

export function requireGuest(req, res, next) {
  const token = req.cookies.authToken;

  if (token) {
    const sessionData = getSession(token);
    if (sessionData && sessionData.userId) {
      return res.redirect("/");
    }
    res.clearCookie("authToken");
  }

  next();
}
