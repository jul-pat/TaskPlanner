const jwt = require('jsonwebtoken');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    default: 'User',
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
    trim: true,
  },
  character_id: {
    type: ObjectId,
    ref: 'Character',
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    process.env.JWTPRIVATEKEY,
  );
  return token;
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(26)
      .trim(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email()
      .trim(),
    password: Joi.string()
      .min(8)
      .max(26)
      .required()
      .trim(),
    character_id: Joi.objectId(),
    isAdmin: Joi.boolean(),
  });

  return Joi.validate(user, schema);
}

exports.user = userSchema;
exports.validateUser = validateUser;
