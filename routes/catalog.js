let express = require('express');
let router = express.Router();

const debug = require('debug')('catalogRouter');

const Category = require('../models/category');
const Item = require('../models/item');

const currency = require('../models/currency');

router.get('/', async function (req, res, next) {
  let items, categories;
  try {
    items = await Item.find({});
    categories = await Category.find({});
  } catch (err) {
    debug(err);
  }
  res.render('catalog', { items, currency, categories });
});

module.exports = router;
