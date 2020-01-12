const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  type: {
    type: String,
    enum: ['', 'Physical', 'Mental', 'Utility'],
    default: '',
  },
  category: {
    type: String,
    enum: ['', 'Daily', 'Weekly', 'Monthly', 'Events', 'Encounters'],
    default: '',
  },
  duration: {
    type: Number,
    default: 1,
  },
  exp: {
    type: Number,
    default: 0,
  },
  gold: {
    type: Number,
    default: 0,
  },
  penalty: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ['', 'in_progress', 'completed', 'failed'],
    default: '',
  },
});

function validateTask(task) {
  const schema = Joi.object({
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    description: Joi.string()
      .min(5)
      .max(50)
      .required(),
    type: Joi.valid('Physical', 'Mental', 'Utility'),
    category: Joi.valid('Daily', 'Weekly', 'Monthly', 'Events', 'Encounters'),
    duration: Joi.number().min(0),
    exp: Joi.number().min(0),
    gold: Joi.number().min(0),
    penalty: Joi.number().min(0),
    status: Joi.valid('', 'in_progress', 'completed', 'failed'),
  });
  return schema.validate(task);
}

const Task = mongoose.model('Task', taskSchema);

exports.task = taskSchema;
exports.Task = Task;
exports.validateTask = validateTask;
