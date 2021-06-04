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

router.get('/category/new', (req, res) => {
  res.render('categoryNewView');
});

router.post(
  '/category/new',
  body('name').isString().escape().trim().isLength({ min: 1, max: 100 }),
  body('desc').default('').isString().escape().trim().isLength({ max: 2000 }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return next(createError(400, 'Invalid request format'));

    let properties = req.body;
    let newCategory;
    try {
      newCategory = await Category.create(properties);
    } catch (err) {
      return next(createError(500, 'Unexpected error.'));
    }

    res.redirect(await newCategory.url);
  }
);

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

router.get('/category/:id/edit', (req, res, next) => {
  Category.findById(req.params.id, (err, category) => {
    if (err || category == null) next(createError(404));

    res.render('categoryEditView', { category });
  });
});

router.post(
  '/category/:id/edit',
  body('name').isString().escape().trim().isLength({ min: 1, max: 100 }),
  body('desc')
    .optional({ checkFalsy: true })
    .isString()
    .escape()
    .trim()
    .isLength({ max: 2000 }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return next(createError(400, 'Invalid request format'));

    let properties = req.body;
    let categoryToChange = await Category.findById(req.params.id);

    categoryToChange.set(properties);
    categoryToChange.save();
    res.redirect(await categoryToChange.url);
  }
);

router.get('/item/new', async (req, res) => {
  let categories;
  try {
    categories = await Category.find({});
  } catch (err) {
    return next(createError(500, 'Unexpected error.'));
  }
  res.render('itemNewView', { currency, categories });
});

router.post(
  '/item/new',
  body('name').isString().escape().trim().isLength({ min: 1, max: 150 }),
  body('desc').default('').isString().escape().trim().isLength({ max: 2000 }),
  body('stock').default(0).isInt({ min: 0 }).toInt(),
  body('price').default(0).isFloat({ min: 0 }).toFloat(),
  async (req, res, next) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) return next(createError(400, 'Bad request.'));

    let newItem;
    try {
      newItem = await Item.create(req.body);
    } catch (err) {
      return next(createError(500, 'Something unexpected happen.'));
    }

    res.redirect(newItem.url);
  }
);

router.get('/item/:id', (req, res, next) => {
  Item.findById(req.params.id, (err, item) => {
    if (err || item == null) next(createError(404));

    res.render('itemView', { currency, item });
  });
});

router.get('/item/:id/edit', async (req, res, next) => {
  let item, categories;
  try {
    categories = await Category.find({});
    item = await Item.findById(req.params.id);
  } catch (err) {
    return next(createError(500, 'Unexpected error.'));
  }

  if (item == null) next(createError(404));

  res.render('itemEditView', { currency, item, categories });
});

router.post(
  '/item/:id/edit',
  body('name').isString().escape().trim().isLength({ min: 1, max: 150 }),
  body('desc').isString().escape().trim().isLength({ max: 2000 }),
  body('stock').default(0).isInt({ min: 0 }).toInt(),
  body('price').default(0).isFloat({ min: 0 }).toFloat(),
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
