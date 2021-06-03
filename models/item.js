const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const ItemSchema = new Schema({
  category: { required: true, type: ObjectId, ref: 'Category' },
  name: {
    required: true,
    type: String,
    minLength: 1,
    maxLength: 150,
  },
  desc: {
    type: String,
    minLength: 1,
    maxLength: 2000,
  },
  stock: {
    default: 0,
    type: Number,
    min: 0,
  },
  price: {
    type: Number,
  },
  img: {
    type: String,
  },
});

ItemSchema.virtual('url').get(function () {
  return `/catalog/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
