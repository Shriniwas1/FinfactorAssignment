module.exports = (err, req, res, next) => {
  console.error('ERR:', err && err.message ? err.message : err);
  
  const status = err.status || 500;
  res.status(status).json({ ok: false, error: err.message || 'Internal Server Error' });
};
