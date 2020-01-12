const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const inventorySchema = new mongoose.Schema({
  backpack: {
    type: [ObjectId],
    ref: 'Item',
    default: [],
  },
  gold: {
    type: Number,
    default: 0,
  },
  equippedItems: {
    type: [ObjectId],
    ref: 'Item',
    default: [],
  },
});

function validateInventory(inventory) {
  const schema = Joi.object({
    backpack: Joi.array().items(Joi.objectId),
    gold: Joi.number().min(0),
    equippedItems: Joi.array().items(Joi.objectId),
  });

  return schema.validate(inventory);
}

exports.inventory = inventorySchema;
exports.validateInventory = validateInventory;
