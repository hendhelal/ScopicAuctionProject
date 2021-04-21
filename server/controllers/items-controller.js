const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/httpError');
const Item = require('../models/item');

const getItems = async (req, res, next) => {

  let items;
  try {
    items = await Item.find({});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not get items.',
      500
    );
    return next(error);
  }

  if (!items) {
    const error = new HttpError(
      'Could not find items.',
      404
    );
    return next(error);
  }

  res.json({ items: items });
};
const getItemById = async (req, res, next) => {
  const itemId = req.params.id;

  let item;
  try {
    item = await Item.findById(itemId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find item.',
      500
    );
    return next(error);
  }

  if (!item) {
    const error = new HttpError(
      'Could not find item with the provided id.',
      404
    );
    return next(error);
  }

  res.json({ item: item.toObject({ getters: true }) });
};



const createItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, description, price, endDate} = req.body;
  

  const createdItem = new Item({
    name,
    description,
    price,
    image: req.file.path,
    endDate

  });

 

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdItem.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating Item failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ item: createdItem });
};

const updateItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, description,endDate,price } = req.body;
  const itemId = req.params.id;
 
  let item;
  try {
    item = await Item.findById(itemId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update Item.',
      500
    );
    return next(error);
  }

 

  item.name = name;
  item.description = description;
   item.endDate=endDate;
   item.price=price;

  try {
    await item.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update item.',
      500
    );
    return next(error);
  }

  res.status(200).json({ item: item.toObject({ getters: true }) });
};
const updateItemBids = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const itemId = req.params.id;

  let item;
  try {
    item = await Item.findById(itemId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update Item.',
      500
    );
    return next(error);
  }
  item.bids=req.body ;


  try {
    await item.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update item.',
      500
    );
    return next(error);
  }

  res.status(200).json({ item: item.toObject({ getters: true }) });
};
const deleteItem = async (req, res, next) => {
  const itemId = req.params.id;

  let item;
  try {
    item = await Item.findById(itemId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete item.',
      500
    );
    return next(error);
  }

  if (!item) {
    const error = new HttpError('Could not find item with this id.', 404);
    return next(error);
  }

  const imagePath = item.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await item.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete item.',
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted item.' });
};

exports.getItems=getItems;
exports.getItemById = getItemById;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
exports.updateItemBids=updateItemBids;
