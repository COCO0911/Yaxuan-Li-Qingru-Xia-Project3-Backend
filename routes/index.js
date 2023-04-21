var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var articleSchema = require('../models/article.server.model');
var article = mongoose.model('article', articleSchema);
var UserSchema = require('../models/user.server.model');
var User = mongoose.model('User', UserSchema);
var userdata = require('./../public/userlist.json');
var moment = require('moment');

var { uploadFile } = require('./../middles/uploadFile');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/find', function (req, res, next) {
  article.find(function (err, docs) {
    if (err) {
      console.log('Error:');
      return next();
    }
    res.json(docs);
  });
});

router.post('/finduserArticle', function (req, res, next) {
  article.find(
    {
      id: req.body._id,
    },
    function (err, docs) {
      if (err) {
        console.log('Error:');
        return next();
      }
      res.json(docs);
    }
  );
});

router.post('/findArticle', function (req, res, next) {
  article.findOne(
    {
      _id: req.body._id,
    },
    function (err, docs) {
      if (err) {
        console.log('Error:');
        return next();
      }
      res.json(docs);
    }
  );
});

router.post('/addarticle', uploadFile, function (req, res, next) {
  var list = new article({
    title: req.body.title,
    description: req.body.description,
    uid: req.body.uid,
    mainpng: req.body.photo,
    datetime: moment().format('YYYY-MM-DD'),
  });
  list.save(
    {
      title: req.body.title,
      description: req.body.description,
      uid: req.body.uid,
      mainpng: req.body.photo,
      datetime: moment().format('YYYY-MM-DD'),
    },
    function (err, doc) {
      if (err) {
        res.json({
          ret: '001',
          message: 'add article fail',
          data: err,
        });
      } else {
        res.json({
          ret: '000',
          message: 'success',
          data: doc,
        });
      }
    }
  );
});

router.post('/articleUserData', function (req, res, next) {
  article.aggregate(
    [
      { $match: { uid: req.body._id } },
      {
        $lookup: {
          from: 'users',
          let: { uid: { $toObjectId: '$uid' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
            { $project: { oid: 1, Firstname: 1, Lastname: 1, Email: 1 } },
          ],
          as: 'user_data',
        },
      },
    ],
    function (err, result) {
      console.log(result);
      res.json(result);
    }
  );
});

router.get('/articleList', function (req, res, next) {
  article.aggregate(
    [
      {
        $lookup: {
          from: 'users',
          let: { uid: { $toObjectId: '$uid' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
            { $project: { oid: 1, Firstname: 1, Lastname: 1, Email: 1 } },
            // { $project: { oid: 1, Firstname: 1, Lastname: 1, Email: 1, password: 1, description: 1, datetime: 1 } }
          ],
          as: 'user_data',
        },
      },
    ],
    function (err, result) {
      if (err) throw err;

      console.log(result);
      res.json(result);
    }
  );
});

router.delete('/articleDelete', (req, res) => {
  console.log(req.body._id);
  article
    .findOneAndDelete({ _id: req.body._id })
    .then(state => {
      res.json({
        ret: '000',
        message: 'deleted success',
        data: state,
      });
    })
    .catch(err => {
      res.json({
        ret: '001',
        message: 'deleted error',
        data: err,
      });
    });
});

router.put('/articleChange', uploadFile, (req, res) => {
  console.log(req.body._id);

  const changedata = {
    title: req.body.title,
    description: req.body.description,
  };
  if (req.body.photo != '') {
    changedata.mainpng = req.body.photo;
  }
  article
    .findOneAndUpdate(
      { _id: req.body.uid },
      {
        $set: changedata,
      },
      {
        new: true,
      }
    )
    .then(state => res.json({ result: state }))
    .catch(err => res.json(err));
});

router.post('/pay', function (req, res, next) {
  let data = JSON.parse(req.body.goods);
  console.log(data);
  data.forEach(ele => {
    article
      .findOneAndUpdate(
        { _id: ele.uid },
        {
          $set: {
            stock: ele.stock - ele.sum,
          },
        }
      )
      .then(state => {
        console.log('success');
      })
      .catch(err => {
        console.log('error');
      });
  });

  res.json({ code: '000', result: 'success' });
});

router.get('/add', function (req, res, next) {
  userdata.forEach(ele => {
    var article = new article({
      title: ele.title,
      brand: ele.brand,
      image: ele.image,
      stock: ele.stock,
      seller: ele.seller,
      price: ele.price,
      reviews: JSON.stringify(ele.reviews),
      disabled: ele.disabled,
    });
    article.save(
      {
        title: ele.title,
        brand: ele.brand,
        image: ele.image,
        stock: ele.stock,
        seller: ele.seller,
        reviews: JSON.stringify(ele.reviews),
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
