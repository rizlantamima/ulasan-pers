
module.exports = function (secret) {
  const jwt = require('jsonwebtoken');
  return function (req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({
        message:'Unauthorized'
      });
    }
    
    const token = authorization.split(' ')[1];
    
    try {
      const payload = jwt.verify(token, secret);
      req.auth = payload
      next();
    } catch (err) {
      return res.status(401).json({
        message:err.name
      });
    }
    
  }
}