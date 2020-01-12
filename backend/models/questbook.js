const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const questbookSchema = new mongoose.Schema({
  tasks: [
    {
      type: Object,
      ref: 'Task',
      default: [],
    },
  ],
});

function validateQuestbook(questbook) {
  const schema = Joi.object({
    tasks: Joi.array().items(Joi.object),
  });

  return schema.validate(questbook);
}

exports.questbook = questbookSchema;
exports.validateQuestbook = validateQuestbook;
