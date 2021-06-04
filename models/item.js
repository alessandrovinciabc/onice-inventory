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
    default: '',
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

ItemSchema.static('getCount', function (type = 'all') {
  const validValues = ['all', 'out'];

  if (!validValues.includes(type))
    throw new Error('Invalid filter. Must be a value in: ["all", "out"].');

  let filter = type === 'all' ? {} : { stock: 0 };

  return this.countDocuments(filter).exec();
});

module.exports = mongoose.model('Item', ItemSchema);
