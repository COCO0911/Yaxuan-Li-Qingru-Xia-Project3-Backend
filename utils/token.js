const jwt = require('jsonwebtoken');

const tokenKey = 'XfZEpWEn?ARD7rHBN';

const TOKEN_EXPIRE_SENCOND = 3600 * 1000 + 's';

const Token = {
  encrypt: function (data) {
    return jwt.sign({ userdata: data }, tokenKey, {
      expiresIn: TOKEN_EXPIRE_SENCOND,
    });
  },

  decrypt: function (token) {
    try {
      let data = jwt.verify(token, tokenKey);
      return {
        token: true,
        data: data,
      };
    } catch (e) {
      return {
        token: false,
        data: e,
      };
    }
  },
};

module.exports = Token;
