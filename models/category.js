const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const Item = require('./item');

const CategorySchema = new Schema({
  name: { required: true, type: String, minLength: 1, maxLength: 100 },
  description: { type: String, minLength: 1, maxLength: 2000 },
});

CategorySchema.virtual('url').get(function () {
  return `/catalog/category/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);
