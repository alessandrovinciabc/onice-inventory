let express = require('express');
let router = express.Router();

const { body, validationResult } = require('express-validator');

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

  res.render('catalogView', { items, currency, categories: converted });
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

  res.render('categoryView', { currency, category, items });
});

router.get('/item/:id', (req, res, next) => {
  Item.findById(req.params.id, (err, item) => {
    if (err || item == null) next(createError(404));

    res.render('itemView', { currency, item });
  });
});

router.get('/item/:id/edit', (req, res, next) => {
  Item.findById(req.params.id, (err, item) => {
    if (err || item == null) next(createError(404));

    res.render('itemEditView', { currency, item });
  });
});

router.post(
  '/item/:id/edit',
  body('name').isString().escape().trim().isLength({ min: 1, max: 150 }),
  body('desc').isString().escape().trim().isLength({ max: 2000 }),
  body('stock').isInt({ min: 0 }),
  body('price').isFloat({ min: 0 }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return next(createError(400, 'Invalid request format'));

    let properties = req.body;
    let itemToChange = await Item.findById(req.params.id);

    itemToChange.set(properties);
    itemToChange.save();
    res.redirect(await itemToChange.url);
  }
);

module.exports = router;
