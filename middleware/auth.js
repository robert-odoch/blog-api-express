const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  // Get the token form the header if present
  const token = req.headers['x-access-token'] || req.headers['authorization']
  if (!token) {
    return res.status(401).json({
      'status': 'error',
      'message': 'Access denied because no token was provided'
    })
  }

  try {
    // If can verify token, set req.user and pass to the next middleware
    const decoded = jwt.verify(token, config.get('privateKey'))
    req.user = decoded
    next()
  }
  catch (e) {
    res.status(400).json({
      'status': 'error',
      'message': 'Invalid token!'
    })
  }
}
