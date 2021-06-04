let express = require('express');
let router = express.Router();

const createError = require('http-errors');

const debug = require('debug')('catalogRouter');

const Category = require('../models/category');
const Item = require('../models/item');

const currency = require('../models/currency');

router.get('/', async function (req, res) {
  let items, categories;
  try {
    items = await Item.find({});
    categories = await Category.find({});
  } catch (err) {
    debug(err);
  }

  let converted = categories.map((category) =>
    category.toObject({ virtuals: true })
  );

  res.render('catalog', { items, currency, categories: converted });
});

router.get('/category/:id', async function (req, res, next) {
  let category;

  try {
    category = await Category.findById(req.params.id);
    items = await Item.find({ category: req.params.id });
  } catch (err) {
    debug(err);
    return next(createError(400, 'Invalid URL.'));
  }

  if (category == null) next(createError(404, 'Resource was not found'));

  res.render('category', { currency, category, items });
});

module.exports = router;
