require('dotenv').config();
require('./models/setupDB')();
const debug = require('debug')('populateDB');
const mongoose = require('mongoose');

const Category = require('./models/category');
const Item = require('./models/item');

let newCategoriesData = [
  {
    name: 'Gloves',
    description: 'Get a grip on the ice!',
  },
  { name: 'Pre-fitted Skates', description: 'Get started now.' },
  { name: 'Boots' },
  { name: 'Blades' },
];

let newCategories = newCategoriesData.map((category) => new Category(category));

let newItems = [
  {
    category: newCategories[1]._id,
    name: 'Standard ice skates',
    description:
      'Perfect for anyone that just wants to chill on a frozen lake!',
    stock: 50,
    price: 58.49,
  },
  {
    category: newCategories[1]._id,
    name: 'Intermediate skates',
    stock: 15,
    price: 75.25,
  },
  {
    category: newCategories[2]._id,
    name: 'Entry-level Figure skating boots',
    description: 'No blades included.',
    stock: 99,
    price: 47.95,
  },
  {
    category: newCategories[3]._id,
    name: 'Standard blades',
    stock: 125,
    price: 25,
  },
  {
    category: newCategories[3]._id,
    name: 'Professional ice skating blades',
    stock: 125,
    price: 25,
  },
];

Promise.all([Category.insertMany(newCategories), Item.insertMany(newItems)])
  .then((values) => {
    mongoose.connection.close();
    debug('Succesfully added new documents to the DB.');
  })
  .catch((err) => {
    debug(err);
  });
