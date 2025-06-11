/**
 * Middleware pour vérifier le consentement aux cookies
 * @param {import('express').Request} req - La requête
 * @param {import('express').Response} res - La réponse
 * @param {import('express').NextFunction} next - La fonction next
 */
export function checkCookieConsent(req, res, next) {
  const publicPages = [
    "/login",
    "/register",
    "/privacy.html",
    "/",
    "/home.html",
  ];
  const isPublicPage = publicPages.some(
    (page) => req.path === page || req.path.endsWith(page)
  );

  if (isPublicPage) {
    return next();
  }
  const cookieConsent = req.headers["cookie-consent"];

  if (cookieConsent === "refused") {
    res.setHeader("X-Cookie-Consent", "refused");

    if (req.session) {
      req.session.limitedAccess = true;
    }
  }

  next();
}

/**
 * Middleware pour gérer les réponses selon le consentement
 */
export function handleConsentResponse(req, res, next) {
  const originalJson = res.json;

  res.json = function (data) {
    const cookieConsent = req.headers["cookie-consent"];

    if (cookieConsent === "refused" && data.success) {
      data.warning = "Fonctionnalités limitées - cookies refusés";
    }

    return originalJson.call(this, data);
  };

  next();
}
