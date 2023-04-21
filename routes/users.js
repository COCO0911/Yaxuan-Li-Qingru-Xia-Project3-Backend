var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserSchema = require('../models/user.server.model');
var User = mongoose.model('User', UserSchema);
var userdata = require('./../public/userlist.json');
var { genPassword, exportPassword } = require('./../utils/cryp');

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/adddata', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/find', function (req, res, next) {
  User.find(function (err, docs) {
    if (err) {
      console.log('Error:');
      return next();
    }
    res.json(docs);
  });
});

router.get('/finduser', function (req, res, next) {
  console.log(req.query);
  User.findOne(
    {
      _id: req.query._id,
    },
    function (err, docs) {
      if (err) {
        res.json({
          ret: '001',
          message: '用户信息不存在',
          data: docs,
        });
      } else {
        res.json({
          ret: '000',
          message: 'success',
          data: docs,
        });
      }
    }
  );
});

router.put('/change', (req, res) => {
  console.log(req.body);
  User.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: {
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
        Email: req.body.Email,
        password: genPassword(req.body.password),
        description: req.body.description,
        state: req.body.state,
      },
    },
    {
      new: true,
    }
  )
    .then(state => {
      res.json({
        ret: '000',
        message: 'success',
        data: state,
      });
    })
    .catch(err => {
      res.json({
        ret: '001',
        message: err,
        data: err,
      });
    });
});

router.get('/add', function (req, res, next) {
  userdata.forEach(ele => {
    var user = new User({
      oid: ele._id.$oid,
      Firstname: ele.Firstname,
      Lastname: ele.Lastname,
      Email: ele.Email,
      password: ele.password,
    });
    user.save(
      {
        oid: ele._id.$oid,
        Firstname: ele.Firstname,
        Lastname: ele.Lastname,
        Email: ele.Email,
        password: ele.password,
      },
      function (err, doc) {
        if (err) {
          res.send('Error');
          res.json({ result: err });
          return next();
        } else {
          console.log(doc);
        }
      }
    );
  });
  res.json({ result: 'Successfully added data' });
});

module.exports = router;
