const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const characterSchema = new mongoose.Schema({
  inventory_id: {
    type: ObjectId,
    ref: 'Inventory',
    required: true,
  },
  questbook_id: {
    type: ObjectId,
    ref: 'Questbook',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  level: {
    type: Number,
    default: 1,
  },
  charClass: {
    type: String,
    enum: ['', 'Warrior', 'Hunter', 'Mage', 'Druid'],
    default: '',
  },
  avatar: {
    type: String,
    default: 'http://icons.iconarchive.com/icons/chanut/role-playing/256/Villager-icon.png',
  },
  expRequired: {
    type: Number,
    default: 0,
  },
  exp_points: {
    type: Number,
    default: 0,
  },
  maxHealth: {
    type: Number,
    default: 0,
  },
  health: {
    type: Number,
    default: 0,
  },
  physical_power: {
    type: Number,
    default: 0,
  },
  magical_power: {
    type: Number,
    default: 0,
  },
});

function validateCharacter(character) {
  const schema = Joi.object({
    inventory_id: Joi.objectId().required(),
    questbook_id: Joi.objectId().required(),
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    level: Joi.number().min(0),
    charClass: Joi.valid('Warrior', 'Hunter', 'Mage', 'Druid'),
    avatar: Joi.string(),
    expRequired: Joi.number().min(0),
    exp_points: Joi.number().min(0),
    maxHealth: Joi.number().min(0),
    health: Joi.number().min(0),
    physical_power: Joi.number().min(0),
    magical_power: Joi.number().min(0),
  });

  return schema.validate(character);
}

exports.character = characterSchema;
exports.validateCharacter = validateCharacter;
