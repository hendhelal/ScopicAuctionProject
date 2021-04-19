const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  bids:{type:[Number],required:false},
  endDate:{ type: Date, required: true }
});

module.exports = mongoose.model('Item', itemSchema);
