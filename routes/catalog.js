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

  let converted = categories.map((category) => category.toObject());
  let idMap = new Map();

  converted.forEach((category) => {
    if (category.parent == null) return;

    let parentId, currentId;

    parentId = category.parent.toString();
    currentId = category._id.toString();

    if (!idMap.has(parentId)) {
      idMap.set(parentId, [currentId]);
    } else {
      idMap.get(parentId).push(currentId);
    }
  });

  let withChildren = converted.map((category) => {
    let copy, currentId, mapData;

    copy = JSON.parse(JSON.stringify(category));

    currentId = category._id.toString();

    mapData = idMap.get(currentId);
    copy.children = mapData || [];

    return copy;
  });

  withChildren.sort((a, b) => b.children.length - a.children.length);

  res.render('catalog', { items, currency, categories: withChildren });
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
