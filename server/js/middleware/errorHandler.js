export function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const status = err.status || 500;

  const message = err.message || "Une erreur est survenue";

  res.status(status).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
}
