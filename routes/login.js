var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserSchema = require('../models/user.server.model');
var User = mongoose.model('User', UserSchema);
var { genPassword, exportPassword } = require('./../utils/cryp');
var moment = require('moment');

var Token = require('./../utils/token');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function (req, res, next) {
  console.log(req.body);
  let Firstname = req.body.Firstname;
  let Lastname = req.body.Lastname;
  let Email = req.body.Email;
  let password = req.body.password;
  let description = req.body.description;
  User.find(
    {
      Email: Email,
    },
    function (err, docs) {
      if (err) {
        console.log('Error:');
        return next();
      } else {
        if (docs.length == 0) {
          var user = new User({
            oid: createUUID(6, 16) + Date.parse(new Date()),
            Firstname: Firstname,
            Lastname: Lastname,
            Email: Email,
            password: genPassword(password),
            description: description,
            datetime: moment().format('YYYY-MM-DD'),
            state: '',
          });
          user.save(
            {
              oid: createUUID(6, 16) + Date.parse(new Date()),
              Firstname: Firstname,
              Lastname: Lastname,
              Email: Email,
              password: genPassword(password),
              description: description,
              datetime: moment().format('YYYY-MM-DD'),
              state: '',
            },
            function (err, doc) {
              if (err) {
                res.send('Error');
                res.json({ result: err });
                return next();
              } else {
                const tokenStr = Token.encrypt(doc);
                res.json({
                  code: '000',
                  result: 'registered successfully',
                  msg: doc,
                  token: tokenStr,
                });
              }
            }
          );
        } else {
          res.json({ code: '001', result: 'User registered', userstate: docs });
        }
        console.log(docs.length);
      }
    }
  );
  return false;
});

router.post('/login', function (req, res, next) {
  let Email = req.body.Email;
  let password = req.body.password;
  console.log(genPassword(password));
  console.log(Email);
  User.find(
    {
      Email: Email,
      password: genPassword(password),
    },
    function (err, docs) {
      if (err) {
        console.log('Error:' + err);
        return next();
      } else {
        if (docs.length != 0) {
          const tokenStr = Token.encrypt(docs[0]);
          res.json({
            code: '000',
            result: 'login success',
            msg: docs[0],
            token: tokenStr,
          });
        } else {
          res.json({
            code: '001',
            result: 'Please reenter the incorrect information',
          });
        }
      }
    }
  );
});

router.post('/yzpassword', function (req, res, next) {
  var m = crypto.createHash('md5');
  let basepassword = req.body.basepassword;
  let password = req.body.password;
  m.update(password, 'utf8');
  const result = m.digest('hex').toUpperCase();
  console.log(result == basepassword);
  if (result == basepassword) {
    res.json({ code: '000', result: 'success' });
  } else {
    res.json({ code: '001', result: 'error' });
  }
  return false;
});

router.post('/changepassword', function (req, res, next) {
  var m = crypto.createHash('md5');
  var m2 = crypto.createHash('md5');
  let basepassword = req.body.basepassword;
  let password = req.body.password;
  let newpassword = req.body.newpassword;
  m.update(password, 'utf8');
  m2.update(newpassword, 'utf8');
  const result = m.digest('hex').toUpperCase();
  const result2 = m2.digest('hex').toUpperCase();
  if (result == basepassword) {
    User.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          password: result2,
        },
      },
      {
        new: true,
      }
    )
      .then(state => {
        console.log(state);
        res.json({ code: '000', result: state });
      })
      .catch(err => res.json(err));
  } else {
    res.json({
      code: '001',
      result: 'The original password was incorrectly entered',
    });
  }
  return false;
});

router.get('/userstate', function (req, res, next) {
  let userinfo = Token.decrypt(req.headers.authorization);
  console.log(userinfo);
  if (userinfo.token == true) {
    userinfo.data.userdata.password = exportPassword(
      userinfo.data.userdata.password
    );
    res.json({
      ret: '000',
      message: 'Successfully obtained user information',
      data: userinfo,
    });
  } else {
    res.json({
      ret: '001',
      message: 'Token parsing failed, please log in again',
      data: '',
    });
  }
});

function createUUID(len, radix) {
  var chars = '0123456789'.split('');
  var uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)];
    }
  }
  return '-' + uuid.join('');
}
module.exports = router;
