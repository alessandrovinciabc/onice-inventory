require('dotenv').config();
require('./models/setupDB')();
const debug = require('debug')('populateDB');
const mongoose = require('mongoose');

const Category = require('./models/category');
const Item = require('./models/item');

let categories = [
  {
    name: 'Skates',
    description: 'High quality equipment for ice figure skating',
  },
  {
    name: 'Gloves',
    description: 'Get a grip on the ice!',
  },
];

let skates = new Category(categories[0]);
let gloves = new Category(categories[1]);

let subCategories = [
  { name: 'Pre-fitted', parent: skates._id },
  { name: 'Boots', parent: skates._id },
  { name: 'Blades', parent: skates._id },
];

subCategories = subCategories.map((category) => new Category(category));

let newItems = [
  {
    category: subCategories[0]._id,
    name: 'Standard ice skates',
    description:
      'Perfect for anyone that just wants to chill on a frozen lake!',
    stock: 50,
    price: 58.49,
  },
  {
    category: subCategories[0]._id,
    name: 'Intermediate skates',
    stock: 15,
    price: 75.25,
  },
  {
    category: subCategories[1]._id,
    name: 'Entry-level Figure skating boots',
    description: 'No blades included.',
    stock: 99,
    price: 47.95,
  },
  {
    category: subCategories[2]._id,
    name: 'Standard blades',
    stock: 125,
    price: 25,
  },
  {
    category: subCategories[2]._id,
    name: 'Professional ice skating blades',
    stock: 125,
    price: 25,
  },
];

Promise.all([
  gloves.save(),
  skates.save(),
  Category.insertMany(subCategories),
  Item.insertMany(newItems),
])
  .then((values) => {
    mongoose.connection.close();
    debug('Succesfully added new documents to the DB.');
  })
  .catch((err) => {
    debug(err);
  });
