let express = require('express');
let router = express.Router();

const debug = require('debug')('indexRouter');

const Item = require('../models/item');

/* GET home page. */
router.get('/', function (req, res, next) {
  Promise.all([Item.getCount(), Item.getCount('out')])
    .then((values) => {
      res.render('index', {
        title: 'OnIce',
        nOfProducts: values[0],
        nOutOfStock: values[1],
      });
    })
    .catch((err) => {
      debug(err);
    });
});

module.exports = router;
