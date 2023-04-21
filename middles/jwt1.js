var { unless } = require('express-unless');
const jwt = require('jsonwebtoken');
const key = 'hello';
function getUserState(req, res, next) {
  console.log('req', req.headers.authorization);
  let userinfo = jwt.decode(req.headers.authorization, key);
  console.log(userinfo);

  if (err.name === 'UnauthorizedError') {
    return res.json({
      ret: 401,
      message: 'The login information is incorrect, please log in again',
    });
  } else {
    next();
  }
}
module.exports = {
  getUserState: getUserState,
};
